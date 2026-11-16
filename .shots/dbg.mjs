import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const p = await b.newPage()
await p.setViewport({ width: 390, height: 844 })
await p.goto('http://localhost:5175/work/', { waitUntil: 'networkidle0' })
await new Promise(r=>setTimeout(r,2000))
console.log(await p.evaluate(() => {
  const f = document.querySelector('.wp__inkbox--fit .fit-line')
  const box = document.querySelector('.wp__inkbox--fit')
  const head = document.querySelector('.wp__head')
  const intro = document.querySelector('.wp__intro')
  const cs = getComputedStyle(f)
  const measure = (() => { const prev = f.style.cssText; f.style.cssText += ';display:inline-block;width:max-content;font-size:100px'; const w = f.offsetWidth; f.style.cssText = prev; return w })()
  return JSON.stringify({
    headW: head.clientWidth, boxW: box.clientWidth, fitW: f.clientWidth,
    fs: cs.fontSize, text100: measure, gutter: getComputedStyle(document.documentElement).getPropertyValue('--gutter')
  })
}))
await b.close()
