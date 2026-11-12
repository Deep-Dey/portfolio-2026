import puppeteer from 'puppeteer-core'
import { readFileSync } from 'node:fs'

const BASE = 'http://localhost:4173'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const pg = await b.newPage()
await pg.setViewport({ width: 1440, height: 900 })
const problems = []
pg.on('console', (m) => { if (['error', 'warning'].includes(m.type())) problems.push(`console.${m.type()}: ${m.text()}`) })
pg.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))

for (const route of ['/', '/work/']) {
  await pg.goto(BASE + route, { waitUntil: 'networkidle0' })
  await pg.evaluate(() => document.fonts.ready)
  await new Promise(r => setTimeout(r, 800))
}
console.log('PROBLEMS:', JSON.stringify(problems))

// hydration text check
const h1s = await pg.evaluate(() => document.querySelectorAll('h1').length)
console.log('h1 on /work/:', h1s)

// XML parse sitemaps via DOMParser in page
for (const f of ['dist/sitemap.xml', 'dist/sitemap-images.xml']) {
  const xml = readFileSync(`D:/DEEP/portfolio/${f}`, 'utf8')
  const err = await pg.evaluate((x) => {
    const d = new DOMParser().parseFromString(x, 'text/xml')
    return d.querySelector('parsererror')?.textContent?.slice(0, 120) ?? null
  }, xml)
  console.log(f, 'parse:', err ? 'FAIL ' + err : 'ok')
}

// image URL 200s from sitemap-images.xml
const imgs = [...readFileSync('D:/DEEP/portfolio/dist/sitemap-images.xml', 'utf8').matchAll(/<image:loc>https:\/\/deepdey\.dev([^<]+)<\/image:loc>/g)].map(m => m[1])
const uniq = [...new Set(imgs)]
const results = []
for (const u of uniq) {
  const res = await pg.evaluate(async (p) => (await fetch(p)).status, u)
  results.push(`${res} ${u}`)
}
console.log('IMAGES:', results.join(' | '))

// record overflow + fit heads + footer year on /
await pg.goto(BASE + '/', { waitUntil: 'networkidle0' })
await pg.evaluate(() => document.fonts.ready)
await new Promise(r => setTimeout(r, 900))
const checks = await pg.evaluate(() => {
  const row = document.querySelector('.record__cols')
  const rect = row.getBoundingClientRect()
  const cont = document.querySelector('.container').getBoundingClientRect()
  const namebox = document.querySelector('.namebox h1')
  const sw = document.querySelector('.software__box span')
  return {
    recordOverflows: row.scrollWidth > row.clientWidth + 1,
    recordLeft: Math.round(rect.left), containerLeft: Math.round(cont.left),
    namebox: { textW: (() => { const p = namebox.style.cssText; namebox.style.cssText += ';display:inline-block;width:max-content'; const w = namebox.offsetWidth; namebox.style.cssText = p; return Math.round(w) })(), box: namebox.clientWidth },
    software: { textW: (() => { const p = sw.style.cssText; sw.style.cssText += ';display:inline-block;width:max-content'; const w = sw.offsetWidth; sw.style.cssText = p; return Math.round(w) })(), box: sw.clientWidth },
    footer: document.querySelector('footer')?.textContent.match(/©\s*20\d\d/)?.[0],
    h1home: document.querySelectorAll('h1').length,
  }
})
console.log('CHECKS:', JSON.stringify(checks))
await pg.screenshot({ path: 'D:/DEEP/portfolio/.hallmark/new/preview-top.png' })

// enlarged favicon for review
await pg.setContent('<body style="margin:0;background:#888"></body>')
const fav = readFileSync('D:/DEEP/portfolio/public/favicon-32.png').toString('base64')
await pg.setViewport({ width: 256, height: 256 })
await pg.setContent(`<body style="margin:0;background:#888;display:grid;place-items:center;height:256px"><img src="data:image/png;base64,${fav}" style="width:224px;height:224px;image-rendering:auto"></body>`)
await pg.screenshot({ path: 'D:/DEEP/portfolio/.hallmark/new/favicon-32-x7.png' })
await b.close()
console.log('done')
