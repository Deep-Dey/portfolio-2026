const projects = [
  {
    name: 'bmx-transmission',
    line: 'An Angular utility library for API calls, with hooks for every step of the call.',
    links: [
      ['npm', 'https://www.npmjs.com/package/bmx-transmission'],
      ['github', 'https://github.com/bloomscorp/bmx-transmission'],
    ],
  },
  {
    name: 'bmx-onepiece',
    line: 'An Express and MongoDB starter with users, security and logging already wired.',
    links: [
      ['github', 'https://github.com/bloomscorp/bmx-onepiece'],
    ],
  },
  {
    name: 'python-sorter',
    line: 'A Python library that sorts with several algorithms and reports how long each took.',
    links: [
      ['pypi', 'https://pypi.org/project/python-sorter'],
      ['github', 'https://github.com/Deep-Dey/python-sorter'],
    ],
  },
]

export default function Work() {
  return (
    <section id="work">
      <div className="container">
        <div className="section-head">
          <h2>what have you shipped?</h2>
        </div>
        <ul className="work-rows">
          {projects.map((p) => (
            <li key={p.name}>
              <h3>{p.name}</h3>
              <span className="work-line">{p.line}</span>
              <span className="work-links">
                {p.links.map(([label, href]) => (
                  <a key={label} href={href}>{label}</a>
                ))}
              </span>
            </li>
          ))}
        </ul>
        <p className="work-more"><a href="https://github.com/Deep-Dey">all projects on github</a></p>
      </div>
    </section>
  )
}
