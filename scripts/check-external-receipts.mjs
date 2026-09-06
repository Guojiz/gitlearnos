#!/usr/bin/env node

/**
 * Validate GitLearnOS external receipt structure without contacting a provider.
 * This is deliberately a local checker: a passing result is structural-valid,
 * never proof that RAG or a scheduler actually ran.
 */

import { readFile } from 'node:fs/promises'

const SCHEMA = 'gitlearnos.external-receipt/v1'
const allowedStatuses = new Set(['completed', 'available', 'unavailable', 'failed'])
const schedulerResults = new Set(['completed', 'skipped', 'failed', 'unknown'])

const failures = []
const checks = []

function fail(file, message) {
  failures.push(`${file}: ${message}`)
}

function nonEmpty(value) {
  return typeof value === 'string' && value.trim().length > 0
}

function requiredString(file, object, key) {
  if (!nonEmpty(object?.[key])) fail(file, `missing non-empty ${key}`)
}

function checkRag(file, receipt) {
  requiredString(file, receipt, 'provider')
  requiredString(file, receipt, 'source_id')
  requiredString(file, receipt, 'doc_id')
  if (!Array.isArray(receipt.knowledge_ids) || receipt.knowledge_ids.length === 0 || receipt.knowledge_ids.some(value => !nonEmpty(value))) {
    fail(file, 'knowledge_ids must be a non-empty array of non-empty strings')
  }
  const sourceRecord = receipt.git_source_record
  if (!sourceRecord || typeof sourceRecord !== 'object' || Array.isArray(sourceRecord)) {
    fail(file, 'git_source_record must be an object')
  } else {
    for (const key of ['path', 'base_revision', 'content_sha256']) requiredString(file, sourceRecord, key)
    if (nonEmpty(sourceRecord.content_sha256) && !/^[a-fA-F0-9]{64}$/.test(sourceRecord.content_sha256)) {
      fail(file, 'git_source_record.content_sha256 must be a 64-character SHA-256')
    }
  }
  const boundary = receipt.source_boundary ?? receipt['source-boundary']
  if (!boundary || typeof boundary !== 'object' || Array.isArray(boundary)) {
    fail(file, 'source_boundary must be an object (root/allowlist are recommended)')
  } else if (!nonEmpty(boundary.evidence)) {
    fail(file, 'source_boundary.evidence must be non-empty')
  }
  for (const key of ['ingest', 'query', 'rebuild', 'delete']) {
    const entry = receipt[key]
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
      fail(file, `${key} evidence object is required`)
      continue
    }
    if (!allowedStatuses.has(entry.status)) {
      fail(file, `${key}.status must be completed, available, unavailable, or failed`)
    }
    if (!nonEmpty(entry.evidence)) fail(file, `${key}.evidence must be non-empty`)
  }
  requiredString(file, receipt, 'observed_at')
  checks.push(`${file}: RAG receipt shape valid (provider execution not performed)`)
}

function checkScheduler(file, receipt) {
  for (const key of ['provider', 'task_id', 'recurrence', 'run_id', 'occurrence_key', 'repo_revision']) {
    requiredString(file, receipt, key)
  }
  const tz = receipt.tz ?? receipt.timezone
  if (!nonEmpty(tz)) {
    fail(file, 'missing non-empty tz (IANA time zone)')
  } else {
    try {
      new Intl.DateTimeFormat('en', { timeZone: tz }).format()
    } catch {
      fail(file, `tz is not a recognized IANA time zone: ${tz}`)
    }
  }
  if (!schedulerResults.has(receipt.result)) {
    fail(file, 'result must be completed, skipped, failed, or unknown')
  }
  requiredString(file, receipt, 'delivery_status')
  if (!(receipt.message_id === null || nonEmpty(receipt.message_id))) {
    fail(file, 'message_id must be a non-empty string or null')
  }
  requiredString(file, receipt, 'observed_at')
  checks.push(`${file}: scheduler receipt shape valid (provider execution not performed)`)
}

async function checkFile(file) {
  let receipt
  try {
    receipt = JSON.parse(await readFile(file, 'utf8'))
  } catch (error) {
    fail(file, `invalid JSON: ${error.message}`)
    return
  }
  if (!receipt || typeof receipt !== 'object' || Array.isArray(receipt)) {
    fail(file, 'receipt must be a JSON object')
    return
  }
  if (receipt.schema !== SCHEMA) fail(file, `schema must be ${SCHEMA}`)
  if (receipt.kind === 'rag') checkRag(file, receipt)
  else if (receipt.kind === 'scheduler') checkScheduler(file, receipt)
  else fail(file, 'kind must be rag or scheduler')
}

const files = process.argv.slice(2)
if (files.length === 0) {
  console.error('Usage: node scripts/check-external-receipts.mjs <receipt.json> [...]')
  process.exitCode = 2
} else {
  for (const file of files) await checkFile(file)
  for (const line of checks) {
    const file = line.slice(0, line.indexOf(': '))
    if (!failures.some((failure) => failure.startsWith(`${file}: `))) console.log(`OK ${line}`)
  }
  for (const line of failures) console.error(`ERROR ${line}`)
  console.log(`External provider execution: not performed (local structural check only)`)
  console.log(`Receipts checked: ${files.length}; structural failures: ${failures.length}`)
  process.exitCode = failures.length ? 1 : 0
}
