import { useRef } from "react";
import { useFitText } from "../hooks/useFitText";
import signature from "../assets/signature.png";

const RAYS = 15

export default function Software() {
  const text = useRef(null);
  useFitText(text, { pad: 0.03, minPad: 0 });
  return (
    <div className="software" data-reveal>
      <div className="software__box" aria-hidden="true"><span ref={text} className="display">WEBSITE</span></div>
      <aside className="stamp" aria-label="Deep Dey, Kolkata, India">
        <svg className="stamp__art" viewBox="0 0 140 90" aria-hidden="true">
          <g stroke="var(--color-sun)" strokeWidth="3.2" strokeLinecap="butt">
            {Array.from({ length: RAYS }, (_, i) => {
              const a = Math.PI + (i * Math.PI) / (RAYS - 1)
              return <line key={i} x1={70 + 16 * Math.cos(a)} y1={56 + 16 * Math.sin(a)} x2={70 + 50 * Math.cos(a)} y2={56 + 50 * Math.sin(a)} />
            })}
            <line x1="4" y1="57" x2="136" y2="57" strokeWidth="4" />
          </g>
          <image href={signature} x="22" y="52" width="96" height="28" preserveAspectRatio="xMidYMid meet" />
        </svg>
        <div className="stamp__field"><b>NAME:</b> <span>Deep Dey</span></div>
        <div className="stamp__field"><b>BASED:</b> <span>Kolkata, IN</span></div>
      </aside>
    </div>
  )
}
