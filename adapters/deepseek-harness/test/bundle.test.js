import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { apply, applyLearningTransaction, inspectWorkspace, panelStatus, recordLearningEvent, routeLearningEvent, setupGate } from '../index.js'

const exec = promisify(execFile)

async function git(root, ...args) {
  return (await exec('git', ['-C', root, ...args], { encoding: 'utf8' })).stdout.trim()
}

async function learnerRepo(mode = 'safe-auto') {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-record-'))
  await git(root, 'init')
  await git(root, 'config', 'user.name', 'GitLearnOS Test')
  await git(root, 'config', 'user.email', 'test@gitlearnos.invalid')
  await mkdir(join(root, 'subjects', 'math', 'goals'), { recursive: true })
  await writeFile(join(root, 'gitlearnos.yml'), `protocol: 2.0-draft\nmode: ${mode}\nidentity:\n  repo_id: test-learner\n  role: learner\n  kind: learner-repository\n  template: false\nsetup:\n  answers:\n    goal: math\n    subject: math\n    material: worksheet\n    rag_choice: declined\n  completed_at: "2026-08-15T00:00:00Z"\n`)
  await writeFile(join(root, 'learning-policy.md'), `# Policy\nMode: ${mode}\n`)
  await writeFile(join(root, 'dashboard.md'), '# Dashboard\n')
  await writeFile(join(root, 'automation.md'), '# Automation\nmaintenance: requested\ndue-review: requested\n')
  await writeFile(join(root, 'AGENTS.md'), '# Agent\n')
  await writeFile(join(root, 'learner-profile.md'), '# Learner\n')
  await writeFile(join(root, 'subjects', 'math', 'goals', 'main-goal.md'), '# Goal\n')
  await git(root, 'add', '.')
  await git(root, 'commit', '-m', 'initialize learner state')
  return root
}

async function head(root) {
  return git(root, 'rev-parse', 'HEAD')
}

function sample(baseRevision) {
  return {
    subject: 'math',
    eventId: 'quadratic-sign-error',
    title: 'Quadratic sign correction',
    body: 'The learner corrected the sign after checking the discriminant.\n\nSource: learner attempt in current session.',
    baseRevision,
  }
}

test('manifest declares a no-build installable DSH bundle', async () => {
  const manifest = await import('node:fs/promises')
    .then(fs => fs.readFile(new URL('../../../package.json', import.meta.url), 'utf8'))
    .then(JSON.parse)
  assert.equal(manifest.type, 'module')
  assert.equal(manifest.main, './adapters/deepseek-harness/index.js')
  assert.equal(manifest.dsh.bundle.patch, './adapters/deepseek-harness/cordis.patch.yml')
  assert.equal(manifest.scripts?.prepare, undefined)
  assert.equal(manifest.scripts?.postinstall, undefined)
})

test('patch inserts the host plugin by stable package name', async () => {
  const patch = await import('node:fs/promises').then(fs => fs.readFile(new URL('../cordis.patch.yml', import.meta.url), 'utf8'))
  assert.match(patch, /^\s*- insert:/m)
  assert.match(patch, /id: gitlearnos-host/)
  assert.match(patch, /name: 'gitlearnos'/)
})

test('apply registers one prompt section, read tools, and a serialized write transaction', () => {
  const sections = []
  const tools = []
  apply({
    systemPrompt: { section(section) { sections.push(section) } },
    tools: { register(tool) { tools.push(tool) } },
  }, { root: process.cwd() })
  assert.equal(sections.length, 1)
  assert.equal(sections[0].name, 'gitlearnos')
  assert.deepEqual(tools.map(tool => tool.name), ['learning_status', 'learning_route', 'learning_apply', 'learning_record'])
  assert.equal(tools.find(tool => tool.name === 'learning_record').isConcurrencySafe(), false)
  assert.match(sections[0].text, /Never claim a file write, Git commit, RAG ingestion/)
})

