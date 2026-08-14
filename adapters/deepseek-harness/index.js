import { lstat, mkdir, open, readFile, realpath, readdir, rm, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { isAbsolute, relative, resolve } from 'node:path'
import { promisify } from 'node:util'

export const name = 'gitlearnos-host'
export const inject = ['systemPrompt', 'tools']

const MAX_FILE_BYTES = 64 * 1024
const MAX_DIRECTORY_ENTRIES = 128
const MAX_SCAN_FILES = 512
const MAX_INTENT_CHARS = 4_000
const MAX_EVENT_BODY_CHARS = 32_000
const execFileAsync = promisify(execFile)

const STATUS_PATHS = Object.freeze([
  'gitlearnos.yml',
  'learning-policy.md',
  'dashboard.md',
  'automation.md',
])

// A review or model file is only "due" when it carries an explicit
// next-review / next-check marker AND a parseable ISO date on the same line.
// Bare words like "due dates" without a date never match.
const DUE_MARKER = /next\s*review|next\s*check|review\s*date|review\s+on|due\s*review|date\s+or\s+next\s+handoff|next\s+handoff/i

const SYSTEM_PROMPT = `## GitLearnOS

Treat this workspace as learner-owned Git learning state only when actual files support that conclusion. Answer the immediate request first. For learning work, inspect policy, dashboard, the active goal, and only relevant evidence. Use the stricter of gitlearnos.yml and learning-policy.md: safe-auto permits only safe reversible learning writeback; preview proposes changes without writing; manual requires approval. Never claim a file write, Git commit, RAG ingestion or retrieval, scheduled worker, or demonstrated mastery without direct evidence. RAG is optional and a tool of the one main agent. A reminder or session-local schedule is not proof of repository-capable recurring automation. learning_status and learning_route are read-only observations. learning_status also reports dueReview and reviewFiles derived only from explicit next-review/next-check dates; unparseable or absent dates are noSignal, never guessed. learning_record is the only native write path: use it only for faithful durable evidence after the setup conversation is actually complete, pass the gitRevision returned by learning_status, and trust only its receipt as proof of persistence.`

function objectSchema(properties, required = []) {
  return { type: 'object', additionalProperties: false, properties, required }
}

const dueItemSchema = objectSchema({
  path: { type: 'string' },
  kind: { type: 'string' },
  dueOn: { type: 'string' },
  marker: { type: 'string' },
}, ['path', 'kind', 'dueOn'])

const actionItemSchema = objectSchema({
  kind: { type: 'string' },
  path: { type: 'string' },
  dueOn: { oneOf: [{ type: 'string' }, { type: 'null' }] },
}, ['kind', 'path', 'dueOn'])

const statusOutputSchema = objectSchema({
  workspace: { type: 'string' },
  gitRevision: { oneOf: [{ type: 'string' }, { type: 'null' }] },
  protocol: { oneOf: [{ type: 'string' }, { type: 'null' }] },
  configuredMode: { oneOf: [{ type: 'string' }, { type: 'null' }] },
  effectiveMode: { type: 'string' },
  files: objectSchema(Object.fromEntries(STATUS_PATHS.map(path => [path, { type: 'boolean' }]))),
  activeGoals: { type: 'array', items: { type: 'string' } },
  dueReview: objectSchema({
    due: { type: 'array', items: dueItemSchema },
    upcoming: { type: 'array', items: dueItemSchema },
    noSignal: { type: 'number' },
  }, ['due', 'upcoming', 'noSignal']),
  reviewFiles: { type: 'array', items: { type: 'string' } },
  knowledgeGaps: { type: 'array', items: { type: 'string' } },
  actions: { type: 'array', items: actionItemSchema },
  rag: objectSchema({ state: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } } }, ['state', 'evidence']),
  automation: objectSchema({ state: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } } }, ['state', 'evidence']),
  limitations: { type: 'array', items: { type: 'string' } },
}, ['workspace', 'gitRevision', 'protocol', 'configuredMode', 'effectiveMode', 'files', 'activeGoals', 'dueReview', 'reviewFiles', 'knowledgeGaps', 'actions', 'rag', 'automation', 'limitations'])

const routeOutputSchema = objectSchema({
  operation: { type: 'string' },
  effectiveMode: { type: 'string' },
  recommendedReads: { type: 'array', items: { type: 'string' } },
  nextAction: { type: 'string' },
  writeAuthorized: { type: 'boolean' },
  persisted: { type: 'boolean' },
  reason: { type: 'string' },
}, ['operation', 'effectiveMode', 'recommendedReads', 'nextAction', 'writeAuthorized', 'persisted', 'reason'])

