import puppeteer from 'puppeteer-core'
const b = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', args: ['--headless=new'] })
const p = await b.newPage()
await p.setViewport({ width: 1440, height: 800 })
await p.goto('http://localhost:5175/work/', { waitUntil: 'networkidle0' })
await new Promise(r=>setTimeout(r,1800))
await p.evaluate(() => {
  // simulate 8 more projects by cloning spines
  const sp = document.querySelector('.wp__spines')
  const cta = document.querySelector('.wp__cta')
  for (let i = 0; i < 8; i++) sp.insertBefore(sp.children[i].cloneNode(true), cta)
})
await new Promise(r=>setTimeout(r,400))
console.log(await p.evaluate(() => {
  const sp = document.querySelector('.wp__spines')
  const item = document.querySelector('.wp__item').getBoundingClientRect()
  return JSON.stringify({ scrollWidth: sp.scrollWidth, clientWidth: sp.clientWidth, itemW: item.width, bodyScroll: document.documentElement.scrollWidth })
}))
await p.evaluate(() => { document.querySelector('.wp__spines').scrollLeft = 99999 })
await new Promise(r=>setTimeout(r,400))
await p.screenshot({ path: '.shots/work-many.png' })
await b.close()
