import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const root = resolve(import.meta.dirname, '..')
const manifest = JSON.parse(await readFile(resolve(root, 'package.json'), 'utf8'))
const expectedPatch = './adapters/deepseek-harness/cordis.patch.yml'

if (manifest.name !== 'gitlearnos') throw new Error('package name must remain gitlearnos')
if (manifest.type !== 'module') throw new Error('DeepSeek Harness bundle must be ESM')
if (manifest.main !== './adapters/deepseek-harness/index.js') {
  throw new Error('root main must load the DeepSeek Harness adapter')
}
if (manifest.dsh?.bundle?.patch !== expectedPatch) {
  throw new Error(`dsh.bundle.patch must be ${expectedPatch}`)
}
if (manifest.scripts?.prepare !== undefined || manifest.scripts?.postinstall !== undefined) {
  throw new Error('GitLearnOS DSH installs must not execute prepare or postinstall scripts')
}
for (const path of [manifest.main, manifest.dsh.bundle.patch]) {
  await readFile(resolve(root, path))
}

const patch = await readFile(resolve(root, expectedPatch), 'utf8')
if (!patch.includes("name: 'gitlearnos'")) {
  throw new Error('bundle patch must mount the installed gitlearnos package')
}

console.log('DeepSeek Harness bundle manifest passed.')
