import { lstat, mkdir, open, readFile, realpath, readdir, rm, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { createHash } from 'node:crypto'
import { isAbsolute, relative, resolve } from 'node:path'
import { promisify } from 'node:util'

export const name = 'gitlearnos-host'
export const inject = ['systemPrompt', 'tools']

const MAX_FILE_BYTES = 64 * 1024
const MAX_DIRECTORY_ENTRIES = 128
const MAX_SCAN_FILES = 512
const MAX_INTENT_CHARS = 4_000
const MAX_EVENT_BODY_CHARS = 32_000
const MAX_TRANSACTION_OPERATIONS = 24
const MAX_OPERATION_BODY_CHARS = 64 * 1024
const execFileAsync = promisify(execFile)

const STATUS_PATHS = Object.freeze([
  'gitlearnos.yml',
  'dashboard.md',
  'automation.md',
])

// A review or model file is only "due" when it carries an explicit
// next-review / next-check marker AND a parseable ISO date on the same line.
// Bare words like "due dates" without a date never match.
const DUE_MARKER = /next\s*review|next\s*check|review\s*date|review\s+on|due\s*review|date\s+or\s+next\s+handoff|next\s+handoff/i

const SYSTEM_PROMPT = '## GitLearnOS\nUse gitlearnos.yml as the sole stable configuration and require a learner repository identity. Never write the public template or examples. Answer the immediate request first. learning_status and learning_route are read-only observations. Never claim a file write, Git commit, RAG ingestion or retrieval, scheduled main-agent run, or demonstrated mastery without direct evidence. learning_apply is the only composite native write path; learning_record is a compatibility wrapper. Never claim external RAG or automation verification from plain text: only a machine receipt proves it. Preview and manual modes never write. Preserve unrelated dirty work, use exact base revisions, one lock and one reversible commit.'

function objectSchema(properties, required = []) {
  return { type: 'object', additionalProperties: false, properties, required }
}

const dueItemSchema = objectSchema({
  path: { type: 'string' },
  kind: { type: 'string' },
  dueOn: { type: 'string' },
  marker: { type: 'string' },
}, ['path', 'kind', 'dueOn'])

const queueItemSchema = objectSchema({
  name: { type: 'string' },
  verb: { type: 'string' },
  id: { type: 'string' },
  path: { type: 'string' },
  stale: { type: 'boolean' },
}, ['name', 'verb'])

const statusOutputSchema = objectSchema({
  workspace: { type: 'string' },
  gitRevision: { oneOf: [{ type: 'string' }, { type: 'null' }] },
  protocol: { oneOf: [{ type: 'string' }, { type: 'null' }] },
  configuredMode: { oneOf: [{ type: 'string' }, { type: 'null' }] },
  effectiveMode: { type: 'string' },
  learner: objectSchema({
    identified: { type: 'boolean' },
    identity: { oneOf: [{ type: 'string' }, { type: 'null' }] },
    reason: { type: 'string' },
  }, ['identified', 'identity', 'reason']),
  files: objectSchema(Object.fromEntries(STATUS_PATHS.map(path => [path, { type: 'boolean' }]))),
  activeGoals: { type: 'array', items: { type: 'string' } },
  dueReview: objectSchema({
    due: { type: 'array', items: dueItemSchema },
    upcoming: { type: 'array', items: dueItemSchema },
    noSignal: { type: 'number' },
  }, ['due', 'upcoming', 'noSignal']),
  reviewFiles: { type: 'array', items: { type: 'string' } },
  knowledgeGaps: { type: 'array', items: { type: 'string' } },
  queue: { type: 'array', items: queueItemSchema },
  rag: objectSchema({ state: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } }, marker: { type: 'object' }, verifiedReceipt: { oneOf: [{ type: 'object' }, { type: 'null' }] } }, ['state', 'evidence', 'marker', 'verifiedReceipt']),
  automation: objectSchema({ state: { type: 'string' }, evidence: { type: 'array', items: { type: 'string' } }, marker: { type: 'object' }, verifiedReceipt: { oneOf: [{ type: 'object' }, { type: 'null' }] } }, ['state', 'evidence', 'marker', 'verifiedReceipt']),
  limitations: { type: 'array', items: { type: 'string' } },
}, ['workspace', 'gitRevision', 'protocol', 'configuredMode', 'effectiveMode', 'learner', 'files', 'activeGoals', 'dueReview', 'reviewFiles', 'knowledgeGaps', 'queue', 'rag', 'automation', 'limitations'])

