import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const pg = await b.newPage()
pg.on('pageerror', (e) => console.log('ERR', e.message))
const tag = process.argv[2] ?? 'real'
for (const w of [1440, 375]) {
  await pg.setViewport({ width: w, height: 900 })
  await pg.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
  await pg.evaluate(() => window.scrollTo(0, document.querySelector('.record').getBoundingClientRect().top + scrollY - 120))
  await new Promise((r) => setTimeout(r, 1500))
  const info = await pg.evaluate(() => {
    const row = document.querySelector('.record__cols')
    const before = row.scrollLeft
    row.scrollBy({ left: 600, behavior: 'instant' })
    return { items: row.children.length, overflow: row.scrollWidth > row.clientWidth, tip: !!document.querySelector('.record__tip'), before, after: row.scrollLeft, colW: Math.round(row.children[0].getBoundingClientRect().width) }
  })
  await pg.evaluate(() => { document.querySelector('.record__cols').scrollLeft = 0 })
  await new Promise((r) => setTimeout(r, 300))
  console.log(tag, w, info)
  await pg.screenshot({ path: `.hallmark/new/record-${tag}-${w}.png` })
}
await b.close()
