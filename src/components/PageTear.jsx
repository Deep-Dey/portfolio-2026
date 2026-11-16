const EDGE_W = 1200
const EDGE_H = 120

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

function bandPath(seed) {
  const rand = mulberry32(seed)
  const top = ridge(rand, 52, 46, 6)
  const pts = top.map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join(' ')
  return `M-40 ${EDGE_H + 40} ${pts} L${EDGE_W + 40} ${EDGE_H + 40} Z`
}

const TOP_PATH = bandPath(7)
const BOTTOM_PATH = bandPath(19)

export default function PageTear({ phase, onSheetEnd }) {
  return (
    <div className={`tear${phase ? ` is-active is-${phase}` : ''}`} aria-hidden="true">
      <div className="tear__sheet" onAnimationEnd={onSheetEnd}>
        <svg
          className="tear__edge tear__edge--top"
          viewBox={`0 0 ${EDGE_W} ${EDGE_H}`}
          preserveAspectRatio="none"
          focusable="false"
        >
          <defs>
            <linearGradient id="tear-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f6f1e7" />
              <stop offset="38%" stopColor="#e2dbcd" />
              <stop offset="74%" stopColor="#8b8478" />
              <stop offset="100%" stopColor="#1d1d1b" />
            </linearGradient>
            <filter id="tear-fuzz" x="-6%" y="-70%" width="112%" height="240%">
              <feTurbulence type="fractalNoise" baseFrequency="0.013 0.05" numOctaves="4" seed="11" result="n" />
              <feDisplacementMap in="SourceGraphic" in2="n" scale="20" />
            </filter>
          </defs>
          <path d={TOP_PATH} fill="url(#tear-fill)" filter="url(#tear-fuzz)" />
        </svg>
        <div className="tear__paper" />
        <svg
          className="tear__edge tear__edge--bottom"
          viewBox={`0 0 ${EDGE_W} ${EDGE_H}`}
          preserveAspectRatio="none"
          focusable="false"
        >
          <path d={BOTTOM_PATH} fill="url(#tear-fill)" filter="url(#tear-fuzz)" />
        </svg>
      </div>
    </div>
  )
}
