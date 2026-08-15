// Ordering intuition experiment — "排兵布阵".
//
// The brainless-learning promise fails or succeeds on the ORDER of the queue:
// if the next item feels wrong, the learner has to think, and it stops being
// brainless. "Intuition" here is not a claim — it is measured. This script
// builds one deterministic synthetic learner, applies several ordering
// strategies, and scores each produced sequence against two axes:
//
//   user intuition   — what feels natural to a learner (warm start, no overload,
//                      nothing forgotten, variety, a quick win early)
//   agent intuition  — what is pedagogically sound (prerequisites close,
//                      high-leverage weak points first, due items honored,
//                      nothing too hard before its foundation)
//
// Run: node scripts/ordering-experiment.mjs
//
// The winning principle is intended to be encoded as the AGENT's ordering
// rubric (not a host-hardcoded function): the agent owns the order, but it
// follows a rubric that has been measured to feel right.

// Fixtures mirror dashboard records: IDs are stable canonical IDs and
// `depends_on` is the machine-facing prerequisite link.
const items = [
  { id: 'm1', subject: 'math', type: 'new', difficulty: 2, importance: 4, mastery: 0.8, dueInDays: null, prereq: null },
  { id: 'm2', subject: 'math', type: 'gap', difficulty: 3, importance: 5, mastery: 0.6, dueInDays: null, prereq: 'm1' },
  { id: 'm3', subject: 'math', type: 'review', difficulty: 3, importance: 4, mastery: 0.5, dueInDays: -1, prereq: null },
  { id: 'm4', subject: 'math', type: 'new', difficulty: 4, importance: 3, mastery: 0.9, dueInDays: null, prereq: 'm3' },
  { id: 'm5', subject: 'math', type: 'review', difficulty: 4, importance: 2, mastery: 0.7, dueInDays: 2, prereq: null },
  { id: 'c1', subject: 'chem', type: 'review', difficulty: 2, importance: 5, mastery: 0.4, dueInDays: 0, prereq: null },
  { id: 'c2', subject: 'chem', type: 'gap', difficulty: 4, importance: 5, mastery: 0.6, dueInDays: null, prereq: 'c1' },
  { id: 'c3', subject: 'chem', type: 'new', difficulty: 3, importance: 3, mastery: 0.85, dueInDays: null, prereq: null },
  { id: 'p1', subject: 'phys', type: 'review', difficulty: 3, importance: 5, mastery: 0.45, dueInDays: -2, prereq: null },
  { id: 'p2', subject: 'phys', type: 'gap', difficulty: 4, importance: 4, mastery: 0.7, dueInDays: null, prereq: 'p1' },
  { id: 'e1', subject: 'eng', type: 'new', difficulty: 2, importance: 4, mastery: 0.6, dueInDays: null, prereq: null },
  { id: 'e2', subject: 'eng', type: 'gap', difficulty: 2, importance: 4, mastery: 0.5, dueInDays: null, prereq: null },
]

const byId = new Map(items.map(i => [i.id, i]))
for (const item of items) item.canonicalPath = `subjects/${item.subject}/${item.type}/${item.id}.md`
const weakness = i => 1 - i.mastery
const leverage = i => i.importance * weakness(i)
const gentleness = i => (6 - i.difficulty) / 5

function urgency(i) {
  if (i.type === 'review') {
    if (i.dueInDays <= 0) return 1.0
    if (i.dueInDays <= 3) return 0.7
    return 0.4
  }
  if (i.type === 'gap') return 0.15
  return 0
}

// A prerequisite is satisfied if it is already mastered (mastery <= 0.25) or
// already scheduled earlier in the sequence.
function buildable(i, done) {
  if (i.prereq === null) return true
  const pre = byId.get(i.prereq)
  return pre.mastery <= 0.25 || done.has(i.prereq)
}

// ---- Strategies ---------------------------------------------------------

function dueFirst() {
  const rank = i => {
    if (i.type === 'review' && i.dueInDays <= 0) return 0
    if (i.type === 'review') return 1
    if (i.type === 'gap') return 2
    return 3
  }
  return [...items].sort((a, b) => {
    const r = rank(a) - rank(b)
    if (r !== 0) return r
    if (a.type === 'review' && b.type === 'review') return (a.dueInDays ?? 0) - (b.dueInDays ?? 0)
    return leverage(b) - leverage(a)
  })
}

function leverageFirst() {
  return [...items].sort((a, b) => leverage(b) - leverage(a))
}

function easyFirst() {
  return [...items].sort((a, b) => a.difficulty - b.difficulty || leverage(b) - leverage(a))
}

// "排兵布阵": greedy over buildable items; urgency + leverage + gentleness,
// with a small penalty for repeating the same subject right after itself.
function balanced() {
  const remaining = new Set(items.map(i => i.id))
  const done = new Set()
  const order = []
  while (remaining.size > 0) {
    let best = null
    let bestScore = -Infinity
    for (const id of remaining) {
      const i = byId.get(id)
      if (!buildable(i, done)) continue
      let score = 0.45 * urgency(i) + 0.35 * (leverage(i) / 5) + 0.20 * gentleness(i)
      const prev = order[order.length - 1]
      if (prev && prev.subject === i.subject) score -= 0.08
      if (score > bestScore) { bestScore = score; best = i }
    }
    if (best === null) break // should not happen with this fixture
    order.push(best)
    remaining.delete(best.id)
    done.add(best.id)
  }
  return order
}

