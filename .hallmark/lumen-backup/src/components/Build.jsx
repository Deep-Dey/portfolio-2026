const rows = [
  {
    name: 'web apps',
    line: 'Responsive, robust products from database to interface.',
    tools: 'angular, react, express, spring boot, flask, codeigniter',
  },
  {
    name: 'llm features',
    line: 'Language-model features built into the product, not bolted on beside it.',
    tools: '',
  },
  {
    name: 'scraping and automation',
    line: 'Scripts and scrapers that do the dull work on schedule.',
    tools: 'python, selenium, beautifulsoup',
  },
  {
    name: 'mobile apps',
    line: 'Clean native apps from one codebase.',
    tools: 'flutter',
  },
  {
    name: 'devops',
    line: 'Deployments that build, ship and roll back on their own.',
    tools: 'docker, jenkins, aws',
  },
]

export default function Build() {
  return (
    <section>
      <div className="container">
        <div className="section-head">
          <h2>what do you build?</h2>
        </div>
        <ul className="build-rows">
          {rows.map((r) => (
            <li key={r.name}>
              <h3>{r.name}</h3>
              <span className="build-line">{r.line}</span>
              <span className="build-tools">{r.tools}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