test('apply registers the loopback-only panel RPC channel when connection is available', async () => {
  const registered = []
  apply({
    systemPrompt: { section() {} },
    tools: { register() {} },
    inject(keys, callback) {
      if (keys.includes('connection')) {
        const scope = {
          connection: { rpc: { handle: (channel, handler, options) => { registered.push({ channel, handler, options }); return () => Promise.resolve() } } },
          effect(fn) { fn() },
        }
        callback(scope)
      }
    },
  }, { root: process.cwd() })
  assert.equal(registered.length, 1)
  assert.equal(registered[0].channel, '/gitlearnos')
  assert.equal(registered[0].options.authority, 'loopback')
  const unknown = await registered[0].handler('bogus', undefined, undefined)
  assert.equal(unknown.ok, false)
  assert.equal(unknown.error.code, 'internal')
  const status = await registered[0].handler('status', undefined, undefined)
  assert.equal(status.ok, true)
  assert.ok(Array.isArray(status.value.topics))
})

test('safe-auto records and commits only one controlled event while preserving unrelated dirty state', async () => {
  const root = await learnerRepo('safe-auto')
  await writeFile(join(root, 'unrelated.md'), 'keep my unstaged work\n')
  await writeFile(join(root, 'staged.md'), 'keep my staged work\n')
  await git(root, 'add', 'staged.md')
  const result = await recordLearningEvent(root, sample(await head(root)))
  assert.equal(result.status, 'committed')
  assert.equal(result.persisted, true)
  assert.deepEqual(result.changedFiles, ['subjects/math/events/quadratic-sign-error.md'])
  assert.equal(result.commit, await head(root))
  assert.equal(result.undo, `git revert ${result.commit}`)
  assert.match(await readFile(join(root, result.path), 'utf8'), /discriminant/)
  assert.deepEqual((await git(root, 'show', '--pretty=', '--name-only', 'HEAD')).split('\n').filter(Boolean), [result.path])
  const working = await git(root, 'status', '--short')
  assert.match(working, /A  staged\.md/)
  assert.match(working, /\?\? unrelated\.md/)
})

