import { useRef } from "react";
import { useFitText } from "../hooks/useFitText";

export default function NameBox() {
  const h1 = useRef(null);
  useFitText(h1);
  return (
    <div className="namebox" data-reveal>
      <h1 ref={h1}>DEEP DEY</h1>
    </div>
  )
}
