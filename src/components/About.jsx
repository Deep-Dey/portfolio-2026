import FitLine from './FitLine'

const portrait = '/images/deep-dey-portrait.webp'
const side = '/images/deep-dey-side-profile.webp'

const roles = ['FULL STACK DEVELOPER', 'LLM ENGINEER', <>BASED IN <u>KOLKATA, INDIA</u></>]

export default function About() {
  return (
    <section id="about" className="about" aria-label="About">
      <div className="about__left" data-reveal>
        <h2 className="paper-head">
          <FitLine>FULL STACK</FitLine>
          <FitLine className="fit-line--big">DEVELOPER!</FitLine>
        </h2>
        <figure className="photo photo--tall photo--fit">
          <img src={side} alt="Illustrated side profile of Deep Dey" width="1163" height="1352" loading="lazy" decoding="async" />
        </figure>
        <p className="about__bio dropcap">
          As a full stack developer, I build products from the database to the interface
          with Spring Boot, Angular, React, Express and Python
          and lately I build language models into them, for teams and companies around the world.
        </p>
      </div>
      <div className="about__right" data-reveal>
        <figure className="photo photo--wide">
          <img src={portrait} alt="Illustrated portrait of Deep Dey" width="1163" height="1352"
               style={{ objectPosition: '50% 15%', transform: 'scale(1.6)' }} loading="lazy" decoding="async" />
        </figure>
        <div className="about__roles">
          {roles.map((r, i) => <div key={i} className="role">{r}</div>)}
        </div>
      </div>
    </section>
  )
}
