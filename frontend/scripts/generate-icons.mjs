#!/usr/bin/env node
import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

async function ensureSharp() {
  try {
    const mod = await import('sharp')
    return mod.default || mod
  } catch (e) {
    console.error('\nError: sharp is not installed.\n')
    console.error('Install it first:')
    console.error('  npm i -D sharp')
    process.exit(1)
  }
}

async function main() {
  const sharp = await ensureSharp()
  const root = resolve(process.cwd())
  const svgPath = resolve(root, 'public', 'favicon.svg')
  const out16 = resolve(root, 'public', 'favicon-16x16.png')
  const out32 = resolve(root, 'public', 'favicon-32x32.png')
  const outApple = resolve(root, 'public', 'apple-touch-icon.png')

  const svg = await readFile(svgPath)

  // 16x16
  await sharp(svg).resize(16, 16, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png({ compressionLevel: 9 }).toFile(out16)
  // 32x32
  await sharp(svg).resize(32, 32, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png({ compressionLevel: 9 }).toFile(out32)
  // 180x180 Apple touch icon
  await sharp(svg).resize(180, 180, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 0 } }).png({ compressionLevel: 9 }).toFile(outApple)

  console.log('Generated:')
  console.log(' - public/favicon-16x16.png')
  console.log(' - public/favicon-32x32.png')
  console.log(' - public/apple-touch-icon.png')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
