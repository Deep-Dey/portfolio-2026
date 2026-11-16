const EDGE_W = 1200
const EDGE_H = 140
const LIP = 98

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function ridge(rand, base, amp, octaves) {
  let pts = [[-40, base], [EDGE_W + 40, base]]
  for (let o = 0; o < octaves; o++) {
    const step = amp / Math.pow(1.9, o)
    const next = [pts[0]]
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1]
      const [x1, y1] = pts[i]
      next.push([(x0 + x1) / 2, (y0 + y1) / 2 + (rand() - 0.5) * 2 * step], pts[i])
    }
    pts = next
  }
  return pts
}

function stripD(seed, lipPad) {
  const rand = mulberry32(seed)
  return bandD(rand, 44, 42, EDGE_H - 20, 18, lipPad, 999)
}

function bandD(rand, topBase, topAmp, botBase, botAmp, botLo, botHi) {
  const top = ridge(rand, topBase, topAmp, 6)
  const bot = ridge(rand, botBase, botAmp, 5).map(([x, y]) => [x, Math.min(Math.max(y, botLo), botHi)])
  let d = `M-40 ${top[0][1].toFixed(1)}`
  for (const [x, y] of top) d += ` L${x.toFixed(1)} ${y.toFixed(1)}`
  for (let i = bot.length - 1; i >= 0; i--) d += ` L${bot[i][0].toFixed(1)} ${bot[i][1].toFixed(1)}`
  return d + ' Z'
}

const TOP_STRIP = stripD(7, LIP + 20)
const TOP_STRIP_BACK = stripD(15, LIP + 8)
const BOT_STRIP = stripD(19, LIP + 20)
const BOT_STRIP_BACK = stripD(31, LIP + 8)
const sines = (x, terms) => terms.reduce((s, [a, f, p]) => s + a * Math.sin((2 * Math.PI * f * x) / EDGE_W + p), 0)

function ribbon(seed) {
  const rand = mulberry32(seed)
  const hill = (x, c, w) => Math.exp(-(((x / EDGE_W - c) / w) ** 2) / 2)
  const top = ridge(rand, 0, 34, 8).map(([x, j]) => [x, Math.max(4, 150 - 138 * hill(x, 0.2, 0.085) - 70 * hill(x, 0.5, 0.06) - 112 * hill(x, 0.67, 0.075) - 48 * hill(x, 0.9, 0.05) + sines(x, [[6, 3.1, 0.7], [11, 9.3, 0.3], [6, 17.7, 1.2], [3, 31, 2.4]]) + j)])
  const bot = ridge(rand, 0, 16, 8).map(([x, j], i) => [x, top[i][1] + Math.max(20, 44 + 0.5 * (150 - top[i][1]) + sines(x, [[8, 5.3, 0.8]]) + j)])
  const line = (pts) => pts.map(([x, y]) => ` L${x.toFixed(1)} ${y.toFixed(1)}`).join('')
  const rev = (pts, dy = 0) => pts.slice().reverse().map(([x, y]) => [x, y + dy])
  return {
    ink: `M-40 -20 L1240 -20${line(rev(top, 4))} Z`,
    paper: `M-40 ${top[0][1].toFixed(1)}${line(top)}${line(rev(bot))} Z`,
  }
}

const MENU_RIBBON = ribbon(67)

export function MenuTear({ ref }) {
  return (
    <svg ref={ref} className="tear__edge menu__edge" viewBox={`0 0 ${EDGE_W} 240`} preserveAspectRatio="none" focusable="false" aria-hidden="true">
      <rect x="-40" y="-20" width="1280" height="26" fill="#1d1d1b" />
      <path d={MENU_RIBBON.ink} fill="#1d1d1b" filter="url(#tear-ink-fuzz)" />
      <path d={MENU_RIBBON.paper} fill="url(#tear-fiber)" filter="url(#tear-ribbon)" />
    </svg>
  )
}

export function TearEdge({ strip, stripBack, className, flip = false, ref }) {
  const paths = (
    <>
      <path d={strip} transform="translate(0 10)" fill="#121110" opacity="0.55" filter="url(#tear-soft)" />
      <path d={stripBack} transform="translate(0 -13)" fill="#e0d8c3" filter="url(#tear-fuzz)" />
      <path d={strip} fill="url(#tear-fiber)" filter="url(#tear-fuzz)" />
    </>
  )
  return (
    <svg
      ref={ref}
      className={`tear__edge ${className}`}
      viewBox={`0 0 ${EDGE_W} ${EDGE_H}`}
      preserveAspectRatio="none"
      focusable="false"
    >
      {flip ? <g transform={`translate(0 ${EDGE_H}) scale(1 -1)`}>{paths}</g> : paths}
    </svg>
  )
}

export default function PageTear({ phase, onSheetEnd }) {
  return (
    <div className={`tear${phase ? ` is-active is-${phase}` : ''}`} aria-hidden="true">
      <div className="tear__sheet" onAnimationEnd={onSheetEnd}>
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <linearGradient id="tear-fiber" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f8f4ea" />
              <stop offset="55%" stopColor="#f2ecdd" />
              <stop offset="100%" stopColor="#e2dac6" />
            </linearGradient>
            <filter id="tear-fuzz" x="-6%" y="-60%" width="112%" height="220%">
              <feTurbulence type="fractalNoise" baseFrequency="0.014 0.05" numOctaves="4" seed="11" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="16" result="disp" />
              <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="5" result="tex" />
              <feColorMatrix in="tex" type="matrix" values="0 0 0 0 0.32 0 0 0 0 0.30 0 0 0 0 0.26 0 0 0 0.2 0" result="texA" />
              <feComposite in="texA" in2="disp" operator="in" result="grain" />
              <feMerge>
                <feMergeNode in="disp" />
                <feMergeNode in="grain" />
              </feMerge>
            </filter>
            <filter id="tear-ribbon" x="-6%" y="-60%" width="112%" height="220%">
              <feTurbulence type="fractalNoise" baseFrequency="0.035 0.12" numOctaves="4" seed="3" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="16" result="disp" />
              <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="3" seed="8" result="tex" />
              <feColorMatrix in="tex" type="matrix" values="0 0 0 0 0.36 0 0 0 0 0.33 0 0 0 0 0.29 0 0 0 0.34 0" result="texA" />
              <feComposite in="texA" in2="disp" operator="in" result="grain" />
              <feMerge>
                <feMergeNode in="disp" />
                <feMergeNode in="grain" />
              </feMerge>
            </filter>
            <filter id="tear-soft" x="-6%" y="-60%" width="112%" height="220%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
            <filter id="tear-ink-fuzz" x="-6%" y="-60%" width="112%" height="220%">
              <feTurbulence type="fractalNoise" baseFrequency="0.014 0.05" numOctaves="4" seed="11" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="14" />
            </filter>
          </defs>
        </svg>
        <div className="tear__paper" />
        <TearEdge strip={TOP_STRIP} stripBack={TOP_STRIP_BACK} className="tear__edge--top" />
        <TearEdge strip={BOT_STRIP} stripBack={BOT_STRIP_BACK} className="tear__edge--bottom" />
      </div>
    </div>
  )
}
