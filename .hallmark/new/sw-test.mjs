import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' })
const pg = await b.newPage()
pg.on('pageerror', (e) => console.log('ERR', e.message))
for (const [w, h] of [[1440, 900], [375, 812]]) {
  await pg.setViewport({ width: w, height: h })
  await pg.goto('http://localhost:5173/', { waitUntil: 'networkidle0' })
  await pg.evaluate(() => document.querySelector('.software').scrollIntoView({ block: 'center' }))
  await new Promise((r) => setTimeout(r, 1800))
  const el = await pg.$('.software')
  await el.screenshot({ path: `.hallmark/new/software-${w}.png` })
  console.log(w, await pg.evaluate(() => {
    const box = document.querySelector('.software__box').getBoundingClientRect()
    const s = document.querySelector('.software__box span').getBoundingClientRect()
    return { box: [box.width, box.height], text: [s.width, s.height] }
  }))
}
await b.close()