const recordOutputSchema = objectSchema({
  status: { type: 'string' },
  effectiveMode: { type: 'string' },
  persisted: { type: 'boolean' },
  path: { type: 'string' },
  proposal: { type: 'string' },
  baseRevision: { type: 'string' },
  commit: { oneOf: [{ type: 'string' }, { type: 'null' }] },
  changedFiles: { type: 'array', items: { type: 'string' } },
  undo: { oneOf: [{ type: 'string' }, { type: 'null' }] },
  reason: { type: 'string' },
}, ['status', 'effectiveMode', 'persisted', 'path', 'proposal', 'baseRevision', 'commit', 'changedFiles', 'undo', 'reason'])

function textResult(value) {
  return [{ type: 'text', text: JSON.stringify(value, null, 2) }]
}

function parseSetting(text, key) {
  const match = text?.match(new RegExp(`^\\s*${key}\\s*:\\s*["']?([^\\s#"']+)`, 'm'))
  return match?.[1] ?? null
}

function policyMode(text) {
  if (!text) return null
  const explicit = text.match(/(?:write authority|mode|automatic writes?)\s*[:=]\s*`?(safe-auto|preview|manual)/i)?.[1]
  if (explicit) return explicit.toLowerCase()
  if (/automatic writes?[^\n]*(?:disabled|false|require[^\n]*approval)/i.test(text)) return 'manual'
  return null
}

function stricterMode(first, second) {
  const rank = { 'safe-auto': 0, preview: 1, manual: 2 }
  const known = [first, second].filter(value => Object.hasOwn(rank, value))
  if (known.length === 0) return 'manual'
  return known.reduce((strictest, value) => rank[value] > rank[strictest] ? value : strictest)
}

function effectiveWriteMode(configuredMode, policyText) {
  const knownModes = new Set(['safe-auto', 'preview', 'manual'])
  if (!knownModes.has(configuredMode)) return 'manual'
  const declaredPolicyMode = policyMode(policyText)
  if (policyText !== null && declaredPolicyMode === null) return 'manual'
  return stricterMode(configuredMode, declaredPolicyMode)
}

async function workspaceRoot(root) {
  const absolute = resolve(root)
  return realpath(absolute)
}

async function safeRead(root, relativePath) {
  if (isAbsolute(relativePath) || relativePath.split(/[\\/]/).includes('..')) return null
  const base = await workspaceRoot(root)
  const candidate = resolve(base, relativePath)
  const rel = relative(base, candidate)
  if (rel === '..' || rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) || isAbsolute(rel)) return null
  let canonical
  try {
    canonical = await realpath(candidate)
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') return null
    throw error
  }
  const canonicalRel = relative(base, canonical)
  if (canonicalRel === '..' || canonicalRel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) || isAbsolute(canonicalRel)) return null
  const stat = await lstat(canonical)
  if (!stat.isFile() || stat.size > MAX_FILE_BYTES) return null
  return readFile(canonical, 'utf8')
}

async function goalPaths(root) {
  const base = await workspaceRoot(root)
  const subjectsPath = resolve(base, 'subjects')
  let subjects
  try {
    subjects = await readdir(subjectsPath, { withFileTypes: true })
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') return []
    throw error
  }
  const paths = []
  for (const subject of subjects.slice(0, MAX_DIRECTORY_ENTRIES)) {
    if (!subject.isDirectory() || subject.name.startsWith('.')) continue
    const path = `subjects/${subject.name}/goals/main-goal.md`
    if (await safeRead(base, path) !== null) paths.push(path)
  }
  return paths
}

async function subjectFiles(root, folder) {
  const base = await workspaceRoot(root)
  const subjectsPath = resolve(base, 'subjects')
  let subjects
  try {
    subjects = await readdir(subjectsPath, { withFileTypes: true })
  } catch (error) {
    if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') return []
    throw error
  }
  const paths = []
  for (const subject of subjects.slice(0, MAX_DIRECTORY_ENTRIES)) {
    if (!subject.isDirectory() || subject.name.startsWith('.')) continue
    const folderPath = resolve(subjectsPath, subject.name, folder)
    let entries
    try {
      entries = await readdir(folderPath, { withFileTypes: true })
    } catch (error) {
      if (error?.code === 'ENOENT' || error?.code === 'ENOTDIR') continue
      throw error
    }
    for (const entry of entries.slice(0, MAX_DIRECTORY_ENTRIES)) {
      if (paths.length >= MAX_SCAN_FILES) return paths
      if (!entry.isFile() || entry.name.startsWith('.')) continue
      if (!entry.name.toLowerCase().endsWith('.md')) continue
      const rel = `subjects/${subject.name}/${folder}/${entry.name}`
      if (await safeRead(base, rel) !== null) paths.push(rel)
    }
  }
  return paths
}

function todayString(now) {
  const date = now instanceof Date ? now : new Date(now)
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
}

function parseDateToken(line) {
  const match = line.match(/\b(\d{4})-(\d{2})-(\d{2})\b/)
  if (!match) return null
  const [, year, month, day] = match
  const value = `${year}-${month}-${day}`
  const date = new Date(`${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return null
  if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() + 1 !== Number(month) || date.getUTCDate() !== Number(day)) return null
  return value
}

function findDueMarker(text) {
  if (!text) return null
  for (const line of text.split(/\r?\n/)) {
    if (DUE_MARKER.test(line) && /\d{4}-\d{2}-\d{2}/.test(line)) return line.trim()
  }
  return null
}

async function dueReviewState(root, now) {
  const reviewFiles = await subjectFiles(root, 'reviews')
  const modelFiles = await subjectFiles(root, 'models')
  const targets = [
    ...reviewFiles.map(path => ({ path, kind: 'review' })),
    ...modelFiles.map(path => ({ path, kind: 'model' })),
  ].slice(0, MAX_SCAN_FILES)
  const due = []
  const upcoming = []
  let noSignal = 0
  const today = todayString(now)
  for (const target of targets) {
    const text = await safeRead(root, target.path)
    if (text === null) continue
    const marker = findDueMarker(text)
    const dueOn = marker ? parseDateToken(marker) : null
    if (dueOn === null) {
      noSignal += 1
      continue
    }
    const item = { path: target.path, kind: target.kind, dueOn, marker: marker.slice(0, 240) }
    if (dueOn <= today) due.push(item)
    else upcoming.push(item)
  }
  return { due, upcoming, noSignal, reviewFiles }
}

function evidenceLines(text, pattern, cap = 8) {
  if (!text) return []
  return text.split(/\r?\n/).filter(line => pattern.test(line)).slice(0, cap).map(line => line.trim().slice(0, 240))
}

export async function inspectWorkspace(root = process.cwd(), now = new Date()) {
  const canonicalRoot = await workspaceRoot(root)
  const files = {}
  const contents = {}
  for (const path of STATUS_PATHS) {
    const text = await safeRead(root, path)
    files[path] = text !== null
    contents[path] = text
  }
  const activeGoals = await goalPaths(root)
  const dueState = await dueReviewState(root, now)
  const gapFiles = await subjectFiles(root, 'knowledge-gaps')
  const orderedDue = [...dueState.due].sort((a, b) => (a.dueOn < b.dueOn ? -1 : a.dueOn > b.dueOn ? 1 : 0))
  const actions = [
    ...orderedDue.map(item => ({ kind: 'review', path: item.path, dueOn: item.dueOn })),
    ...gapFiles.slice().sort().map(path => ({ kind: 'gap', path, dueOn: null })),
  ]
  const configuredMode = parseSetting(contents['gitlearnos.yml'], 'mode')
  const effectiveMode = effectiveWriteMode(configuredMode, contents['learning-policy.md'])
  const protocol = parseSetting(contents['gitlearnos.yml'], 'protocol')
  const combined = Object.values(contents).filter(Boolean).join('\n')
  const ragEvidence = evidenceLines(combined, /RAG|retriev|ingest|index/i)
  const verifiedRag = ragEvidence.some(line => /(?:enabled|verified|retrieved|ingested)/i.test(line))
    && ragEvidence.some(line => /(?:identifier|source|query|revision)/i.test(line))
  const automationEvidence = evidenceLines(contents['automation.md'], /due-review|maintenance|verified|configured|requested|unavailable|disabled|provider|task/i)
  const dueVerified = automationEvidence.some(line => /due-review/i.test(line) && /verified/i.test(line))
  const maintenanceVerified = automationEvidence.some(line => /maintenance/i.test(line) && /verified/i.test(line))
  let gitRevision = null
  try {
    gitRevision = await git(canonicalRoot, ['rev-parse', 'HEAD'])
  } catch {}
  return {
    workspace: canonicalRoot,
    gitRevision,
    protocol,
    configuredMode,
    effectiveMode,
    files,
    activeGoals,
    dueReview: { due: dueState.due, upcoming: dueState.upcoming, noSignal: dueState.noSignal },
    reviewFiles: dueState.reviewFiles,
    knowledgeGaps: gapFiles.slice().sort(),
    actions,
    rag: {
      state: verifiedRag ? 'reported-with-evidence-markers' : ragEvidence.length ? 'mentioned-not-verified' : 'unknown',
      evidence: ragEvidence,
    },
    automation: {
      state: dueVerified && maintenanceVerified ? 'reported-verified' : automationEvidence.length ? 'incomplete-or-unverified' : 'unknown',
      evidence: automationEvidence,
    },
    limitations: [
      'Read-only scan; no file write, Git commit, RAG request, or scheduler request was performed.',
      'Reported markers are repository text, not independent verification of external systems.',
      `Files over ${MAX_FILE_BYTES} bytes, symlink escapes, and directory entries beyond ${MAX_DIRECTORY_ENTRIES} are ignored.`,
      'dueReview is derived from explicit next-review/next-check dates in review and model files (compared in UTC, so near-midnight boundaries are advisory); files without a parseable date are counted as noSignal, never guessed.',
      'actions is an ordered learning queue projected from Git (due reviews first by next-check date, then knowledge gaps); it never implies any action already ran.',
    ],
  }
}

function chooseOperation(intent) {
  const normalized = intent.toLowerCase()
  if (/set ?up|install|bootstrap|initiali[sz]/.test(normalized)) return 'setup'
  if (/question|quiz|practice|review due/.test(normalized)) return 'question'
  if (/answer|feedback|grade|master/.test(normalized)) return 'review'
  if (/rag|source|book|pdf|material/.test(normalized)) return 'source'
  if (/maintain|stale|reconcile|automation/.test(normalized)) return 'maintenance'
  if (/teach|explain|understand/.test(normalized)) return 'tutor'
  return 'organize'
}

export async function routeLearningEvent(root, intent) {
  const normalizedIntent = typeof intent === 'string' ? intent.trim().slice(0, MAX_INTENT_CHARS) : ''
  const status = await inspectWorkspace(root)
  const operation = chooseOperation(normalizedIntent)
  const recommendedReads = ['learning-policy.md', 'dashboard.md', ...status.activeGoals.slice(0, 1)]
    .filter(path => status.files[path] !== false)
  const writeAuthorized = status.effectiveMode === 'safe-auto'
  return {
    operation,
    effectiveMode: status.effectiveMode,
    recommendedReads,
    nextAction: writeAuthorized
      ? `Answer the immediate request, then perform only the smallest safe reversible ${operation} update if durable learning value is clear.`
      : status.effectiveMode === 'preview'
        ? `Answer the immediate request, then preview the smallest useful ${operation} update without writing.`
        : `Answer the immediate request, then request approval before any ${operation} write.`,
    writeAuthorized,
    persisted: false,
    reason: 'This route is derived from bounded workspace reads and the effective GitLearnOS write mode; no action was executed.',
  }
}

async function git(root, args) {
  const result = await execFileAsync('git', ['-C', root, ...args], {
    encoding: 'utf8',
    maxBuffer: 1024 * 1024,
    env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' },
  })
  return result.stdout.trim()
}

function safeSegment(value, label) {
  if (typeof value !== 'string' || !/^[a-z0-9][a-z0-9-]{0,63}$/.test(value)) {
    throw new Error(`${label} must match ^[a-z0-9][a-z0-9-]{0,63}$`)
  }
  return value
}

function eventMarkdown(eventId, title, body) {
  if (typeof title !== 'string' || !title.trim() || title.length > 160 || /[\r\n]/.test(title)) {
    throw new Error('title must be one non-empty line of at most 160 characters')
  }
  if (typeof body !== 'string' || !body.trim() || body.length > MAX_EVENT_BODY_CHARS) {
    throw new Error(`body must contain 1-${MAX_EVENT_BODY_CHARS} characters`)
  }
  return `# ${title.trim()}\n\nEvent ID: \`${eventId}\`\n\n${body.trim()}\n`
}

async function requireGitWorkspace(root) {
  const canonicalRoot = await workspaceRoot(root)
  const topLevel = await git(canonicalRoot, ['rev-parse', '--show-toplevel'])
  if (await realpath(topLevel) !== canonicalRoot) {
    throw new Error('configured root must be the Git worktree root')
  }
  return canonicalRoot
}

async function setupGate(root, status) {
  const required = ['gitlearnos.yml', 'learning-policy.md', 'dashboard.md', 'automation.md']
  const missing = required.filter(path => !status.files[path])
  for (const path of ['AGENTS.md', 'learner-profile.md']) {
    if (await safeRead(root, path) === null) missing.push(path)
  }
  if (status.activeGoals.length === 0) missing.push('subjects/<subject>/goals/main-goal.md')
  return { complete: missing.length === 0, missing }
}

async function safeEventParent(root, subject) {
  const subjectPath = resolve(root, 'subjects', subject)
  let subjectStat
  try {
    subjectStat = await lstat(subjectPath)
  } catch (error) {
    if (error?.code === 'ENOENT') throw new Error(`subject does not exist: ${subject}`)
    throw error
  }
  if (!subjectStat.isDirectory() || subjectStat.isSymbolicLink()) throw new Error('subject path must be a real directory')
  const canonicalSubject = await realpath(subjectPath)
  if (relative(root, canonicalSubject).split(/[\\/]/).includes('..')) throw new Error('subject path escapes workspace')
  const eventsPath = resolve(canonicalSubject, 'events')
  try {
    const eventsStat = await lstat(eventsPath)
    if (!eventsStat.isDirectory() || eventsStat.isSymbolicLink()) throw new Error('events path must be a real directory')
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
    await mkdir(eventsPath)
  }
  const canonicalEvents = await realpath(eventsPath)
  const rel = relative(root, canonicalEvents)
  if (rel === '..' || rel.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) || isAbsolute(rel)) {
    throw new Error('events path escapes workspace')
  }
  return canonicalEvents
}

