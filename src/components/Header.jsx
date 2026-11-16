import { useEffect, useRef, useState } from 'react'

const links = [
  ['Index', '/#top'],
  ['Work', '/work/'],
  ['About', '/#about'],
]
const sections = ['/#about']

export const isWorkPath = (path) => path.replace(/\/+$/, '') === '/work'
const socials = [
  ['GitHub', 'https://github.com/Deep-Dey'],
  ['LinkedIn', 'https://www.linkedin.com/in/deep-dey-20998/'],
  ['X', 'https://twitter.com/iam_deep_dey'],
  ['Resume', 'https://drive.google.com/file/d/1TPk5doVfckY401QU9wQNklYObXTltPPx/view?usp=sharing'],
]

function currentSection() {
  if (isWorkPath(window.location.pathname)) return '/work/'
  const doc = document.documentElement
  if (window.scrollY > 0 && window.innerHeight + window.scrollY >= doc.scrollHeight - 2) return sections[sections.length - 1]
  const mid = window.innerHeight / 2
  let active = '/#top'
  for (const href of sections) {
    const el = document.getElementById(href.slice(2))
    if (el && el.getBoundingClientRect().top <= mid) active = href
  }
  return active
}

export default function Header({ path = '/' }) {
  const work = isWorkPath(path)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(work ? '/work/' : '/#top')
  const btnRef = useRef(null)
  const menuRef = useRef(null)

  const toggle = () => setOpen((v) => !v)

  useEffect(() => {
    if (work) { setActive('/work/'); return }
    let frame = 0
    const update = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(() => setActive(currentSection())) }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [work])

  useEffect(() => {
    if (!open) return
    const menu = menuRef.current
    const focusables = () => [btnRef.current, ...menu.querySelectorAll('a[href]')]
    focusables()[1]?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') { setOpen(false); return }
      if (e.key !== 'Tab') return
      const f = focusables()
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      btnRef.current?.focus()
    }
  }, [open])

  return (
    <>
      <header className={`site-head${open ? ' is-open' : ''}`}>
        <span className="site-head__place">Kolkata, IN</span>
        <a className="site-head__mark" href="/#top">The Daily Deploy</a>
        <button
          ref={btnRef}
          className="burger"
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={toggle}
        >
          <span /><span />
        </button>
      </header>
      <div
        id="site-menu"
        ref={menuRef}
        className={`menu${open ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        aria-hidden={!open}
      >
        <div className="menu__head">
          <span className="menu__mark">The Daily Deploy</span>
        </div>
        <nav aria-label="Sections">
          {links.map(([label, href], i) => (
            <a
              key={href}
              href={href}
              className={active === href ? 'is-active' : undefined}
              aria-current={active === href ? 'location' : undefined}
              style={{ '--i': i }}
              tabIndex={open ? 0 : -1}
              onClick={() => { setActive(href); setOpen(false) }}
            >{label}</a>
          ))}
        </nav>
        <div className="menu__socials">
          {socials.map(([label, href]) => (
            <a key={href} href={href} tabIndex={open ? 0 : -1}>{label}</a>
          ))}
        </div>
      </div>
    </>
  )
}
