import puppeteer from "puppeteer-core";
const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:5173/";
const browser = await puppeteer.launch({ executablePath: CHROME, args: ["--headless=new"], defaultViewport: { width: 1440, height: 900 } });
const page = await browser.newPage();
await page.goto(URL, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 600));
await page.screenshot({ path: "D:\\DEEP\\portfolio\\.hallmark\\new\\rail-json.png" });

// drag rail to the middle
const drag = await page.evaluate(() => {
  const r = document.querySelector(".rail");
  const before = r.scrollLeft;
  r.dispatchEvent(new PointerEvent("pointerdown", { clientX: 700, bubbles: true }));
  r.dispatchEvent(new PointerEvent("pointermove", { clientX: 700 - (r.scrollWidth - r.clientWidth) / 2 - before, bubbles: true }));
  r.dispatchEvent(new PointerEvent("pointerup", { bubbles: true }));
  return { before, after: r.scrollLeft, max: r.scrollWidth - r.clientWidth, cols: r.querySelectorAll(".rail__col").length };
});
await new Promise(r => setTimeout(r, 300));
await page.screenshot({ path: "D:\\DEEP\\portfolio\\.hallmark\\new\\rail-many.png" });
console.log("DRAG:", JSON.stringify(drag));

// columns section
const y = await page.evaluate(() => document.querySelector(".cols").getBoundingClientRect().top + scrollY - 68);
await page.evaluate(v => scrollTo(0, v), y);
await new Promise(r => setTimeout(r, 500));
await page.screenshot({ path: "D:\\DEEP\\portfolio\\.hallmark\\new\\columns-json.png" });
console.log("done");
await browser.close();
