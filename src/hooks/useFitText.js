import { useEffect, useLayoutEffect } from "react";

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* Fits a single-line text element to its box width exactly (minus padding
   on each side) by measuring at a reference size and scaling font-size. */
export function useFitText(ref, { pad = 0.02, minPad = 8 } = {}) {
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fit = () => {
      const boxW = el.clientWidth;
      const padPx = Math.max(minPad, boxW * pad);
      const target = boxW - padPx * 2;
      const prev = el.style.cssText;
      el.style.cssText += ";display:inline-block;width:max-content;font-size:100px";
      const textW = el.offsetWidth || 1;
      el.style.cssText = prev;
      el.style.fontSize = `${(100 * target / textW).toFixed(2)}px`;
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    let cancelled = false;
    document.fonts.ready.then(() => { if (!cancelled) fit(); });
    return () => { cancelled = true; ro.disconnect(); };
  }, [ref, pad, minPad]);
}
