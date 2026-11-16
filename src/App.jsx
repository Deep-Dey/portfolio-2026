import { useCallback, useEffect, useRef, useState } from 'react'
import Header, { isWorkPath } from './components/Header.jsx'
import PageTear from './components/PageTear.jsx'
import WorkPage from './components/WorkPage.jsx'
import WorkRail from './components/WorkRail.jsx'
import NameBox from './components/NameBox.jsx'
import About from './components/About.jsx'
import Software from './components/Software.jsx'
import Columns from './components/Columns.jsx'
import Record from './components/Record.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

const ROUTE_META = {
  '/': {
    title: 'Deep Dey | Full Stack Developer & LLM Engineer, Kolkata',
    canonical: 'https://deepdey.dev/',
  },
  '/work': {
    title: 'All Work | Deep Dey, Full Stack Developer & LLM Engineer',
    canonical: 'https://deepdey.dev/work/',
  },
}

const normPath = (p) => p.replace(/\/+$/, '') || '/'
const isRoute = (p) => normPath(p) in ROUTE_META
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function App({ path: initialPath = '/' }) {
  const [path, setPath] = useState(initialPath)
  const [tear, setTear] = useState(null)
  const busy = useRef(false)
  const pending = useRef(null)
  const pathRef = useRef(initialPath)

  const lockScroll = useCallback((on) => {
    const el = document.documentElement
    el.classList.toggle('is-tearing', on)
    const sbw = on ? window.innerWidth - el.clientWidth : 0
    el.style.paddingRight = sbw > 0 ? `${sbw}px` : ''
  }, [])

  const applyRoute = useCallback((pathname, hash, push) => {
    const meta = ROUTE_META[normPath(pathname)]
    if (meta) {
      document.title = meta.title
      document.querySelector('link[rel="canonical"]')?.setAttribute('href', meta.canonical)
      document.querySelector('meta[property="og:url"]')?.setAttribute('content', meta.canonical)
    }
    if (push) window.history.pushState({}, '', pathname + hash)
    window.scrollTo(0, 0)
    pathRef.current = pathname
    setPath(pathname)
  }, [])

  const beginTear = useCallback((target, push) => {
    busy.current = true
    pending.current = { ...target, push }
    lockScroll(true)
    setTear('cover')
  }, [lockScroll])

  const onSheetEnd = useCallback(() => {
    if (tear === 'cover' && pending.current) {
      const { pathname, hash, push } = pending.current
      applyRoute(pathname, hash, push)
      setTear('reveal')
    } else if (tear === 'reveal') {
      pending.current = null
      busy.current = false
      lockScroll(false)
      setTear(null)
    }
  }, [tear, applyRoute, lockScroll])

  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target instanceof Element ? e.target.closest('a[href]') : null
      if (!a || a.target || a.hasAttribute('download')) return
      const url = new URL(a.href)
      if (url.origin !== window.location.origin || !isRoute(url.pathname)) return
      if (normPath(url.pathname) === normPath(pathRef.current)) return
      e.preventDefault()
      if (reducedMotion()) { window.location.href = a.href; return }
      if (busy.current) return
      beginTear({ pathname: url.pathname, hash: url.hash }, true)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [beginTear])

  useEffect(() => {
    const prev = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    const onPop = () => {
      const pathname = window.location.pathname
      if (normPath(pathname) === normPath(pathRef.current)) return
      if (busy.current || reducedMotion()) {
        busy.current = false
        pending.current = null
        setTear(null)
        lockScroll(false)
        applyRoute(pathname, window.location.hash, false)
        return
      }
      beginTear({ pathname, hash: window.location.hash }, false)
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.history.scrollRestoration = prev
      window.removeEventListener('popstate', onPop)
    }
  }, [applyRoute, beginTear, lockScroll])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
    }), { rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [path])

  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [path])

  const work = isWorkPath(path)

  return (
    <>
      <Header path={path} />
      <main id="top">
        {work ? (
          <WorkPage />
        ) : (
          <>
            <WorkRail />
            <div className="container">
              <NameBox />
              <About />
              <Software />
              <Columns />
            </div>
            <Record />
            <Contact />
          </>
        )}
      </main>
      <Footer />
      <PageTear phase={tear} onSheetEnd={onSheetEnd} />
    </>
  )
}
