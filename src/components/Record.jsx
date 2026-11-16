import { useEffect, useRef, useState } from 'react'
import entries from '../data/record.json'

export default function Record() {
  const rowRef = useRef(null)
  const [overflows, setOverflows] = useState(false)

  useEffect(() => {
    const row = rowRef.current
    const check = () => setOverflows(row.scrollWidth > row.clientWidth + 1)
    check()
    const ro = new ResizeObserver(check)
    ro.observe(row)
    return () => ro.disconnect()
  }, [])

  return (
    <section className="record" aria-label="The record">
      <div className="record__top container">
        <span className="counter__label">SHIPPING SINCE 2021</span>
        <h2 className="record__head">THE RECORD</h2>
      </div>
      {overflows && <p className="tip record__tip container"><b>TIP!</b> Scroll sideways to see the full record</p>}
      <div
        ref={rowRef}
        className="record__cols container"
        data-reveal
        tabIndex={overflows ? 0 : undefined}
        role={overflows ? 'region' : undefined}
        aria-label={overflows ? 'The record, scroll sideways for more' : undefined}
      >
        {entries.map((e, i) => (
          <article key={`${e.years}-${e.title}-${i}`}>
            <span className="yr display">{e.years}</span>
            <h3>{e.title}</h3>
            <p>{e.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