test('preview returns the exact proposal with zero writes and manual cannot self-approve', async () => {
  for (const [mode, expected] of [['preview', 'preview'], ['manual', 'requires-approval']]) {
    const root = await learnerRepo(mode)
    const before = await head(root)
    const result = await recordLearningEvent(root, { ...sample(before), approved: true })
    assert.equal(result.status, expected)
    assert.equal(result.persisted, false)
    assert.match(result.proposal, /^# Quadratic sign correction/m)
    assert.equal(await head(root), before)
    assert.equal(await git(root, 'status', '--porcelain'), '')
  }
})

test('setup gate blocks an otherwise safe-auto write', async () => {
  const root = await learnerRepo('safe-auto')
  await rm(join(root, 'learner-profile.md'))
  await git(root, 'add', 'learner-profile.md')
  await git(root, 'commit', '-m', 'simulate incomplete setup')
  const result = await recordLearningEvent(root, sample(await head(root)))
  assert.equal(result.status, 'blocked')
  assert.match(result.reason, /learner-profile\.md/)
  assert.equal(await git(root, 'status', '--porcelain'), '')
})

test('stale base conflicts before writing and an identical retry is idempotent', async () => {
  const root = await learnerRepo('safe-auto')
  const stale = await head(root)
  await writeFile(join(root, 'new-base.md'), 'new revision\n')
  await git(root, 'add', 'new-base.md')
  await git(root, 'commit', '-m', 'advance base')
  const conflict = await recordLearningEvent(root, sample(stale))
  assert.equal(conflict.status, 'conflict')
  assert.equal(await git(root, 'status', '--porcelain'), '')

  const first = await recordLearningEvent(root, sample(await head(root)))
  const revision = await head(root)
  const retry = await recordLearningEvent(root, sample(revision))
  assert.equal(first.status, 'committed')
  assert.equal(retry.status, 'unchanged')
  assert.equal(retry.commit, revision)
  assert.equal(await head(root), revision)
})

test('record rejects traversal, symlink escape, and overwrite with different content', async () => {
  const root = await learnerRepo('safe-auto')
  const revision = await head(root)
  await assert.rejects(() => recordLearningEvent(root, { ...sample(revision), subject: '../math' }), /subject must match/)
  await symlink(tmpdir(), join(root, 'subjects', 'math', 'events'))
  await assert.rejects(() => recordLearningEvent(root, sample(revision)), /events path must be a real directory/)

  const clean = await learnerRepo('safe-auto')
  const first = await recordLearningEvent(clean, sample(await head(clean)))
  const cleanRevision = await head(clean)
  await assert.rejects(
    () => recordLearningEvent(clean, { ...sample(cleanRevision), body: 'Different evidence.' }),
    /overwrite refused/,
  )
  assert.equal(await head(clean), first.commit)
})

test('record does not claim or delete an identical untracked event owned by the user', async () => {
  const root = await learnerRepo('safe-auto')
  await mkdir(join(root, 'subjects', 'math', 'events'))
  await writeFile(
    join(root, 'subjects', 'math', 'events', 'quadratic-sign-error.md'),
    '# Quadratic sign correction\n\nEvent ID: `quadratic-sign-error`\n\nThe learner corrected the sign after checking the discriminant.\n\nSource: learner attempt in current session.\n',
  )
  const revision = await head(root)
  await assert.rejects(() => recordLearningEvent(root, sample(revision)), /uncommitted user content/)
  assert.match(await readFile(join(root, 'subjects', 'math', 'events', 'quadratic-sign-error.md'), 'utf8'), /discriminant/)
})

test('bounded scanner reports effective authority and does not follow escaping symlinks', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-dsh-'))
  await writeFile(join(root, 'gitlearnos.yml'), 'protocol: "2.0-draft"\nmode: safe-auto\n')
  await writeFile(join(root, 'learning-policy.md'), '# Policy\nAutomatic writes: disabled; require approval.\n')
  await writeFile(join(root, 'dashboard.md'), '# Dashboard\n')
  await mkdir(join(root, 'subjects', 'math', 'goals'), { recursive: true })
  await writeFile(join(root, 'subjects', 'math', 'goals', 'main-goal.md'), '# Goal\n')
  await symlink('/etc/passwd', join(root, 'automation.md'))
  const status = await inspectWorkspace(root)
  assert.equal(status.gitRevision, null)
  assert.equal(status.protocol, '2.0-draft')
  assert.equal(status.effectiveMode, 'safe-auto')
  assert.equal(status.files['automation.md'], false)
  assert.deepEqual(status.activeGoals, ['subjects/math/goals/main-goal.md'])
  assert.equal(status.automation.state, 'unknown')
  assert.match(status.limitations[0], /no file write/)
})

test('route is explicit that it did not persist its recommendation', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-route-'))
  await writeFile(join(root, 'gitlearnos.yml'), 'protocol: 2.0-draft\nmode: preview\n')
  const result = await routeLearningEvent(root, 'Make practice questions from this material')
  assert.equal(result.operation, 'question')
  assert.equal(result.effectiveMode, 'preview')
  assert.equal(result.writeAuthorized, false)
  assert.equal(result.persisted, false)
  assert.match(result.nextAction, /preview/)

  const compound = await routeLearningEvent(root, '整理这些笔记，总结规律，再给我两道题')
  assert.deepEqual(compound.operations, ['organize', 'summarize', 'question', 'model'])
  assert.equal(compound.persisted, false)
  assert.match(compound.nextAction, /organize → summarize → question → model/)

  const explicit = await routeLearningEvent(root, { intent: 'continue', operations: ['setup', 'source', 'summarize'] })
  assert.deepEqual(explicit.operations, ['setup', 'source', 'summarize'])
  assert.equal(explicit.persisted, false)
})

test('status exposes the exact Git base required by a safe-auto transaction', async () => {
  const root = await learnerRepo('safe-auto')
  const status = await inspectWorkspace(root)
  assert.equal(status.gitRevision, await head(root))
})

