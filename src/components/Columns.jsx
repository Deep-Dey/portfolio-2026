import { spotlight } from '../data/projects'
import { Card } from './WorkRail'
import FitLine from './FitLine'

export default function Columns() {
  return (
    <div className="cols" data-reveal>
      <div className="cols__main">
        <div className="cols__top">
          <section>
            <h3>UPCOMING NEXT</h3>
            <p className="body">Fresh entry – the next release is a build with language models.</p>
            <p className="tip"><b>TIP!</b> Write in to hear about it first.</p>
          </section>
          <section>
            {spotlight && <Card p={spotlight} compact />}
          </section>
        </div>
        <figure className="photo cols__photo">
          <img src="/images/deep-dey-tech-stack.webp" alt="Illustration of Deep Dey's stack: Java, Spring Boot, React, Angular, Python, Docker, AWS and LLM tooling" width="1254" height="1254"
               style={{ objectPosition: '50% 30%', transform: 'scale(1.1)' }} loading="lazy" />
        </figure>
      </div>
      <div className="cols__side">
        <h2 className="paper-head">
          <FitLine>THINK, BUILD</FitLine>
          <FitLine className="fit-line--big">DEPLOY</FitLine>
        </h2>
        <p className="par dropcap">A strong project is made by close collaboration. I design, develop and deploy software that holds up in production.</p>
        <p className="par">Like a craftsman, I like to start from raw requirements and give them shape: an API, an interface, a pipeline that runs on its own.</p>
        <a className="btn-ellipse btn-ellipse--wide" href="/work/">ALL WORK</a>
      </div>
    </div>
  )
}