const routeOutputSchema = objectSchema({
  operation: { type: 'string' },
  operations: { type: 'array', items: { type: 'string' } },
  effectiveMode: { type: 'string' },
  recommendedReads: { type: 'array', items: { type: 'string' } },
  nextAction: { type: 'string' },
  writeAuthorized: { type: 'boolean' },
  persisted: { type: 'boolean' },
  reason: { type: 'string' },
}, ['operation', 'operations', 'effectiveMode', 'recommendedReads', 'nextAction', 'writeAuthorized', 'persisted', 'reason'])

const recordOutputSchema = objectSchema({
  status: { type: 'string' },
  effectiveMode: { type: 'string' },
  persisted: { type: 'boolean' },
  path: { oneOf: [{ type: 'string' }, { type: 'null' }] },
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
  const match = text?.match(new RegExp(`^${key}\\s*:\\s*["']?([^\\s#"']+)`, 'm'))
  return match?.[1] ?? null
}

function indentedBlock(text, key, indent = 0) {
  if (!text) return null
  const lines = text.split(/\r?\n/)
  const header = new RegExp(`^ {${indent}}${key}\\s*:\\s*(?:#.*)?$`)
  const start = lines.findIndex(line => header.test(line))
  if (start < 0) return null
  let end = start + 1
  while (end < lines.length) {
    const line = lines[end]
    if (line.trim() && (line.match(/^ */)?.[0].length ?? 0) <= indent) break
    end += 1
  }
  return lines.slice(start + 1, end).join('\n')
}

function effectiveWriteMode(configuredMode) {
  const knownModes = new Set(['safe-auto', 'preview', 'manual'])
  if (!knownModes.has(configuredMode)) return 'manual'
  return configuredMode
}

function templateLikeRoot(root) {
  const path = root.split(/[\\/]/).map(part => part.toLowerCase())
  return path.includes('examples') || path.some(part => part.includes('github-gitlearnos-anything-rag-agent-readme')) || (path.includes('gitlearnos') && path.includes('template'))
}

async function learnerIdentity(root, configText, files = {}) {
  const identity = indentedBlock(configText, 'identity')
  const repoId = identity?.match(/^\s*repo_id\s*:\s*["']?([^"'\s#]+)/mi)?.[1] ?? null
  const role = identity?.match(/^\s*role\s*:\s*["']?([a-z-]+)/mi)?.[1] ?? null
  const kind = identity?.match(/^\s*kind\s*:\s*["']?([a-z-]+)/mi)?.[1] ?? null
  const template = identity?.match(/^\s*template\s*:\s*(true|false)/mi)?.[1] ?? null
  const validId = Boolean(repoId && !/replace-with|placeholder|example|template|^null$|^none$/i.test(repoId))
  if (validId && role === 'learner' && kind === 'learner-repository' && template === 'false') {
    return { identified: true, identity: 'learner-repository', reason: 'gitlearnos.yml explicitly identifies a learner repository.' }
  }
  const reason = templateLikeRoot(root) || template === 'true' || kind === 'public-example'
    ? 'Public template/example repositories are never learner state.'
    : 'gitlearnos.yml requires repo_id, role: learner, kind: learner-repository, and template: false.'
  return { identified: false, identity: null, reason }
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
  const gapFiles = await subjectFiles(root, 'knowledge-gaps')
  const targets = [
    ...reviewFiles.map(path => ({ path, kind: 'review' })),
    ...modelFiles.map(path => ({ path, kind: 'model' })),
    ...gapFiles.map(path => ({ path, kind: 'gap' })),
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

function nextUpSection(dashboard) {
  if (!dashboard) return ''
  const match = dashboard.match(/##\s*(?:Next up|接下来)[^\n]*\n([\s\S]*?)(?=\n##\s|$)/)
  return match ? match[1] : ''
}

function parseQueue(dashboard) {
  const queue = []
  for (const line of nextUpSection(dashboard).split(/\r?\n/)) {
    const canonical = line.match(/^\s*(?:\d+[.、]|[-*])\s*([a-z0-9][a-z0-9-]{0,63})\s*[—-]\s*([A-Za-z0-9_./-]+)\s*[—-]\s*(.+?)\s*$/i)
    if (canonical) {
      queue.push({ name: canonical[1], id: canonical[1], path: canonical[2], verb: canonical[3].trim(), stale: false })
      continue
    }
    const item = line.match(/^\s*(?:\d+[.、]|[-*])\s*(.+?)\s*[（(]([^）)]+)[）)](?:\s*(?:\[|\{)?\s*id\s*[:=]\s*([a-z0-9][a-z0-9-]{0,63})\s*(?:,|;|\s+)\s*path\s*[:=]\s*([A-Za-z0-9_./-]+)\s*(?:\]|\})?)?\s*$/i)
    if (!item) continue
    const [, name, verb, id, path] = item
    queue.push({ name: name.trim(), verb: verb.trim(), ...(id ? { id, path, stale: false } : { stale: true }) })
  }
  return queue
}

async function validateQueue(root, queue) {
  const result = []
  for (const item of queue) {
    if (!item.id || !item.path) {
      result.push(item)
      continue
    }
    const text = await safeRead(root, item.path)
    const idMarker = text?.match(/(?:Event ID|Gap ID|Model ID|Review ID|Canonical ID)\s*:\s*([a-z0-9][a-z0-9-]{0,63})/i)?.[1]
    const heading = text?.match(/^#\s+(.+?)\s*$/m)?.[1]?.trim()
    result.push({ ...item, name: heading || item.name, stale: text === null || idMarker !== item.id })
  }
  return result
}

function panelPresentation(dashboard, topics) {
  const match = nextUpSection(dashboard).match(/^\s*Panel:\s*(expand|collapse)\s*$/im)
  const panelDirective = match ? match[1].toLowerCase() : 'collapse'
  const panelRevision = createHash('sha256')
    .update(JSON.stringify({ panelDirective, topics }))
    .digest('hex')
    .slice(0, 16)
  return { panelDirective, panelRevision }
}

// Demo payload for a workspace that is not a learner repository, so the panel
// still previews its shape. It is explicitly flagged isSample and never claimed
// as real learner state.
const PANEL_SAMPLE = Object.freeze({
  isLearnerRepo: false,
  isSample: true,
  queueMaintained: true,
  panelDirective: 'collapse',
  panelRevision: 'sample-v1',
  topics: Object.freeze([
    Object.freeze({ name: '化学平衡移动', verb: '跟进' }),
    Object.freeze({ name: '二次函数求最值', verb: '复习' }),
    Object.freeze({ name: '相似三角形对应关系', verb: '跟进' }),
    Object.freeze({ name: '词汇在语境中的含义', verb: '复习' }),
    Object.freeze({ name: '长难句分析', verb: '预习' }),
    Object.freeze({ name: '牛顿第二定律', verb: '复习' }),
    Object.freeze({ name: '三角恒等式速查', verb: '看笔记' }),
  ]),
})

// Panel projection: a learner repo gets only the agent-maintained queue read
// verbatim. The Host never invents an order. A non-learner workspace gets the
// explicitly flagged sample so maintainers can preview the product shape.
export async function panelStatus(root = process.cwd()) {
  const yml = await safeRead(root, 'gitlearnos.yml')
  const dashboard = await safeRead(root, 'dashboard.md')
  const identity = await learnerIdentity(await workspaceRoot(root), yml, {
    'dashboard.md': dashboard !== null,
    'automation.md': await safeRead(root, 'automation.md') !== null,
  })
  const queue = await validateQueue(root, parseQueue(dashboard))
  if (yml !== null && identity.identified) {
    const visibleQueue = queue.filter(item => !item.stale)
    return {
      isLearnerRepo: true,
      isSample: false,
      queueMaintained: visibleQueue.length > 0,
      topics: visibleQueue,
      staleCount: queue.length - visibleQueue.length,
      ...panelPresentation(dashboard, visibleQueue),
    }
  }
  return { ...PANEL_SAMPLE, isLearnerRepo: false, isSample: true, identity }
}

// Host handler for the /gitlearnos logical RPC channel the client panel calls.
function panelRpcHandler(root) {
  return async endpoint => {
    if (endpoint !== 'status') {
      return { ok: false, error: { code: 'internal', message: `gitlearnos: unknown panel endpoint "${endpoint}"`, details: {} } }
    }
    try {
      return { ok: true, value: await panelStatus(root) }
    } catch (error) {
      return { ok: false, error: { code: 'internal', message: String(error?.message ?? error), details: {} } }
    }
  }
}

function evidenceLines(text, pattern, cap = 8) {
  if (!text) return []
  return text.split(/\r?\n/).filter(line => pattern.test(line)).slice(0, cap).map(line => line.trim().slice(0, 240))
}

async function verifiedReceipt(root, kind) {
  const paths = kind === 'rag'
    ? ['.gitlearnos/receipts/rag.json', '.gitlearnos/receipts/external-rag.json']
    : ['.gitlearnos/receipts/automation.json', '.gitlearnos/receipts/scheduler.json']
  for (const path of paths) {
    const text = await safeRead(root, path)
    if (!text) continue
    try {
      const receipt = JSON.parse(text)
      if (receipt?.schema === 'gitlearnos.external-receipt/v1' && receipt.kind === 'rag') {
        const evidence = ['ingest', 'query', 'rebuild', 'delete'].map(key => receipt[key])
        if (receipt.provider && receipt.doc_id && receipt.source_boundary?.evidence && receipt.observed_at && evidence.every(item => item?.status === 'completed' && typeof item.evidence === 'string' && item.evidence.trim())) {
          return { kind: 'rag', provider: receipt.provider, id: receipt.doc_id, observedAt: receipt.observed_at }
        }
      }
      if (receipt?.schema === 'gitlearnos.external-receipt/v1' && receipt.kind === 'scheduler') {
        if (receipt.provider && receipt.task_id && receipt.tz && receipt.recurrence && receipt.run_id && receipt.occurrence_key && receipt.repo_revision && ['completed', 'skipped'].includes(receipt.result) && typeof receipt.delivery_status === 'string' && receipt.delivery_status.trim() && (receipt.message_id === null || (typeof receipt.message_id === 'string' && receipt.message_id.trim())) && receipt.observed_at) {
          return { kind: 'scheduler', provider: receipt.provider, id: receipt.task_id, observedAt: receipt.observed_at, repoRevision: receipt.repo_revision }
        }
      }
    } catch {}
  }
  return null
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
  const queue = await validateQueue(canonicalRoot, parseQueue(contents['dashboard.md']))
  const configuredMode = parseSetting(contents['gitlearnos.yml'], 'mode')
  const effectiveMode = effectiveWriteMode(configuredMode)
  const protocol = parseSetting(contents['gitlearnos.yml'], 'protocol')
  const learner = await learnerIdentity(canonicalRoot, contents['gitlearnos.yml'], files)
  const combined = Object.values(contents).filter(Boolean).join('\n')
  const ragEvidence = evidenceLines(combined, /RAG|retriev|ingest|index/i)
  const ragReceipt = await verifiedReceipt(canonicalRoot, 'rag')
  const automationEvidence = evidenceLines(contents['automation.md'], /due-review|maintenance|verified|configured|requested|unavailable|disabled|provider|task/i)
  const automationReceipt = await verifiedReceipt(canonicalRoot, 'automation')
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
    learner,
    files,
    activeGoals,
    dueReview: { due: dueState.due, upcoming: dueState.upcoming, noSignal: dueState.noSignal },
    reviewFiles: dueState.reviewFiles,
    knowledgeGaps: gapFiles.slice().sort(),
    queue: queue.filter(item => !item.stale),
    rag: {
      state: ragReceipt ? 'externallyVerified' : ragEvidence.length ? 'reported' : 'unknown',
      evidence: ragEvidence,
      marker: { state: ragEvidence.length ? 'reported' : 'none', evidence: ragEvidence },
      verifiedReceipt: ragReceipt,
    },
    automation: {
      state: automationReceipt ? 'externallyVerified' : automationEvidence.length ? 'reported' : 'unknown',
      evidence: automationEvidence,
      marker: { state: automationEvidence.length ? 'reported' : 'none', evidence: automationEvidence },
      verifiedReceipt: automationReceipt,
    },
    limitations: [
      'Read-only scan; no file write, Git commit, RAG request, or scheduler request was performed.',
      'Reported markers are repository text, not independent verification; externallyVerified requires a machine receipt under .gitlearnos/receipts/.',
      `Files over ${MAX_FILE_BYTES} bytes, symlink escapes, and directory entries beyond ${MAX_DIRECTORY_ENTRIES} are ignored.`,
      'dueReview is derived from explicit next-review/next-check dates in review, model, and knowledge-gap files (compared in UTC, so near-midnight boundaries are advisory); files without a parseable date are counted as noSignal, never guessed.',
      'dueReview, reviewFiles, and knowledgeGaps are evidence inputs, not a priority ranking; only the main agent maintains the ordered dashboard queue from the learner goal and relevant evidence.',
      'queue is the agent-maintained dashboard Next up list read verbatim in order; it is empty until the agent maintains it, and this tool never writes it.',
    ],
  }
}

function chooseOperation(intent) {
  const normalized = intent.toLowerCase()
  if (/set ?up|install|bootstrap|initiali[sz]/.test(normalized)) return 'setup'
  if (/diagnos|root ?cause|hypothes|falsif|卡住|不会做|做错|mastery.?contradict|knowledge.?gap/.test(normalized)) return 'diagnose'
  if (/question|quiz|practice|review due/.test(normalized)) return 'question'
  if (/answer|feedback|grade|master/.test(normalized)) return 'review'
  if (/rag|source|book|pdf|material/.test(normalized)) return 'source'
  if (/maintain|stale|reconcile|automation/.test(normalized)) return 'maintenance'
  if (/teach|explain|understand/.test(normalized)) return 'tutor'
  return 'organize'
}

function detectOperations(intent) {
  const text = String(intent ?? '').toLowerCase()
  const found = []
  const add = (name) => { if (!found.includes(name)) found.push(name) }
  if (/设置|安装|初始化|set ?up|install|bootstrap|initiali[sz]/.test(text)) add('setup')
  if (/诊断|鉴别|假设|证伪|根因|卡住|做错|不会做|diagnos|hypothes|falsif|root.?cause|mastery.?contradict/.test(text)) add('diagnose')
  if (/整理|记录|归纳|organize|note/.test(text)) add('organize')
  if (/总结|概括|summari[sz]e|synthesis/.test(text)) add('summarize')
  if (/题|练习|quiz|question|practice/.test(text)) add('question')
  if (/复习|review|feedback|批改|答案/.test(text)) add('review')
  if (/来源|书|pdf|材料|rag|source|material/.test(text)) add('source')
  if (/模型|方法|规律|model|method|pattern/.test(text)) add('model')
  if (/维护|自动化|stale|reconcile|maintenance/.test(text)) add('maintenance')
  if (/讲解|教我|teach|explain/.test(text)) add('tutor')
  return found.length ? found : [chooseOperation(text)]
}

function normalizeRequestedOperation(value) {
  const normalized = String(value ?? '').trim().toLowerCase()
  const known = new Set(['setup', 'diagnose', 'organize', 'summarize', 'question', 'review', 'source', 'model', 'maintenance', 'tutor'])
  return known.has(normalized) ? normalized : chooseOperation(normalized)
}

export async function routeLearningEvent(root, intent) {
  const normalizedIntent = typeof intent === 'string' ? intent.trim().slice(0, MAX_INTENT_CHARS) : typeof intent?.intent === 'string' ? intent.intent.trim().slice(0, MAX_INTENT_CHARS) : ''
  const status = await inspectWorkspace(root)
  const requestedOperations = Array.isArray(intent?.operations) ? intent.operations.map(item => typeof item === 'string' ? item : item?.kind).filter(Boolean) : []
  const operations = requestedOperations.length ? [...new Set(requestedOperations.map(normalizeRequestedOperation))] : detectOperations(normalizedIntent)
  const operation = operations[0]
  const operationPlan = operations.join(' → ')
  const recommendedReads = ['gitlearnos.yml', 'dashboard.md', ...status.activeGoals.slice(0, 1)]
    .filter(path => status.files[path] !== false)
  const writeAuthorized = status.effectiveMode === 'safe-auto'
  return {
    operation,
    operations,
    effectiveMode: status.effectiveMode,
    recommendedReads,
    nextAction: writeAuthorized
      ? `Answer the immediate request, then perform only the smallest safe reversible ${operationPlan} update if durable learning value is clear.`
      : status.effectiveMode === 'preview'
        ? `Answer the immediate request, then preview the smallest useful ${operationPlan} update without writing.`
        : `Answer the immediate request, then request approval before any ${operationPlan} write.`,
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

export async function setupGate(root, status = null) {
  status ??= await inspectWorkspace(root)
  const required = ['gitlearnos.yml', 'dashboard.md', 'automation.md']
  const missing = required.filter(path => !status.files[path])
  for (const path of ['AGENTS.md', 'learner-profile.md']) {
    if (await safeRead(root, path) === null) missing.push(path)
  }
  if (status.activeGoals.length === 0) missing.push('subjects/<subject>/goals/main-goal.md')
  const config = await safeRead(root, 'gitlearnos.yml')
  const setupBlock = indentedBlock(config, 'setup')
  const answersBlock = indentedBlock(setupBlock, 'answers', 2)
  const answerLines = answersBlock?.split(/\r?\n/) ?? []
  for (const key of ['goal', 'subject', 'material', 'rag_choice']) {
    const line = answerLines.find(item => item.trim().startsWith(key + ':'))
    const value = line?.slice(line.indexOf(':') + 1).trim().replace(/^["']|["']$/g, '')
    if (!value || (key === 'rag_choice' ? !['enabled', 'declined'].includes(value) : value === 'undecided')) missing.push('setup.answers.' + key)
  }
  const completedLine = setupBlock?.split(/\r?\n/).find(item => /^\s{2}completed_at\s*:/.test(item))
  const completedAt = completedLine?.slice(completedLine.indexOf(':') + 1).trim().replace(/^["']|["']$/g, '')
  if (!completedAt || Number.isNaN(Date.parse(completedAt))) missing.push('setup.completed_at')
  if (!status.learner?.identified) missing.push('gitlearnos.yml: identity: learner')
  return {
    complete: missing.length === 0,
    missing,
    marker: missing.length === 0 ? 'setup-complete' : 'setup-incomplete',
    answer: missing.length === 0
      ? { setup: 'complete', learner: status.learner?.identity ?? 'unknown', next: 'answer immediate request' }
      : { setup: 'blocked', missing, next: 'complete learner repository setup' },
  }
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

function operationMarkdown(kind, id, title, body) {
  if (kind === 'event') return eventMarkdown(id, title, body)
  if (typeof title !== 'string' || !title.trim() || title.length > 160 || /[\r\n]/.test(title)) throw new Error('title must be one non-empty line of at most 160 characters')
  if (typeof body !== 'string' || !body.trim() || body.length > MAX_OPERATION_BODY_CHARS) throw new Error('body is required and bounded')
  const label = { gap: 'Gap ID', model: 'Model ID', review: 'Review ID' }[kind]
  if (!label) throw new Error('unsupported operation kind: ' + kind)
  return '# ' + title.trim() + '\n\n' + label + ': ' + id + '\n\n' + body.trim() + '\n'
}

function contentBlobSha(content) {
  return createHash('sha256').update(content, 'utf8').digest('hex')
}

function normalizeOperations(input) {
  const operations = Array.isArray(input?.operations) ? input.operations : [input]
  if (operations.length === 0 || operations.length > MAX_TRANSACTION_OPERATIONS) throw new Error('operations count is out of bounds')
  return operations.map((operation, index) => {
    const kind = operation?.kind ?? 'event'
    if (!['event', 'gap', 'model', 'review', 'dashboard'].includes(kind)) throw new Error('operations[' + index + '].kind is not allowed')
    if (kind === 'dashboard') {
      if (operation.path && operation.path !== 'dashboard.md') throw new Error('dashboard path must be dashboard.md')
      if (typeof operation.content !== 'string' || !operation.content.trim() || operation.content.length > MAX_OPERATION_BODY_CHARS) throw new Error('dashboard content is required and bounded')
      return { kind, path: 'dashboard.md', proposal: operation.content.endsWith('\n') ? operation.content : operation.content + '\n' }
    }
    const action = String(operation?.action ?? 'create').trim().toLowerCase()
    if (!['create', 'update'].includes(action)) throw new Error('operations[' + index + '].action must be create or update')
    if (action === 'update' && !['gap', 'model', 'review'].includes(kind)) {
      throw new Error('operations[' + index + '].action update is only allowed for gap, model, or review')
    }
    const subject = safeSegment(operation?.subject, 'operations[' + index + '].subject')
    const id = safeSegment(operation?.id ?? operation?.eventId, 'operations[' + index + '].id')
    const folder = { event: 'events', gap: 'knowledge-gaps', model: 'models', review: 'reviews' }[kind]
    const path = 'subjects/' + subject + '/' + folder + '/' + id + '.md'
    if (operation.path && operation.path !== path) throw new Error('operation path must be canonical ' + path)
    const expectedBlobSha = operation?.expectedBlobSha == null ? null : String(operation.expectedBlobSha).trim().toLowerCase()
    if (action === 'update') {
      if (!expectedBlobSha || !/^[0-9a-f]{64}$/.test(expectedBlobSha)) {
        throw new Error('operations[' + index + '].expectedBlobSha is required for update (sha256 of current file utf8 content)')
      }
    } else if (expectedBlobSha) {
      throw new Error('operations[' + index + '].expectedBlobSha is only valid with action update')
    }
    return {
      kind,
      action,
      expectedBlobSha,
      subject,
      id,
      path,
      proposal: operationMarkdown(kind, id, operation.title, operation.body),
    }
  })
}

async function ensureParentForPath(root, path) {
  if (path === 'dashboard.md') return root
  const parts = path.split('/')
  if (parts.length !== 4 || parts[0] !== 'subjects') throw new Error('target path is outside the learning state schema')
  const subject = safeSegment(parts[1], 'subject')
  const folder = parts[2]
  if (!['events', 'knowledge-gaps', 'models', 'reviews'].includes(folder)) throw new Error('target path folder is not allowed')
  const subjectPath = resolve(root, 'subjects', subject)
  const stat = await lstat(subjectPath).catch(error => { if (error?.code === 'ENOENT') throw new Error('subject does not exist: ' + subject); throw error })
  if (!stat.isDirectory() || stat.isSymbolicLink()) throw new Error('subject path must be a real directory')
  const canonicalSubject = await realpath(subjectPath)
  if (relative(root, canonicalSubject).split(/[\\/]/).includes('..')) throw new Error('subject path escapes workspace')
  const folderPath = resolve(canonicalSubject, folder)
  const existing = await lstat(folderPath).catch(error => error?.code === 'ENOENT' ? null : Promise.reject(error))
  if (existing && (!existing.isDirectory() || existing.isSymbolicLink())) throw new Error(folder + ' path must be a real directory')
  if (!existing) await mkdir(folderPath)
  const canonicalFolder = await realpath(folderPath)
  const rel = relative(root, canonicalFolder)
  if (rel === '..' || rel.startsWith('..' + (process.platform === 'win32' ? '\\\\' : '/')) || isAbsolute(rel)) throw new Error('target path escapes workspace')
  return canonicalFolder
}

async function readTrackedAtHead(root, path) {
  try { return await git(root, ['show', 'HEAD:' + path]) } catch { return null }
}

export async function recordLearningEvent(root, input) {
  return applyLearningTransaction(root, { ...input, operations: [{ kind: 'event', subject: input?.subject, id: input?.eventId, title: input?.title, body: input?.body }] })
}

export async function applyLearningTransaction(root, input) {
  const canonicalRoot = await requireGitWorkspace(root)
  const operations = normalizeOperations(input)
  const path = operations.length === 1 ? operations[0].path : null
  const proposal = operations.length === 1 ? operations[0].proposal : operations.map(item => '### ' + item.path + '\n\n' + item.proposal).join('\n')
  const status = await inspectWorkspace(canonicalRoot)
  const gate = await setupGate(canonicalRoot, status)
  const currentRevision = await git(canonicalRoot, ['rev-parse', 'HEAD'])
  if (!gate.complete) {
    return { ...recordResult({ status: 'blocked', effectiveMode: status.effectiveMode, path, proposal, baseRevision: currentRevision, reason: 'Setup gate incomplete: ' + gate.missing.join(', ') }), setup: gate.answer, setupMarker: gate.marker }
  }
  if (status.effectiveMode === 'preview') {
    return recordResult({ status: 'preview', effectiveMode: status.effectiveMode, path, proposal, baseRevision: currentRevision, reason: 'Exact pending proposal; preview mode performed zero writes.' })
  }
  if (status.effectiveMode !== 'safe-auto') {
    return recordResult({ status: 'requires-approval', effectiveMode: status.effectiveMode, path, proposal, baseRevision: currentRevision, reason: 'Manual or unclear configuration requires approval outside this tool; the model cannot self-approve.' })
  }
  if (typeof input?.baseRevision !== 'string' || !/^[0-9a-f]{40,64}$/i.test(input.baseRevision)) {
    return recordResult({ status: 'conflict', effectiveMode: status.effectiveMode, path, proposal, baseRevision: currentRevision, reason: 'safe-auto requires the exact Git baseRevision previously observed by the caller.' })
  }

  const lockPath = resolve(canonicalRoot, '.gitlearnos-write.lock')
  let lock
  const createdTargets = []
  const createdParents = []
  const replacedTargets = []
  let committed = false
  try {
    lock = await open(lockPath, 'wx', 0o600)
    const lockedRevision = await git(canonicalRoot, ['rev-parse', 'HEAD'])
    if (lockedRevision !== input.baseRevision) {
      return recordResult({ status: 'conflict', effectiveMode: status.effectiveMode, path, proposal, baseRevision: lockedRevision, reason: 'Git HEAD changed after the proposal was observed; rerun against the new base.' })
    }
    const existingCommits = []
    let allUnchanged = true
    for (const operation of operations) {
      if (operation.path !== 'dashboard.md') {
        const parentCandidate = resolve(canonicalRoot, 'subjects', operation.subject, operation.path.split('/')[2])
        const hadParent = await lstat(parentCandidate).then(() => true).catch(error => error?.code === 'ENOENT' ? false : Promise.reject(error))
        if (!hadParent) createdParents.push(parentCandidate)
      }
      const parent = await ensureParentForPath(canonicalRoot, operation.path)
      const filename = operation.path === 'dashboard.md' ? 'dashboard.md' : operation.path.split('/').at(-1)
      const target = resolve(parent, filename)
      const existingStat = await lstat(target).catch(error => error?.code === 'ENOENT' ? null : Promise.reject(error))
      if (!existingStat && operation.action === 'update') {
        throw new Error('controlled update requires an existing target file')
      }
      if (existingStat) {
        if (!existingStat.isFile() || existingStat.isSymbolicLink()) throw new Error('existing target path is not a regular file')
        const existing = await readFile(target, 'utf8')
        if (existing !== operation.proposal) {
          if (operation.kind === 'dashboard') {
            const trackedDashboard = await readTrackedAtHead(canonicalRoot, operation.path)
            if (trackedDashboard !== existing && trackedDashboard + '\n' !== existing) throw new Error('dashboard has uncommitted user content; projection overwrite refused')
            replacedTargets.push({ target, existing })
            allUnchanged = false
            await writeFile(target, operation.proposal, { encoding: 'utf8' })
            continue
          }
          if (operation.action === 'update') {
            const tracked = await readTrackedAtHead(canonicalRoot, operation.path)
            if (tracked !== existing && tracked + '\n' !== existing) {
              throw new Error('target has uncommitted local modifications; controlled update refused')
            }
            const currentSha = contentBlobSha(existing)
            if (currentSha !== operation.expectedBlobSha) {
              throw new Error('expectedBlobSha mismatch; controlled update refused (rerun against current content)')
            }
            replacedTargets.push({ target, existing })
            allUnchanged = false
            await writeFile(target, operation.proposal, { encoding: 'utf8' })
            continue
          }
          throw new Error('target id already exists with different content; overwrite refused')
        }
        const committedContent = await readTrackedAtHead(canonicalRoot, operation.path)
        if (committedContent !== operation.proposal && committedContent + '\n' !== operation.proposal) throw new Error('identical target exists only as uncommitted user content; ownership and overwrite refused')
        const priorCommit = await git(canonicalRoot, ['log', '-1', '--format=%H', '--', operation.path])
        if (priorCommit) existingCommits.push(priorCommit)
      } else {
        allUnchanged = false
        await writeFile(target, operation.proposal, { encoding: 'utf8', flag: 'wx', mode: 0o600 })
        createdTargets.push(target)
      }
    }
    if (allUnchanged) {
      const commit = existingCommits[0] || lockedRevision
      return recordResult({ status: 'unchanged', effectiveMode: status.effectiveMode, path, proposal, baseRevision: lockedRevision, commit, changedFiles: operations.map(item => item.path), undo: 'git revert ' + commit, reason: 'Identical transaction already exists; no file or commit was created.' })
    }
    const beforeCommit = await git(canonicalRoot, ['rev-parse', 'HEAD'])
    if (beforeCommit !== lockedRevision) throw new Error('Git HEAD changed during transaction')
    const paths = operations.map(item => item.path)
    await git(canonicalRoot, ['add', '--', ...paths])
    await git(canonicalRoot, ['commit', '--only', '-m', 'learn: apply ' + operations.length + ' learning operation' + (operations.length === 1 ? '' : 's'), '--', ...paths])
    committed = true
    const commit = await git(canonicalRoot, ['rev-parse', 'HEAD'])
    return recordResult({ status: 'committed', effectiveMode: status.effectiveMode, path, proposal, baseRevision: lockedRevision, commit, changedFiles: paths, undo: 'git revert ' + commit, reason: 'Committed one config-authorized learning transaction; unrelated working-tree and index changes were preserved.' })
  } catch (error) {
    if (!committed) {
      try { await git(canonicalRoot, ['reset', '--', ...operations.map(item => item.path)]) } catch {}
      for (const target of createdTargets) {
        try { await rm(target) } catch {}
      }
      for (const replacement of replacedTargets) {
        try { await writeFile(replacement.target, replacement.existing, { encoding: 'utf8' }) } catch {}
      }
      for (const parent of createdParents.reverse()) {
        try { await rm(parent) } catch {}
      }
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
    'Choose a GitLearnOS operation and authority-aware next action without executing it. Pass operations explicitly when the protocol requires diagnose or a multi-step plan; do not rely on Host regex alone.',
    objectSchema({
      intent: { type: 'string', description: 'Current learning request or event, capped at 4000 characters.' },
      operations: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional explicit operation plan such as diagnose, tutor, question. When present, Host uses this ordered set instead of regex detection.',
      },
    }, ['intent']),
    routeOutputSchema,
    async args => routeLearningEvent(root, args),
  ))
  ctx.tools.register(tool(
    'learning_apply',
    'Apply one bounded composite learning transaction (event, gap, model, review, and dashboard projection) as one reversible commit.',
    objectSchema({
      baseRevision: { type: 'string', description: 'Exact HEAD revision observed while preparing this transaction.' },
      operations: { type: 'array', minItems: 1, maxItems: MAX_TRANSACTION_OPERATIONS, items: { type: 'object' } },
    }, ['baseRevision', 'operations']),
    recordOutputSchema,
    async args => applyLearningTransaction(root, args),
    { concurrencySafe: false, kind: 'write' },
  ))
  ctx.tools.register(tool(
    'learning_record',
    'Record one bounded learning event through a gitlearnos.yml-authorized, reversible Git transaction. Preview and manual modes never write.',
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
  // Web-only: expose the panel queue over the generic logical RPC channel.
  // Loopback-only so the panel can never be reached from a remote browser.
  if (typeof ctx.inject === 'function') {
    ctx.inject(['connection'], scope => {
      scope.effect(() => scope.connection.rpc.handle('/gitlearnos', panelRpcHandler(root), { authority: 'loopback' }), 'gitlearnos: /gitlearnos rpc channel')
    })
  }
}
