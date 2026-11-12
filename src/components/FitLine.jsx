import { useRef } from 'react'
import { useFitText } from '../hooks/useFitText'

export default function FitLine({ children, className }) {
  const ref = useRef(null)
  useFitText(ref, { pad: 0, minPad: 0 })
  return <span ref={ref} className={`fit-line ${className ?? ''}`}>{children}</span>
}
