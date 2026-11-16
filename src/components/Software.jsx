import { useRef } from "react";
import { useFitText } from "../hooks/useFitText";
import Stamp from "./Stamp.jsx";

export default function Software() {
  const text = useRef(null);
  useFitText(text, { pad: 0.03, minPad: 0 });
  return (
    <div className="software" data-reveal>
      <div className="software__box" aria-hidden="true"><span ref={text} className="display">WEBSITE</span></div>
      <Stamp />
    </div>
  )
}
