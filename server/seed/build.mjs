// Resolves a photo for every vehicle in vehicles.mjs (the Commons file picked in
// images.mjs, else the Wikipedia article's lead image), downloads it and stores
// it in the app as public/vehicles/<slug>.webp, then writes:
//   seed/vehicles.json         – data pushed to the live API (see sync-images.mjs)
//   ../military_vehicles.sql   – full table rebuild for phpMyAdmin
//   public/vehicles/CREDITS.md – author + license of every bundled photo
// Bundling the photos means the app never hotlinks Wikimedia, so its rate limits
// (or no connection to it) can't blank out the catalog.
// Run with: node server/seed/build.mjs

import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import { VEHICLES } from './vehicles.mjs'
import { IMAGES } from './images.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const photoDir = join(here, '..', '..', 'public', 'vehicles')
const UA = 'ArmoredHubSeed/1.0 (student project; https://github.com/arr0nj4y/Military-Vehicles)'

// Wikimedia answers 429 when requests come too fast; wait and retry.
async function get(url) {
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } })
    if (res.status !== 429 || attempt === 5) return res
    await new Promise((r) => setTimeout(r, 2000 * (attempt + 1)))
  }
}

// Wikipedia article title -> its lead image as "File:...".
async function fetchLeadImages(titles) {
  const files = {}
  for (let i = 0; i < titles.length; i += 50) {
    const batch = titles.slice(i, i + 50)
    const url =
      'https://en.wikipedia.org/w/api.php?action=query&format=json&redirects=1' +
      '&prop=pageimages&piprop=name&pilicense=any&titles=' + encodeURIComponent(batch.join('|'))
    const json = await (await get(url)).json()
    // Follow normalization + redirects back to the title we asked for.
    const alias = {}
    for (const n of json.query.normalized || []) alias[n.to] = n.from
    for (const r of json.query.redirects || []) alias[r.to] = alias[r.from] || r.from
    for (const page of Object.values(json.query.pages)) {
      if (page.pageimage) files[alias[page.title] || page.title] = 'File:' + page.pageimage
    }
  }
  return files
}

// "File:..." -> 960px thumbnail URL, description page, author and license.
async function fetchFileInfo(files) {
  const info = {}
  for (let i = 0; i < files.length; i += 50) {
    const batch = files.slice(i, i + 50)
    const url =
      'https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo' +
      '&iiprop=url|extmetadata&iiextmetadatafilter=Artist|LicenseShortName&iiurlwidth=960' +
      '&titles=' + encodeURIComponent(batch.join('|'))
    const json = await (await get(url)).json()
    const alias = {}
    for (const n of json.query.normalized || []) alias[n.to] = n.from
    for (const page of Object.values(json.query.pages)) {
      if (!page.imageinfo) continue
      const ii = page.imageinfo[0]
      const meta = ii.extmetadata || {}
      info[alias[page.title] || page.title] = {
        url: ii.thumburl || ii.url,
        page: ii.descriptionurl,
        author: (meta.Artist?.value || 'Unknown').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(),
        license: meta.LicenseShortName?.value || 'see file page',
      }
    }
  }
  return info
}

const slug = (name) =>
  name.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// A hand-picked Commons photo from images.mjs wins over the article's lead image.
const photoTitle = (v) => IMAGES[v.name] || v.wiki
const titles = [...new Set(VEHICLES.map(photoTitle))]
const leadImages = await fetchLeadImages(titles.filter((t) => !t.startsWith('File:')))
const fileOf = (v) => (photoTitle(v).startsWith('File:') ? photoTitle(v) : leadImages[photoTitle(v)])
const fileInfo = await fetchFileInfo([...new Set(VEHICLES.map(fileOf).filter(Boolean))])

mkdirSync(photoDir, { recursive: true })
const rows = []
const credits = []
const missing = []
for (const { wiki, ...v } of VEHICLES) {
  const file = fileOf({ ...v, wiki })
  const info = fileInfo[file]
  let image_url = ''
  if (info) {
    const res = await get(info.url)
    if (res.ok) {
      const name = slug(v.name) + '.webp'
      await sharp(Buffer.from(await res.arrayBuffer()))
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 72 })
        .toFile(join(photoDir, name))
      // Relative, so it resolves inside the web build and the APK alike.
      image_url = 'vehicles/' + name
      credits.push(`| ${v.name} | [${file.slice(5)}](${info.page}) | ${info.author.replace(/\|/g, '/')} | ${info.license} |`)
    }
  }
  if (!image_url) missing.push(v.name)
  rows.push({ ...v, image_url })
}

writeFileSync(
  join(photoDir, 'CREDITS.md'),
  `# Vehicle photo credits\n\nAll photos come from Wikimedia Commons, resized to 800px WebP.\n` +
    `Generated by server/seed/build.mjs.\n\n| Vehicle | Source | Author | License |\n| --- | --- | --- | --- |\n` +
    credits.join('\n') + '\n',
)

writeFileSync(join(here, 'vehicles.json'), JSON.stringify(rows, null, 2))

const q = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "''") + "'"
const cols = ['name', 'category', 'country', 'era', 'image_url', 'top_speed', 'range', 'crew', 'weight', 'armament', 'description', 'admin_note']
const sql = `-- ArmoredHub: military_vehicles table + seed data (${rows.length} vehicles).
-- Generated by server/seed/build.mjs — edit seed/vehicles.mjs, not this file.
-- Import in phpMyAdmin (database arrjam10_military_vehicle) to recreate from scratch.

CREATE TABLE IF NOT EXISTS military_vehicles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(100) NOT NULL DEFAULT '',
  country VARCHAR(100) NOT NULL DEFAULT '',
  era VARCHAR(50) NOT NULL DEFAULT '',
  image_url TEXT,
  top_speed VARCHAR(50) NOT NULL DEFAULT '',
  \`range\` VARCHAR(50) NOT NULL DEFAULT '',
  crew VARCHAR(50) NOT NULL DEFAULT '',
  weight VARCHAR(50) NOT NULL DEFAULT '',
  armament TEXT,
  description TEXT,
  admin_note TEXT,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO military_vehicles
  (${cols.map((c) => '`' + c + '`').join(', ')})
VALUES
${rows.map((r) => '  (' + cols.map((c) => q(r[c])).join(', ') + ')').join(',\n')};
`
writeFileSync(join(here, '..', 'military_vehicles.sql'), sql)

console.log(`${rows.length} vehicles, ${rows.length - missing.length} with photos`)
if (missing.length) console.log('No photo:', missing.join(', '))