// ---- Scoring ------------------------------------------------------------

function clamp01(x) { return Math.max(0, Math.min(1, x)) }

function scoreUser(order) {
  // warm start: first item is gentle
  const warm = gentleness(order[0])
  // smooth difficulty: penalize jumps larger than 1.5 steps
  let stepSum = 0
  for (let k = 1; k < order.length; k++) stepSum += Math.abs(order[k].difficulty - order[k - 1].difficulty)
  const avgStep = stepSum / (order.length - 1)
  const smooth = clamp01(1 - (avgStep - 0.8) / 2)
  // nothing lost: overdue reviews appear in the front half
  const overdue = items.filter(i => i.type === 'review' && i.dueInDays <= 0)
  const frontHalf = new Set(order.slice(0, Math.ceil(order.length / 2)).map(i => i.id))
  const nothingLost = overdue.length ? overdue.filter(i => frontHalf.has(i.id)).length / overdue.length : 1
  // variety: adjacent items differ in subject
  let sameAdj = 0
  for (let k = 1; k < order.length; k++) if (order[k].subject === order[k - 1].subject) sameAdj++
  const variety = 1 - sameAdj / (order.length - 1)
  // quick win: an easy (difficulty<=2) high-weakness item in the first 3
  const quick = order.slice(0, 3).some(i => i.difficulty <= 2 && weakness(i) >= 0.4)
  return { warm, smooth, nothingLost, variety, quick: quick ? 1 : 0 }
}

function scoreAgent(order) {
  // prerequisite closure: no item before its prerequisite
  const pos = new Map(order.map((i, k) => [i.id, k]))
  let closed = 1
  for (const i of items) if (i.prereq !== null && i.mastery > 0.25 && pos.get(i.id) < pos.get(i.prereq)) closed = 0
  // due honor: every overdue review precedes every non-overdue item
  const overdueIds = new Set(items.filter(i => i.type === 'review' && i.dueInDays <= 0).map(i => i.id))
  const nonOverdue = items.filter(i => !overdueIds.has(i.id)).map(i => i.id)
  let dueHonor = 1
  for (const oid of overdueIds) for (const nid of nonOverdue) if (pos.get(oid) > pos.get(nid)) dueHonor = 0
  // buildable: no hard (difficulty>=4) item in the first 2 unless its foundation is mastered
  const build = order.slice(0, 2).every(i => i.difficulty < 4 || (i.prereq && byId.get(i.prereq).mastery <= 0.25))
  // leverage: Spearman rank correlation against leverage-descending
  const leverageOrder = leverageFirst().map(i => i.id)
  const leveragePos = new Map(leverageOrder.map((id, k) => [id, k]))
  const n = order.length
  let d2 = 0
  for (let k = 0; k < n; k++) d2 += (k - leveragePos.get(order[k].id)) ** 2
  const spearman = 1 - (6 * d2) / (n * (n * n - 1))
  const leverageScore = clamp01((spearman + 1) / 2)
  return { closed, dueHonor, build: build ? 1 : 0, leverage: leverageScore }
}

function mean(xs) { return xs.reduce((a, b) => a + b, 0) / xs.length }

function evaluate(name, order) {
  const u = scoreUser(order)
  const a = scoreAgent(order)
  const U = mean(Object.values(u))
  const A = mean(Object.values(a))
  return { name, order, u, a, U, A, combined: 0.5 * U + 0.5 * A }
}

// ---- Report -------------------------------------------------------------

const strategies = [
  ['due-first (baseline)', dueFirst()],
  ['leverage-first', leverageFirst()],
  ['easy-first', easyFirst()],
  ['balanced (排兵布阵)', balanced()],
].map(([name, order]) => evaluate(name, order))

const pad = (s, n) => String(s).padEnd(n)
console.log('Ordering intuition experiment\n')
console.log('item  | subj | type   | diff | imp | mastery | due | prereq')
console.log('-'.repeat(70))
for (const i of items) {
  console.log(`${pad(i.id, 6)}| ${pad(i.subject, 5)}| ${pad(i.type, 6)}|  ${i.difficulty}   |  ${i.importance}  |   ${i.mastery.toFixed(2)}  | ${pad(String(i.dueInDays ?? '-'), 3)}| ${i.prereq ?? '-'}`)
}

console.log('\nScores (higher = better, 0..1)\n')
console.log(`${pad('strategy', 22)}| user  | agent | combined`)
console.log('-'.repeat(50))
const rows = [...strategies].sort((x, y) => y.combined - x.combined)
for (const s of rows) {
  console.log(`${pad(s.name, 22)}| ${s.U.toFixed(2)} | ${s.A.toFixed(2)}  | ${s.combined.toFixed(3)}`)
}

console.log('\nBest sequence (' + rows[0].name + '):')
console.log('  ' + rows[0].order.map(i => i.id).join(' → '))
console.log('  ' + rows[0].order.map(i => `${i.id}(${i.type})`).join(' · '))
console.log('Canonical queue rows:')
for (const i of rows[0].order) console.log(`  ${i.id} — ${i.canonicalPath} — ${i.type}`)
