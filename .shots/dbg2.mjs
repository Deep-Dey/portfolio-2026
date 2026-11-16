import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const p = await b.newPage()
await p.setViewport({ width: 390, height: 844 })
await p.goto('http://localhost:5175/work/', { waitUntil: 'networkidle0' })
await new Promise(r=>setTimeout(r,1500))
console.log(await p.evaluate(() => {
  const f = document.querySelector('.wp__inkbox--fit .fit-line')
  const box = document.querySelector('.wp__inkbox--fit')
  const r = f.getBoundingClientRect()
  const prev = f.style.fontSize; f.style.fontSize = '84.77px'
  const r2 = f.getBoundingClientRect()
  f.style.fontSize = prev
  return JSON.stringify({ boxW: box.clientWidth, rectW: r.width, rectW2: r2.width, fs: getComputedStyle(f).fontSize })
}))
await b.close()
