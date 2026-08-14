import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { apply, inspectWorkspace, recordLearningEvent, routeLearningEvent } from '../index.js'

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
  await writeFile(join(root, 'gitlearnos.yml'), `protocol: 2.0-draft\nmode: ${mode}\n`)
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
  assert.deepEqual(tools.map(tool => tool.name), ['learning_status', 'learning_route', 'learning_record'])
  assert.equal(tools.find(tool => tool.name === 'learning_record').isConcurrencySafe(), false)
  assert.match(sections[0].text, /Never claim a file write, Git commit, RAG ingestion/)
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
  assert.equal(status.effectiveMode, 'manual')
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
})

test('status exposes the exact Git base required by a safe-auto transaction', async () => {
  const root = await learnerRepo('safe-auto')
  const status = await inspectWorkspace(root)
  assert.equal(status.gitRevision, await head(root))
})

test('unclear policy falls back to manual instead of widening safe-auto', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-policy-'))
  await writeFile(join(root, 'gitlearnos.yml'), 'protocol: 2.0-draft\nmode: safe-auto\n')
  await writeFile(join(root, 'learning-policy.md'), '# Policy\nWrites follow the learner preference.\n')
  const status = await inspectWorkspace(root)
  assert.equal(status.configuredMode, 'safe-auto')
  assert.equal(status.effectiveMode, 'manual')
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

test('actions projects an ordered learning queue: due reviews first, then knowledge gaps', async () => {
  const root = await mkdtemp(join(tmpdir(), 'gitlearnos-queue-'))
  await mkdir(join(root, 'subjects', 'math', 'reviews'), { recursive: true })
  await mkdir(join(root, 'subjects', 'math', 'knowledge-gaps'), { recursive: true })
  await writeFile(join(root, 'subjects', 'math', 'reviews', 'r-later.md'), 'Next review date: 2020-02-02.\n')
  await writeFile(join(root, 'subjects', 'math', 'reviews', 'r-earlier.md'), 'Next review date: 2020-01-01.\n')
  await writeFile(join(root, 'subjects', 'math', 'knowledge-gaps', 'quadratic-sign.md'), '# Gap\n')
  const status = await inspectWorkspace(root, new Date('2025-01-01T00:00:00Z'))
  assert.deepEqual(status.knowledgeGaps, ['subjects/math/knowledge-gaps/quadratic-sign.md'])
  assert.deepEqual(
    status.actions.map(a => [a.kind, a.path, a.dueOn]),
    [
      ['review', 'subjects/math/reviews/r-earlier.md', '2020-01-01'],
      ['review', 'subjects/math/reviews/r-later.md', '2020-02-02'],
      ['gap', 'subjects/math/knowledge-gaps/quadratic-sign.md', null],
    ],
  )
})
