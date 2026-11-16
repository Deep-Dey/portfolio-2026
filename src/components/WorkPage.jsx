import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { projects } from '../data/projects'
import Stamp from './Stamp.jsx'
import FitLine from './FitLine.jsx'

export default function WorkPage() {
  const [openSlug, setOpenSlug] = useState(null)
  const rootRef = useRef(null)

  useLayoutEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.wp__item',
        { xPercent: 110, autoAlpha: 0 },
        { xPercent: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'xPercent,autoAlpha' })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="wp" aria-label="All work" ref={rootRef}>
      <div className="wp__intro">
        <h1 className="wp__head">
          <span className="wp__inkbox wp__inkbox--fit"><FitLine pad={0.04} minPad={10}>FEATURED</FitLine></span>
          <span className="wp__headrow">
            <span className="wp__inkbox">Work</span>
            <Stamp className="stamp--mini" />
          </span>
        </h1>
        <p className="wp__bio dropcap">
          As a full stack developer, I build products from the database to the interface —
          government portals, online stores, LLM platforms and open-source libraries.
          Open any spine to read the story.
        </p>
      </div>
      <div className="wp__spines" role="list">
        {projects.map((p) => {
          const open = openSlug === p.slug
          const panelId = `wp-panel-${p.slug}`
          return (
            <div className={`wp__item${open ? ' is-open' : ''}`} key={p.slug} role="listitem">
              <button
                type="button"
                className="wp__spine"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={(e) => {
                  setOpenSlug(open ? null : p.slug)
                  if (!open) e.currentTarget.closest('.wp__item').scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
                }}
              >
                <span className="wp__spine-title">{p.title}</span>
                <span className="wp__spine-tag tag">{p.tag}</span>
              </button>
              <div className="wp__panel" id={panelId} inert={!open}>
                <div className="wp__panel-in">
                  <span className="wp__panel-tag">{p.tag}</span>
                  <h2 className="wp__panel-title">{p.title}</h2>
                  <p className="wp__panel-desc">{p.description}</p>
                  <p className="wp__panel-links">
                    {p.links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener">{l.label}</a>
                    ))}
                  </p>
                  <figure className="photo wp__photo">
                    <img src={p.image} alt={p.alt} loading="lazy" decoding="async" />
                  </figure>
                </div>
              </div>
            </div>
          )
        })}
        <div className="wp__cta">
          <h2 className="wp__cta-head">LET'S<br />TALK!</h2>
          <p className="wp__cta-text">
            Have an idea for your next product? Let's create something great together.
          </p>
          <a className="wp__cta-mail btn-swap" href="mailto:mail@deepdey.dev">
            <span className="btn-swap__text">EMAIL ME</span>
            <svg className="btn-swap__arrow" viewBox="0 0 200 60" aria-hidden="true" focusable="false">
              <path d="M2 30H197M168 4C174 18 184 27 198 30C184 33 174 42 168 56" fill="none" stroke="currentColor" strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}