function recordResult({ status, effectiveMode, path, proposal, baseRevision, commit = null, changedFiles = [], undo = null, reason }) {
  return { status, effectiveMode, persisted: status === 'committed' || status === 'unchanged', path, proposal, baseRevision, commit, changedFiles, undo, reason }
}

export async function recordLearningEvent(root, input) {
  const canonicalRoot = await requireGitWorkspace(root)
  const subject = safeSegment(input?.subject, 'subject')
  const eventId = safeSegment(input?.eventId, 'eventId')
  const proposal = eventMarkdown(eventId, input?.title, input?.body)
  const path = `subjects/${subject}/events/${eventId}.md`
  const status = await inspectWorkspace(canonicalRoot)
  const gate = await setupGate(canonicalRoot, status)
  const currentRevision = await git(canonicalRoot, ['rev-parse', 'HEAD'])
  if (!gate.complete) {
    return recordResult({ status: 'blocked', effectiveMode: status.effectiveMode, path, proposal, baseRevision: currentRevision, reason: `Setup gate incomplete: ${gate.missing.join(', ')}` })
  }
  if (status.effectiveMode === 'preview') {
    return recordResult({ status: 'preview', effectiveMode: status.effectiveMode, path, proposal, baseRevision: currentRevision, reason: 'Exact pending proposal; preview mode performed zero writes.' })
  }
  if (status.effectiveMode !== 'safe-auto') {
    return recordResult({ status: 'requires-approval', effectiveMode: status.effectiveMode, path, proposal, baseRevision: currentRevision, reason: 'Manual or unclear policy requires approval outside this tool; the model cannot self-approve.' })
  }
  if (typeof input?.baseRevision !== 'string' || !/^[0-9a-f]{40,64}$/i.test(input.baseRevision)) {
    return recordResult({ status: 'conflict', effectiveMode: status.effectiveMode, path, proposal, baseRevision: currentRevision, reason: 'safe-auto requires the exact Git baseRevision previously observed by the caller.' })
  }

  const lockPath = resolve(canonicalRoot, '.gitlearnos-write.lock')
  let lock
  let target
  let created = false
  let committed = false
  try {
    lock = await open(lockPath, 'wx', 0o600)
    const lockedRevision = await git(canonicalRoot, ['rev-parse', 'HEAD'])
    if (lockedRevision !== input.baseRevision) {
      return recordResult({ status: 'conflict', effectiveMode: status.effectiveMode, path, proposal, baseRevision: lockedRevision, reason: 'Git HEAD changed after the proposal was observed; rerun against the new base.' })
    }
    const parent = await safeEventParent(canonicalRoot, subject)
    target = resolve(parent, `${eventId}.md`)
    try {
      const existingStat = await lstat(target)
      if (!existingStat.isFile() || existingStat.isSymbolicLink()) throw new Error('existing event path is not a regular file')
      const existing = await readFile(target, 'utf8')
      if (existing !== proposal) throw new Error('event id already exists with different content; overwrite refused')
      const priorCommit = await git(canonicalRoot, ['log', '-1', '--format=%H', '--', path])
      let committedContent = null
      try { committedContent = await git(canonicalRoot, ['show', `HEAD:${path}`]) } catch {}
      if (!priorCommit || `${committedContent}\n` !== proposal) {
        throw new Error('identical event exists only as uncommitted user content; ownership and overwrite refused')
      }
      return recordResult({ status: 'unchanged', effectiveMode: status.effectiveMode, path, proposal, baseRevision: lockedRevision, commit: priorCommit || null, undo: priorCommit ? `git revert ${priorCommit}` : null, reason: 'Identical event already exists; no file or commit was created.' })
    } catch (error) {
      if (error?.code !== 'ENOENT') throw error
    }
    await writeFile(target, proposal, { encoding: 'utf8', flag: 'wx', mode: 0o600 })
    created = true
    const beforeCommit = await git(canonicalRoot, ['rev-parse', 'HEAD'])
    if (beforeCommit !== lockedRevision) throw new Error('Git HEAD changed during transaction')
    await git(canonicalRoot, ['add', '--', path])
    await git(canonicalRoot, ['commit', '--only', '-m', `learn(${subject}): record event ${eventId}`, '--', path])
    committed = true
    const commit = await git(canonicalRoot, ['rev-parse', 'HEAD'])
    return recordResult({ status: 'committed', effectiveMode: status.effectiveMode, path, proposal, baseRevision: lockedRevision, commit, changedFiles: [path], undo: `git revert ${commit}`, reason: 'Committed one policy-authorized event; unrelated working-tree and index changes were preserved.' })
  } catch (error) {
    if (created && !committed && target) {
      try { await git(canonicalRoot, ['reset', '--', path]) } catch {}
      try { await rm(target) } catch {}
    }
    throw error
  } finally {
    if (lock) {
      try { await lock.close() } catch {}
      try { await rm(lockPath) } catch {}
    }
  }
}

