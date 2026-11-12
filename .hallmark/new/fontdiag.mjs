import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const URL = "http://localhost:5173/";

const browser = await puppeteer.launch({
  executablePath: CHROME,
  args: ["--headless=new"],
  defaultViewport: { width: 1440, height: 900 },
});
const page = await browser.newPage();
await page.goto(URL, { waitUntil: "networkidle0" });
await page.evaluate(() => document.fonts.ready);
await new Promise(r => setTimeout(r, 400));

const css = await (await fetch(
  "https://fonts.googleapis.com/css2?family=Roboto+Serif:ital,opsz,wdth,wght@0,8..144,50..150,100..900&display=swap",
  { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36" } }
)).text();
console.log("CSS2 @font-face stretch:", [...css.matchAll(/font-stretch:[^;]+/g)].slice(0, 2).map(m => m[0]).join(" | "));

const probe = await page.evaluate(async () => {
  const h1 = document.querySelector(".namebox h1");
  const cs = getComputedStyle(h1);
  const mk = async wd => {
    const p = document.createElement("span");
    p.style.cssText = `font-family:${cs.fontFamily};font-size:100px;font-weight:700;font-variation-settings:"wdth" ${wd};white-space:nowrap;position:absolute;visibility:hidden`;
    p.textContent = "DEEP DEY";
    document.body.appendChild(p);
    const w = p.getBoundingClientRect().width;
    p.remove();
    return w;
  };
  const faces = [];
  for (const f of document.fonts) {
    if (f.family.includes("Roboto Serif")) faces.push({ family: f.family, stretch: f.stretch, weight: f.weight, status: f.status });
  }
  return {
    w50: await mk(50),
    w100: await mk(100),
    h1stretch: cs.fontStretch,
    h1fvs: cs.fontVariationSettings,
    h1fs: cs.fontSize,
    h1text: (() => { const p = h1.style.cssText; h1.style.cssText += ";display:inline-block;width:max-content"; const w = h1.offsetWidth; h1.style.cssText = p; return w })(),
    h1box: h1.clientWidth,
    sw: (() => { const s = document.querySelector(".software__box span"); if (!s) return null; const p = s.style.cssText; s.style.cssText += ";display:inline-block;width:max-content"; const w = s.offsetWidth; s.style.cssText = p; return { w, box: s.clientWidth, fs: getComputedStyle(s).fontSize } })(),
    faces: faces.slice(0, 4),
    loaded: document.fonts.check('100px "Roboto Serif"'),
  };
});
console.log(JSON.stringify(probe, null, 2));
await browser.close();