test('learning-policy text cannot override gitlearnos.yml authority', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-policy-'))
  await writeFile(join(root, 'gitlearnos.yml'), 'protocol: 2.0-draft\nmode: safe-auto\nidentity:\n  repo_id: test-learner\n  role: learner\n  kind: learner-repository\n  template: false\n')
  await writeFile(join(root, 'learning-policy.md'), '# Policy\nWrites follow the learner preference.\n')
  const status = await inspectWorkspace(root)
  assert.equal(status.configuredMode, 'safe-auto')
  assert.equal(status.effectiveMode, 'safe-auto')
})

test('dueReview classifies explicit next-review dates and never guesses the rest', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-due-'))
  await mkdir(join(root, 'subjects', 'math', 'reviews'), { recursive: true })
  await mkdir(join(root, 'subjects', 'math', 'models'), { recursive: true })
  await writeFile(join(root, 'subjects', 'math', 'reviews', 'r1.md'), '## Next check\n- Next review date: 2020-01-01.\n')
  await writeFile(join(root, 'subjects', 'math', 'reviews', 'r2.md'), '## Next check\n- Next review date: 2099-01-01.\n')
  await writeFile(join(root, 'subjects', 'math', 'reviews', 'r3.md'), '## Next check\n- Date or next handoff: not yet scheduled.\n')
  await writeFile(join(root, 'subjects', 'math', 'reviews', 'r4.md'), '# Notes\nWithout a real scheduler, record due dates and check on handoff.\n')
  await writeFile(join(root, 'subjects', 'math', 'reviews', 'r5.md'), '## Next check\n- Next review date: 2020-13-40.\n')
  await writeFile(join(root, 'subjects', 'math', 'models', 'm1.md'), 'Next review: 2020-02-02\n')

  const status = await inspectWorkspace(root, new Date('2025-01-01T00:00:00Z'))
  const due = status.dueReview.due
  const upcoming = status.dueReview.upcoming

  assert.deepEqual(status.reviewFiles, [
    'subjects/math/reviews/r1.md',
    'subjects/math/reviews/r2.md',
    'subjects/math/reviews/r3.md',
    'subjects/math/reviews/r4.md',
    'subjects/math/reviews/r5.md',
  ])

  assert.deepEqual(
    due.map(item => [item.path, item.kind, item.dueOn]),
    [
      ['subjects/math/reviews/r1.md', 'review', '2020-01-01'],
      ['subjects/math/models/m1.md', 'model', '2020-02-02'],
    ],
  )
  assert.deepEqual(
    upcoming.map(item => [item.path, item.kind, item.dueOn]),
    [['subjects/math/reviews/r2.md', 'review', '2099-01-01']],
  )
  // r3 (marker, no date), r4 (no marker), r5 (invalid calendar date) are honest no-signal.
  assert.equal(status.dueReview.noSignal, 3)
  assert.match(due[0].marker, /Next review date: 2020-01-01/)
})

test('dueReview is empty and honest when a learner repo has no review or model files', async () => {
  const root = await learnerRepo('safe-auto')
  const status = await inspectWorkspace(root)
  assert.deepEqual(status.dueReview, { due: [], upcoming: [], noSignal: 0 })
  assert.deepEqual(status.reviewFiles, [])
})

test('dueReview does not follow a symlinked review file escaping the workspace', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-due-link-'))
  await mkdir(join(root, 'subjects', 'math', 'reviews'), { recursive: true })
  await writeFile(join(root, 'subjects', 'math', 'reviews', 'real.md'), 'Next review: 2020-01-01\n')
  await symlink('/etc/passwd', join(root, 'subjects', 'math', 'reviews', 'escape.md'))
  const status = await inspectWorkspace(root, new Date('2025-01-01T00:00:00Z'))
  assert.deepEqual(status.reviewFiles, ['subjects/math/reviews/real.md'])
  assert.equal(status.dueReview.due.length, 1)
  assert.equal(status.dueReview.due[0].path, 'subjects/math/reviews/real.md')
})

