import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const pg = await b.newPage()
pg.on('pageerror', (e) => console.log('ERR', e.message))
for (const [w, h] of [[1440, 1000], [375, 812]]) {
  await pg.setViewport({ width: w, height: h })
  await pg.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
  await pg.evaluate(() => document.querySelector('.cols').scrollIntoView())
  await new Promise((r) => setTimeout(r, 1800))
  const el = await pg.$('.cols')
  await el.screenshot({ path: `.hallmark/new/cols-${w}.png` })
  console.log(w, await pg.evaluate(() => [...document.querySelectorAll('.fit-line')].map((e) => [e.textContent, e.scrollWidth, e.clientWidth, getComputedStyle(e).fontSize])))
}
await b.close()
