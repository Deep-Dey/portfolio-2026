import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Build from './components/Build.jsx'
import Work from './components/Work.jsx'
import Transmission from './components/Transmission.jsx'
import Based from './components/Based.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Build />
        <Work />
        <Transmission />
        <Based />
      </main>
      <Footer />
    </>
  )
}
