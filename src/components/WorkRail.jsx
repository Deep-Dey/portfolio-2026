import { featured } from '../data/projects'

export function Card({ p, priority = false }) {
  return (
    <article className="card">
      <a className="card__link" href={p.links?.[0]?.url} target="_blank" rel="noopener noreferrer">
        <figure className="photo"><img src={p.image} alt={p.alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" /></figure>
        <h3>{p.title} <span className="tag">{p.tag}</span></h3>
        <p>{p.description}</p>
      </a>
    </article>
  )
}

function CenterCard() {
  return (
    <div className="rail__center">
      <h2>ALL WORK!</h2>
      <p className="lead">A featured selection<br />of the latest work –<br />client work.</p>
      <p className="tip"><b>TIP!</b> Find every project on <a href="https://github.com/Deep-Dey">GitHub</a></p>
    </div>
  )
}

export default function WorkRail() {
  const [first, second] = featured

  return (
    <section id="work" aria-label="Work">
      <div className="rail">
        <div className="rail__col">{first && <Card p={first} priority />}</div>
        <CenterCard />
        <div className="rail__col">{second && <Card p={second} priority />}</div>
      </div>
    </section>
  )
}
