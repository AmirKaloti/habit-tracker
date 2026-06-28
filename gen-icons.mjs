import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const svg = readFileSync('icon-source.svg')
mkdirSync('public', { recursive: true })

const targets = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'maskable-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'favicon-48x48.png', size: 48 },
]

for (const t of targets) {
  await sharp(svg, { density: 384 })
    .resize(t.size, t.size)
    .png()
    .toFile(resolve('public', t.name))
  console.log('wrote', t.name)
}
console.log('done')
