// Pushes the image_url from seed/vehicles.json to the live API, matching rows by
// name. Every other field is sent back exactly as the server has it, so edits
// made in the app are kept. Run after build.mjs:
//   node server/seed/sync-images.mjs            (apply)
//   node server/seed/sync-images.mjs --dry-run  (only list what would change)

import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const API_URL = process.env.API_URL || 'http://bunsdomain.duckdns.org/military_vehicles'
const dryRun = process.argv.includes('--dry-run')

const here = dirname(fileURLToPath(import.meta.url))
const seed = JSON.parse(readFileSync(join(here, 'vehicles.json'), 'utf8'))
const imageByName = Object.fromEntries(seed.map((v) => [v.name, v.image_url]))

const live = await (await fetch(API_URL)).json()
const changes = live.filter((v) => imageByName[v.name] && imageByName[v.name] !== v.image_url)

console.log(`${live.length} live vehicles, ${changes.length} image(s) to update${dryRun ? ' (dry run)' : ''}`)
let failed = 0
for (const v of changes) {
  if (dryRun) {
    console.log(`  #${v.id} ${v.name}`)
    continue
  }
  const res = await fetch(`${API_URL}/${v.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...v, image_url: imageByName[v.name] }),
  })
  if (!res.ok) failed++
  console.log(`  #${v.id} ${v.name}: ${res.ok ? 'updated' : 'FAILED ' + res.status}`)
}
if (failed) process.exitCode = 1