function tool(name, description, parameters, outputSchema, execute, { concurrencySafe = true, kind = 'read' } = {}) {
  return {
    name,
    description,
    parameters,
    output: { schema: outputSchema, render: (_args, value) => textResult(value) },
    execute,
    isConcurrencySafe: () => concurrencySafe,
    presentCall: () => ({ card: 'generic', title: name, kind }),
  }
}

export function apply(ctx, config = {}) {
  const root = config.root ? resolve(config.root) : process.cwd()
  ctx.systemPrompt.section({ name: 'gitlearnos', order: 20, text: SYSTEM_PROMPT })
  ctx.tools.register(tool(
    'learning_status',
    'Inspect bounded GitLearnOS workspace state without modifying it.',
    objectSchema({}),
    statusOutputSchema,
    async () => inspectWorkspace(root),
  ))
  ctx.tools.register(tool(
    'learning_route',
    'Choose a GitLearnOS operation and authority-aware next action without executing it.',
    objectSchema({ intent: { type: 'string', description: 'Current learning request or event, capped at 4000 characters.' } }, ['intent']),
    routeOutputSchema,
    async args => routeLearningEvent(root, args.intent),
  ))
  ctx.tools.register(tool(
    'learning_record',
    'Record one bounded learning event through a policy-checked, reversible Git transaction. Preview and manual modes never write.',
    objectSchema({
      subject: { type: 'string', description: 'Existing lowercase subject slug.' },
      eventId: { type: 'string', description: 'Stable lowercase event id; retries must reuse it.' },
      title: { type: 'string', description: 'One-line event title.' },
      body: { type: 'string', description: 'Faithful Markdown learning evidence, at most 32000 characters.' },
      baseRevision: { type: 'string', description: 'Exact HEAD revision observed while preparing this event.' },
    }, ['subject', 'eventId', 'title', 'body', 'baseRevision']),
    recordOutputSchema,
    async args => recordLearningEvent(root, args),
    { concurrencySafe: false, kind: 'write' },
  ))
}
