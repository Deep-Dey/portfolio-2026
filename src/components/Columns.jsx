import { spotlight } from '../data/projects'
import { Card } from './WorkRail'
import FitLine from './FitLine'

export default function Columns() {
  return (
    <div className="cols" data-reveal>
      <div className="cols__main">
        <div className="cols__top">
          <section>
            <h3><span>UPCOMING</span> <span>NEXT</span></h3>
            <p className="body">Fresh entry – the next release is a build with language models.</p>
            <p className="tip"><b>TIP!</b> Write in to hear about it first.</p>
          </section>
          <section>
            {spotlight && <Card p={spotlight} />}
          </section>
        </div>
        <figure className="photo cols__photo">
          <img src="/images/deep-dey-tech-stack.webp" alt="Illustration of Deep Dey's stack: Java, Spring Boot, React, Angular, Python, Docker, AWS and LLM tooling" width="1254" height="1254"
               style={{ objectPosition: '50% 30%', transform: 'scale(1)' }} loading="lazy" />
        </figure>
      </div>
      <div className="cols__side">
        <h2 className="paper-head">
          <FitLine>THINK, BUILD</FitLine>
          <FitLine className="fit-line--big">DEPLOY</FitLine>
        </h2>
        <p className="par dropcap">A strong project is made by close collaboration. I design, develop and deploy software that holds up in production.</p>
        <p className="par">Like a craftsman, I like to start from raw requirements and give them shape: an API, an interface, a pipeline that runs on its own.</p>
        <a className="btn-ellipse btn-ellipse--wide btn-swap" href="/work/">
          <span className="btn-swap__text">ALL WORK</span>
          <svg className="btn-swap__arrow" viewBox="0 0 200 60" aria-hidden="true" focusable="false">
            <path d="M2 30H197M168 4C174 18 184 27 198 30C184 33 174 42 168 56" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
          </svg>
        </a>
      </div>
    </div>
  )
}
