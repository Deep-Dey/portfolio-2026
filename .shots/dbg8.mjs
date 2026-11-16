import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 800 })
await p.goto('http://localhost:5175/work/', { waitUntil: 'networkidle0' })
await new Promise(r=>setTimeout(r,1800))
await p.evaluate(() => document.querySelectorAll('.wp__spine')[1].click())
await new Promise(r=>setTimeout(r,900))
const widths = await p.evaluate(async () => {
  const panel = document.querySelectorAll('.wp__panel')[1]
  const out = []
  document.querySelectorAll('.wp__spine')[1].click()
  const t0 = performance.now()
  while (performance.now() - t0 < 900) {
    out.push(Math.round(panel.getBoundingClientRect().width))
    await new Promise(r => requestAnimationFrame(r))
  }
  return out
})
console.log(widths.join(','))
await b.close()
