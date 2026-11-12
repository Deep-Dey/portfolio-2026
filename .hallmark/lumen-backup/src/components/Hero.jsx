const path = [
  { title: 'bsc computer science, kanchrapara college', year: '2016 to 2019' },
  { title: 'msc computer science, kalyani university', year: '2019 to 2021' },
  { title: 'junior developer, websottechs', year: '2021 to 2023' },
  { title: 'backend developer, bloomscorp', year: '2023' },
  { title: 'mtech computer science, kalyani university', year: '2023' },
  { title: 'now: full stack and llm', year: '', now: true },
]

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__field">
        <div className="container">
          <div className="well blueprint">
            <ol className="path">
              {path.map((n) => (
                <li key={n.title} className={n.now ? 'path--now' : undefined}>
                  <span className="path__title">{n.title}</span>
                  {n.year && <span className="path__year">{n.year}</span>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <div className="hero__base">
        <div className="container">
          <h1>i <span className="verb">build</span> the whole stack, model included</h1>
          <p className="lead">Full stack and LLM engineer, based in Kolkata, India.</p>
          <div className="hero__actions">
            <a className="btn btn--primary" href="mailto:mail@deepdey.dev">email me</a>
            <a className="btn btn--secondary" href="#work">see the work</a>
          </div>
        </div>
      </div>
    </section>
  )
}
