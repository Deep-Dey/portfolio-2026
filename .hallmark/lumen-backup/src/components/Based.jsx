import { useEffect, useState } from 'react'
import portrait from '../assets/profile-pic.jpg'

const fmt = new Intl.DateTimeFormat('en-GB', {
  hour: '2-digit', minute: '2-digit',
  timeZone: 'Asia/Kolkata', hour12: false,
})

export default function Based() {
  const [time, setTime] = useState('Kolkata, UTC+5:30')

  useEffect(() => {
    const tick = () => setTime(`${fmt.format(new Date())} ist, kolkata`)
    tick()
    const id = setInterval(tick, 30000)
    return () => clearInterval(id)
  }, [])

  return (
    <section>
      <div className="container">
        <div className="section-head">
          <h2>where are you based?</h2>
        </div>
        <div className="based-grid">
          <div className="based-copy">
            <p>Kolkata, India. I work with teams across time zones, in English.</p>
            <p className="based-time" aria-live="off">{time}</p>
            <nav className="based-links" aria-label="Elsewhere">
              <a href="https://github.com/Deep-Dey">github</a>
              <a href="https://www.linkedin.com/in/deep-dey-20998/">linkedin</a>
              <a href="https://twitter.com/iam_deep_dey">x</a>
              <a href="https://drive.google.com/file/d/1TPk5doVfckY401QU9wQNklYObXTltPPx/view?usp=sharing">resume</a>
            </nav>
          </div>
          <figure className="portrait" data-slot="portrait" data-alt="A portrait photograph of Deep Dey">
            <img src={portrait} width="1088" height="914" alt="Deep Dey" loading="lazy" />
          </figure>
        </div>
      </div>
    </section>
  )
}
