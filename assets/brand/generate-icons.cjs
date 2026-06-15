#!/usr/bin/env node
// Pack rendered PNGs into build/icon.ico, build/icon.icns, build/icon.png
// No external deps. Uses a SIMPLIFIED variant for tiny sizes (<=32px) and the
// full g1 mascot for larger sizes, so taskbar/favicon stay legible.
const fs = require('node:fs')
const path = require('node:path')

const LAB = __dirname
const BUILD = path.resolve(LAB, '..', 'build')
const read = (name) => fs.readFileSync(path.join(LAB, `${name}.png`))

// size -> source png basename
const SRC = {
  16: 'small_16',
  24: 'small_24',
  32: 'small_32',
  48: 'icon_48',
  64: 'icon_64',
  128: 'icon_128',
  256: 'icon_256',
  512: 'icon_512',
  1024: 'icon_1024',
}
const png = (s) => read(SRC[s])

// ---------- ICO ----------
function buildIco(sizes) {
  const imgs = sizes.map((s) => ({ s, data: png(s) }))
  const count = imgs.length
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0)
  header.writeUInt16LE(1, 2)
  header.writeUInt16LE(count, 4)
  const dir = Buffer.alloc(16 * count)
  let offset = 6 + 16 * count
  imgs.forEach((img, i) => {
    const b = i * 16
    dir.writeUInt8(img.s >= 256 ? 0 : img.s, b + 0)
    dir.writeUInt8(img.s >= 256 ? 0 : img.s, b + 1)
    dir.writeUInt8(0, b + 2)
    dir.writeUInt8(0, b + 3)
    dir.writeUInt16LE(1, b + 4)
    dir.writeUInt16LE(32, b + 6)
    dir.writeUInt32LE(img.data.length, b + 8)
    dir.writeUInt32LE(offset, b + 12)
    offset += img.data.length
  })
  return Buffer.concat([header, dir, ...imgs.map((i) => i.data)])
}

// ---------- ICNS ----------
function buildIcns(map) {
  const chunks = []
  for (const [size, type] of Object.entries(map)) {
    const data = png(Number(size))
    const len = Buffer.alloc(4)
    len.writeUInt32BE(data.length + 8, 0)
    chunks.push(Buffer.concat([Buffer.from(type, 'ascii'), len, data]))
  }
  const body = Buffer.concat(chunks)
  const head = Buffer.alloc(8)
  head.write('icns', 0, 'ascii')
  head.writeUInt32BE(body.length + 8, 4)
  return Buffer.concat([head, body])
}

const ico = buildIco([16, 24, 32, 48, 64, 128, 256])
const icns = buildIcns({ 32: 'ic11', 64: 'ic12', 128: 'ic07', 256: 'ic08', 512: 'ic09', 1024: 'ic10' })

fs.writeFileSync(path.join(BUILD, 'icon.ico'), ico)
fs.writeFileSync(path.join(BUILD, 'icon.icns'), icns)
fs.writeFileSync(path.join(BUILD, 'icon.png'), png(512))

console.log('icon.ico ', ico.length, 'bytes — 16/24/32 simplified, 48/64/128/256 full')
console.log('icon.icns', icns.length, 'bytes — 32 simplified, 64..1024 full')
console.log('icon.png  512x512 full')