test('status exposes review and gap evidence without a Host-ranked action queue', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-queue-'))
  await mkdir(join(root, 'subjects', 'math', 'reviews'), { recursive: true })
  await mkdir(join(root, 'subjects', 'math', 'knowledge-gaps'), { recursive: true })
  await writeFile(join(root, 'subjects', 'math', 'reviews', 'r-later.md'), 'Next review date: 2020-02-02.\n')
  await writeFile(join(root, 'subjects', 'math', 'reviews', 'r-earlier.md'), 'Next review date: 2020-01-01.\n')
  await writeFile(join(root, 'subjects', 'math', 'knowledge-gaps', 'quadratic-sign.md'), '# Gap\n')
  const status = await inspectWorkspace(root, new Date('2025-01-01T00:00:00Z'))
  assert.deepEqual(status.knowledgeGaps, ['subjects/math/knowledge-gaps/quadratic-sign.md'])
  assert.deepEqual(status.dueReview.due.map(item => item.path).sort(), [
    'subjects/math/reviews/r-earlier.md',
    'subjects/math/reviews/r-later.md',
  ])
  assert.equal(Object.hasOwn(status, 'actions'), false)
})

test('queue reads the agent-maintained Next up list verbatim, in order', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-nextup-'))
  await writeFile(join(root, 'gitlearnos.yml'), 'protocol: 2.0-draft\nmode: safe-auto\nidentity:\n  repo_id: test-learner\n  role: learner\n  kind: learner-repository\n  template: false\n')
  await writeFile(join(root, 'dashboard.md'), '# Dashboard\n## Next up\n1. 化学平衡移动（跟进）\n2. 二次函数求最值（复习）\n## Do now\n- one\n')
  const status = await inspectWorkspace(root)
  assert.deepEqual(status.queue, [])

  const emptyRoot = await mkdtemp(join(tmpdir(), 'gitlearnos-noqueue-'))
  await writeFile(join(emptyRoot, 'gitlearnos.yml'), 'protocol: 2.0-draft\nmode: safe-auto\n')
  await writeFile(join(emptyRoot, 'dashboard.md'), '# Dashboard\n## Do now\n- one\n')
  const empty = await inspectWorkspace(emptyRoot)
  assert.deepEqual(empty.queue, [])
})

test('panelStatus returns the agent-maintained queue verbatim and never writes', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-panel-'))
  await writeFile(join(root, 'gitlearnos.yml'), 'protocol: 2.0-draft\nmode: safe-auto\nidentity:\n  repo_id: test-learner\n  role: learner\n  kind: learner-repository\n  template: false\n')
  await writeFile(join(root, 'dashboard.md'), '# Dashboard\n## Next up\nPanel: expand\n1. 化学平衡移动（跟进）\n2. 二次函数求最值（复习）\n')
  const status = await panelStatus(root)
  assert.equal(status.isSample, false)
  assert.equal(status.queueMaintained, false)
  assert.equal(status.panelDirective, 'expand')
  assert.match(status.panelRevision, /^[a-f0-9]{16}$/)
  assert.deepEqual(status.topics, [])
})

test('panelStatus does not invent an order for a learner repo with no agent queue', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-panel-noqueue-'))
  await writeFile(join(root, 'gitlearnos.yml'), 'protocol: 2.0-draft\nmode: safe-auto\nidentity:\n  repo_id: test-learner\n  role: learner\n  kind: learner-repository\n  template: false\n')
  await writeFile(join(root, 'dashboard.md'), '# Dashboard\n')
  await mkdir(join(root, 'subjects', 'math', 'knowledge-gaps'), { recursive: true })
  await writeFile(join(root, 'subjects', 'math', 'knowledge-gaps', 'quadratic.md'), '# Gap: 二次函数求最值\n')
  const status = await panelStatus(root)
  assert.equal(status.isLearnerRepo, true)
  assert.equal(status.isSample, false)
  assert.equal(status.queueMaintained, false)
  assert.equal(status.panelDirective, 'collapse')
  assert.deepEqual(status.topics, [])
})

