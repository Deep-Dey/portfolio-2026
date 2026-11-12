import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const pg = await b.newPage()
pg.on('pageerror', (e) => console.log('ERR', e.message))
for (const [w, h, f] of [[1440, 900, 'about-head-1440'], [375, 812, 'about-head-375']]) {
  await pg.setViewport({ width: w, height: h })
  await pg.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
  await pg.evaluate(() => document.querySelector('#about').scrollIntoView())
  await new Promise((r) => setTimeout(r, 1800))
  const el = await pg.$('.about__left')
  await el.screenshot({ path: `.hallmark/new/${f}.png` })
  console.log(w, await pg.evaluate(() => [...document.querySelectorAll('.fit-line')].map((e) => [e.scrollWidth, e.clientWidth, getComputedStyle(e).fontSize])))
}
await b.close()
