import { useRef } from 'react'
import { useFitText } from '../hooks/useFitText'

export default function FitLine({ children, className, pad = 0, minPad = 0 }) {
  const ref = useRef(null)
  useFitText(ref, { pad, minPad })
  return <span ref={ref} className={`fit-line ${className ?? ''}`}>{children}</span>
}