test('panel presentation changes only when the agent changes its decision or queue', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-panel-presentation-'))
  await writeFile(join(root, 'gitlearnos.yml'), 'protocol: 2.0-draft\nmode: safe-auto\nidentity:\n  repo_id: test-learner\n  role: learner\n  kind: learner-repository\n  template: false\n')
  await writeFile(join(root, 'dashboard.md'), '# Dashboard\n## Next up\nPanel: expand\n1. 化学平衡移动（跟进）\n')
  const first = await panelStatus(root)
  const same = await panelStatus(root)
  assert.equal(first.panelDirective, 'expand')
  assert.equal(same.panelRevision, first.panelRevision)

  await writeFile(join(root, 'dashboard.md'), '# Dashboard\n## Next up\nPanel: expand\n1. 化学平衡移动（跟进）\n2. 牛顿第二定律（复习）\n')
  const changedQueue = await panelStatus(root)
  assert.equal(changedQueue.panelRevision, first.panelRevision)

  await writeFile(join(root, 'dashboard.md'), '# Dashboard\n## Next up\nPanel: collapse\n1. 化学平衡移动（跟进）\n2. 牛顿第二定律（复习）\n')
  const collapsed = await panelStatus(root)
  assert.equal(collapsed.panelDirective, 'collapse')
  assert.notEqual(collapsed.panelRevision, changedQueue.panelRevision)
})

test('panel presentation ignores directives outside Next up and unknown values', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-panel-scope-'))
  await writeFile(join(root, 'gitlearnos.yml'), 'protocol: 2.0-draft\nmode: safe-auto\nidentity:\n  repo_id: test-learner\n  role: learner\n  kind: learner-repository\n  template: false\n')
  await writeFile(join(root, 'dashboard.md'), '# Dashboard\nPanel: expand\n## Next up\nPanel: surprise\n1. 化学平衡移动（跟进）\n')
  const status = await panelStatus(root)
  assert.equal(status.panelDirective, 'collapse')
})

test('panelStatus flags a non-learner workspace as sample data, never as real state', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-panel-sample-'))
  await writeFile(join(root, 'dashboard.md'), '# Dashboard\n## Next up\n1. 不应冒充真实队列（复习）\n')
  const status = await panelStatus(root)
  assert.equal(status.isLearnerRepo, false)
  assert.equal(status.isSample, true)
  assert.equal(status.panelDirective, 'collapse')
  assert.ok(status.topics.length > 0)
  assert.equal(status.topics.some(item => item.name === '不应冒充真实队列'), false)
})

test('client hides an unmaintained learner queue and collapses after every action', async () => {
  const client = await readFile(new URL('../client.js', import.meta.url), 'utf8')
  assert.match(client, /rpc\.call\("\/gitlearnos", "status", \{\}\)/)
  assert.doesNotMatch(client, /rpc\.call\("\/gitlearnos", "status", undefined\)/)
  assert.match(client, /if \(!data\.topics \|\| data\.topics\.length === 0\) return null/)
  assert.match(client, /setDraft\(text\)[\s\S]*setOpen\(false\)[\s\S]*setActive\(null\)/)
  assert.match(client, /useRef\(null\)[\s\S]*appliedPresentation\.current !== next\.panelRevision/)
  assert.match(client, /setOpen\(next\.panelDirective === "expand"\)/)
  assert.match(client, /收尾一道/)
  assert.doesNotMatch(client, /暂无内容|当前为自动收集/)
})

