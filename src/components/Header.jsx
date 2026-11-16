import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { MenuTear } from './PageTear.jsx'

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

export default function Header({ path = '/', onNavigate = () => {} }) {
  const work = isWorkPath(path)
  const [open, setOpen] = useState(false)
  const [headOpen, setHeadOpen] = useState(false)
  const [active, setActive] = useState(work ? '/work/' : '/#top')
  const [shown, setShown] = useState(active)
  const btnRef = useRef(null)
  const menuRef = useRef(null)
  const edgeRef = useRef(null)
  const tlRef = useRef(null)

  const toggle = () => setOpen((v) => !v)

  useLayoutEffect(() => {
    const menu = menuRef.current
    const edge = edgeRef.current
    const ctx = gsap.context(() => {
      const lines = menu.querySelectorAll('.menu__line-in')
      const socialsEls = menu.querySelectorAll('.menu__socials a')
      const activeLink = menu.querySelector('nav a.is-active')
      const tl = gsap.timeline({ paused: true })
      tl.set([menu, edge], { visibility: 'visible', transformOrigin: '50% 0%' }, 0)
        .fromTo(menu,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.7, ease: 'power3.inOut' }, 0)
        .fromTo(edge,
          { y: -6 },
          { y: () => window.innerHeight - 6, duration: 1.7, ease: 'power3.inOut' }, 0)
        .fromTo(edge, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.18, ease: 'power1.out' }, 0)
        .fromTo(edge, { scaleY: 0.35 }, { scaleY: 1, duration: 0.45, ease: 'power2.out' }, 0)
        .to(edge, { scaleY: 0.3, duration: 0.75, ease: 'power1.inOut' }, 0.5)
        .to(edge, { y: () => window.innerHeight + 20, duration: 0.6, ease: 'power2.in' }, 1.7)
        .fromTo(lines,
          { yPercent: 120, rotate: 6 },
          { yPercent: 0, rotate: 0, duration: 1.05, ease: 'power4.out', stagger: 0.09 }, 0.55)
        .fromTo(socialsEls,
          { autoAlpha: 0, y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.05 }, 1.0)
      if (activeLink) tl.to(activeLink, { '--strike': 1, duration: 0.55, ease: 'power2.out' }, 1.2)
      tlRef.current = tl
    })
    const onResize = () => tlRef.current?.invalidate()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      ctx.revert()
    }
  }, [shown])

  useEffect(() => {
    if (!open && !headOpen) setShown(active)
  }, [active, open, headOpen])

  useEffect(() => {
    const menu = menuRef.current
    const edge = edgeRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) {
      gsap.set(menu, {
        visibility: open ? 'visible' : 'hidden',
        clipPath: open ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
      })
      gsap.set(menu.querySelectorAll('.menu__line-in'), { yPercent: 0, rotate: 0 })
      gsap.set(menu.querySelectorAll('.menu__socials a'), { autoAlpha: 1, y: 0 })
      gsap.set(edge, { visibility: 'hidden' })
      tlRef.current?.progress(0).pause()
      setHeadOpen(open)
      return
    }
    const tl = tlRef.current
    if (!tl) return
    if (open) { setHeadOpen(true); tl.timeScale(1).play(); return }
    if (tl.time() > 1.7) tl.time(1.7)
    tl.eventCallback('onReverseComplete', () => setHeadOpen(false))
    tl.timeScale(1.6).reverse()
  }, [open])

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
      <header className={`site-head${headOpen ? ' is-open' : ''}`}>
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
          {links.map(([label, href]) => (
            <a
              key={href}
              href={href}
              className={shown === href ? 'is-active' : undefined}
              aria-current={shown === href ? 'location' : undefined}
              tabIndex={open ? 0 : -1}
              onClick={(e) => {
                if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
                e.preventDefault()
                onNavigate(href)
                setOpen(false)
              }}
            ><span className="menu__line"><span className="menu__line-in">{label}</span></span></a>
          ))}
        </nav>
        <div className="menu__socials">
          {socials.map(([label, href]) => (
            <a key={href} href={href} tabIndex={open ? 0 : -1}>{label}</a>
          ))}
        </div>
      </div>
      <MenuTear ref={edgeRef} />
    </>
  )
}
