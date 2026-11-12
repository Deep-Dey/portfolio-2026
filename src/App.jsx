import { useEffect } from 'react'
import Header, { isWorkPath } from './components/Header.jsx'
import WorkPage from './components/WorkPage.jsx'
import WorkRail from './components/WorkRail.jsx'
import NameBox from './components/NameBox.jsx'
import About from './components/About.jsx'
import Software from './components/Software.jsx'
import Columns from './components/Columns.jsx'
import Record from './components/Record.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App({ path = '/' }) {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target) }
    }), { rootMargin: '0px 0px -8% 0px' })
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (id) document.getElementById(id)?.scrollIntoView()
  }, [])

  if (isWorkPath(path)) {
    return (
      <>
        <Header path={path} />
        <main id="top"><WorkPage /></main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header path={path} />
      <main id="top">
        <WorkRail />
        <div className="container">
          <NameBox />
          <About />
          <Software />
          <Columns />
        </div>
        <Record />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