test('learning_apply commits typed records and a dashboard projection in one commit', async () => {
  const root = await learnerRepo('safe-auto')
  const baseRevision = await head(root)
  const result = await applyLearningTransaction(root, {
    baseRevision,
    operations: [
      { kind: 'event', subject: 'math', id: 'sign-event', title: 'Sign event', body: 'Observed correction.' },
      { kind: 'gap', subject: 'math', id: 'sign-gap', title: 'Sign gap', body: 'Needs delayed transfer.' },
      { kind: 'dashboard', content: '# Dashboard\n## Next up\n1. Sign gap (复习) [id=sign-gap path=subjects/math/knowledge-gaps/sign-gap.md]\n' },
    ],
  })
  assert.equal(result.status, 'committed')
  assert.equal(result.changedFiles.length, 3)
  assert.equal((await git(root, 'diff-tree', '--no-commit-id', '--name-only', '-r', 'HEAD')).split('\n').filter(Boolean).length, 3)
  assert.match(await readFile(join(root, 'subjects/math/knowledge-gaps/sign-gap.md'), 'utf8'), /Gap ID: sign-gap/)
  const status = await inspectWorkspace(root)
  assert.equal(status.queue[0].id, 'sign-gap')
})

test('setupGate returns a structured blocked answer and ignores learning-policy mode text', async () => {
  const root = await learnerRepo('safe-auto')
  const status = await inspectWorkspace(root)
  const gate = await setupGate(root, status)
  assert.equal(gate.complete, true)
  assert.equal(gate.marker, 'setup-complete')
  assert.equal(gate.answer.setup, 'complete')
})

test('identity and setup evidence must come from their canonical YAML blocks', async () => {
  const root = await learnerRepo('safe-auto')
  await writeFile(join(root, 'gitlearnos.yml'), `protocol: 2.0-draft
mode: safe-auto
metadata:
  repo_id: spoofed
  role: learner
  kind: learner-repository
  template: false
goal: spoofed
subject: math
material: worksheet
rag_choice: declined
completed_at: "2026-08-15T00:00:00Z"
`)
  const status = await inspectWorkspace(root)
  const gate = await setupGate(root, status)
  assert.equal(status.learner.identified, false)
  assert.equal(gate.complete, false)
  assert.ok(gate.missing.includes('gitlearnos.yml: identity: learner'))
  assert.ok(gate.missing.includes('setup.answers.goal'))
  assert.ok(gate.missing.includes('setup.completed_at'))
})

test('plain external markers stay reported until a structured receipt exists', async () => {
  const root = await learnerRepo('safe-auto')
  await writeFile(join(root, 'automation.md'), '# Automation\nmaintenance: verified\ndue-review: verified\n')
  let status = await inspectWorkspace(root)
  assert.equal(status.automation.state, 'reported')
  await mkdir(join(root, '.gitlearnos', 'receipts'), { recursive: true })
  await writeFile(join(root, '.gitlearnos', 'receipts', 'scheduler.json'), JSON.stringify({
    schema: 'gitlearnos.external-receipt/v1', kind: 'scheduler', provider: 'test',
    task_id: 'task-1', tz: 'Asia/Shanghai', recurrence: 'daily', run_id: 'run-1',
    occurrence_key: '2026-08-15', repo_revision: status.gitRevision, result: 'skipped',
    delivery_status: 'none', message_id: null, observed_at: '2026-08-15T00:00:00Z',
  }))
  status = await inspectWorkspace(root)
  assert.equal(status.automation.state, 'externallyVerified')
  assert.equal(status.automation.verifiedReceipt.id, 'task-1')
})

test('canonical panel queue resolves H1 display names and hides stale references', async () => {
  const root = await learnerRepo('safe-auto')
  await mkdir(join(root, 'subjects', 'math', 'knowledge-gaps'), { recursive: true })
  await writeFile(join(root, 'subjects', 'math', 'knowledge-gaps', 'gap-one.md'), '# H1 display\n\nGap ID: gap-one\n')
  await writeFile(join(root, 'dashboard.md'), '# Dashboard\n## Next up\n1. gap-one — subjects/math/knowledge-gaps/gap-one.md — 复习\n2. missing — subjects/math/knowledge-gaps/missing.md — 复习\n')
  const status = await panelStatus(root)
  assert.deepEqual(status.topics, [{ name: 'H1 display', id: 'gap-one', path: 'subjects/math/knowledge-gaps/gap-one.md', verb: '复习', stale: false }])
  assert.equal(status.staleCount, 1)
})
