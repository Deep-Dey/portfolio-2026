import puppeteer from 'puppeteer-core'
import { readFileSync, writeFileSync } from 'node:fs'

const src = 'data:image/png;base64,' + readFileSync('.hallmark/signature-src.png').toString('base64')
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const pg = await b.newPage()
const out = await pg.evaluate(async (src) => {
  const img = new Image()
  img.src = src
  await img.decode()
  const c = document.createElement('canvas')
  c.width = img.width; c.height = img.height
  const x = c.getContext('2d')
  x.drawImage(img, 0, 0)
  const d = x.getImageData(0, 0, c.width, c.height)
  let minX = c.width, minY = c.height, maxX = 0, maxY = 0
  for (let i = 0; i < d.data.length; i += 4) {
    const lum = (d.data[i] + d.data[i + 1] + d.data[i + 2]) / 3
    const a = Math.round((255 - lum) * (d.data[i + 3] / 255))
    d.data[i] = 29; d.data[i + 1] = 29; d.data[i + 2] = 27; d.data[i + 3] = a
    if (a > 20) {
      const p = i / 4, px = p % c.width, py = Math.floor(p / c.width)
      minX = Math.min(minX, px); maxX = Math.max(maxX, px); minY = Math.min(minY, py); maxY = Math.max(maxY, py)
    }
  }
  x.putImageData(d, 0, 0)
  const pad = 4
  const w = maxX - minX + 1 + pad * 2, h = maxY - minY + 1 + pad * 2
  const o = document.createElement('canvas')
  o.width = w; o.height = h
  o.getContext('2d').drawImage(c, minX - pad, minY - pad, w, h, 0, 0, w, h)
  return { url: o.toDataURL('image/png'), w, h }
}, src)
writeFileSync('src/assets/signature.png', Buffer.from(out.url.split(',')[1], 'base64'))
console.log('signature.png', out.w, 'x', out.h)
await b.close()
