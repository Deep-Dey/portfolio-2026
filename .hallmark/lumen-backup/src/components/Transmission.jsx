const steps = ['request', 'pre-execute', 'the call', 'post-execute']

export default function Transmission() {
  return (
    <section className="case-open">
      <div className="container">
        <div className="section-head">
          <h2>how does bmx-transmission work?</h2>
        </div>
        <p className="lead">Every API call passes through the same four hooks, so loading states, errors and data shaping live in one place instead of every component.</p>
        <div className="well hook-well">
          <ol className="hook">
            {steps.map((s) => (
              <li key={s}><span className="hook__name">{s}</span></li>
            ))}
            <li>
              <ul className="hook__outcomes">
                <li className="hook--success">on-success</li>
                <li>on-failure</li>
              </ul>
            </li>
          </ol>
        </div>
      </div>
    </section>
  )
}
