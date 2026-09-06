import assert from 'node:assert/strict'
import { execFile as execFileCallback } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'
import test from 'node:test'

const execFile = promisify(execFileCallback)
const checker = resolve('scripts/check-external-receipts.mjs')

async function runChecker(file) {
  try {
    const result = await execFile(process.execPath, [checker, file], { encoding: 'utf8' })
    return { code: 0, ...result }
  } catch (error) {
    return { code: error.code ?? 1, stdout: error.stdout ?? '', stderr: error.stderr ?? '' }
  }
}

async function withReceipt(receipt, callback, name = 'receipt.json') {
  const directory = await mkdtemp(join(tmpdir(), 'gitlearnos-receipt-test-'))
  const file = join(directory, name)
  try {
    await writeFile(file, typeof receipt === 'string' ? receipt : JSON.stringify(receipt), 'utf8')
    return await callback(file)
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
}

const ragReceipt = {
  schema: 'gitlearnos.external-receipt/v1',
  kind: 'rag',
  provider: 'rag-anything',
  source_id: 'math/algebra-course',
  knowledge_ids: ['math/algebra/quadratic-functions'],
  doc_id: 'course/algebra.pdf',
  git_source_record: {
    path: 'subjects/math/sources/algebra-course.md',
    base_revision: '0123456789abcdef',
    content_sha256: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  },
  source_boundary: { root: '/authorized/materials', allowlist: ['course/algebra.pdf'], evidence: 'allowlist inspected' },
  ingest: { status: 'completed', evidence: 'non-zero chunks', run_id: 'ing-1' },
  query: { status: 'completed', evidence: 'source-specific hit', run_id: 'query-1' },
  rebuild: { status: 'available', evidence: 'replay from source boundary' },
  delete: { status: 'available', evidence: 'delete by doc_id' },
  observed_at: '2026-08-15T07:02:00Z'
}

const schedulerReceipt = {
  schema: 'gitlearnos.external-receipt/v1',
  kind: 'scheduler',
  provider: 'local-cron',
  task_id: 'opaque-task-id',
  tz: 'Asia/Shanghai',
  recurrence: 'daily',
  run_id: 'run-1',
  occurrence_key: 'due-review/2026-08-15T07:00:00+08:00',
  repo_revision: '0123456789abcdef',
  result: 'skipped',
  delivery_status: 'not-sent',
  message_id: null,
  observed_at: '2026-08-15T07:00:03+08:00'
}

test('accepts a complete RAG receipt', async () => {
  await withReceipt(ragReceipt, async (file) => {
    const result = await runChecker(file)
    assert.equal(result.code, 0, result.stderr)
    assert.match(result.stdout, /RAG receipt shape valid/)
    assert.match(result.stdout, /provider execution not performed/)
  })
})

test('accepts a complete scheduler receipt', async () => {
  await withReceipt(schedulerReceipt, async (file) => {
    const result = await runChecker(file)
    assert.equal(result.code, 0, result.stderr)
    assert.match(result.stdout, /scheduler receipt shape valid/)
  })
})

test('rejects plain text and simplified legacy pseudo receipts', async () => {
  await withReceipt('RAG: enabled\nProvider: rag-anything\n', async (file) => {
    const result = await runChecker(file)
    assert.notEqual(result.code, 0)
    assert.match(result.stderr, /invalid JSON/)
  }, 'marker.md')

  await withReceipt({ status: 'verified', provider: 'scheduler', task_id: 'old-id' }, async (file) => {
    const result = await runChecker(file)
    assert.notEqual(result.code, 0)
    assert.match(result.stderr, /schema must be gitlearnos\.external-receipt\/v1/)
  }, 'legacy.json')
})

test('rejects missing delivery evidence and missing RAG source boundary', async () => {
  const missingDelivery = { ...schedulerReceipt, delivery_status: undefined }
  await withReceipt(missingDelivery, async (file) => {
    const result = await runChecker(file)
    assert.notEqual(result.code, 0)
    assert.match(result.stderr, /missing non-empty delivery_status/)
  }, 'missing-delivery.json')

  const { source_boundary: ignored, ...missingBoundary } = ragReceipt
  await withReceipt(missingBoundary, async (file) => {
    const result = await runChecker(file)
    assert.notEqual(result.code, 0)
    assert.match(result.stderr, /source_boundary must be an object/)
  }, 'missing-source-boundary.json')
})

test('rejects a RAG receipt without stable Git identity linkage', async () => {
  const { knowledge_ids: ignored, ...missingKnowledgeIds } = ragReceipt
  await withReceipt(missingKnowledgeIds, async (file) => {
    const result = await runChecker(file)
    assert.notEqual(result.code, 0)
    assert.match(result.stderr, /knowledge_ids must be a non-empty array/)
  }, 'missing-knowledge-ids.json')

  const invalidHash = {
    ...ragReceipt,
    git_source_record: { ...ragReceipt.git_source_record, content_sha256: 'not-a-hash' }
  }
  await withReceipt(invalidHash, async (file) => {
    const result = await runChecker(file)
    assert.notEqual(result.code, 0)
    assert.match(result.stderr, /64-character SHA-256/)
  }, 'invalid-source-hash.json')
})
