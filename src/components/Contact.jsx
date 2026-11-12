import { useEffect, useRef } from 'react'

const mail = 'mailto:mail@deepdey.dev?subject=Project%20Request'
const SPEED = 65 // px per second

function Group({ dup }) {
  return (
    <div className="marquee__group" aria-hidden={dup || undefined} data-dup={dup || undefined}>
      {[0, 1].map((i) => {
        const hidden = dup || i > 0
        return (
          <div className="marquee__item" key={i} aria-hidden={(!dup && i > 0) || undefined}>
            <span className="mq-text">Let's build something together</span>
            <a className="mq-btn" href={mail} tabIndex={hidden ? -1 : undefined}>EMAIL ME</a>
          </div>
        )
      })}
    </div>
  )
}

export default function Contact() {
  const track = useRef(null)

  useEffect(() => {
    const el = track.current
    const set = () => { el.style.animationDuration = `${(el.scrollWidth / 2 / SPEED).toFixed(1)}s` }
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    document.fonts.ready.then(set)
    return () => ro.disconnect()
  }, [])

  return (
    <section id="contact" className="contact" aria-label="Contact">
      <div className="marquee">
        <div className="marquee__track" ref={track}>
          <Group /><Group dup />
        </div>
      </div>
    </section>
  )
}
