import { useEffect } from 'react'
import { initSmoothScroll, ScrollTrigger, scrollToId } from './lib/motion'
import { useActiveSection } from './lib/useActiveSection'
import Nav from './sections/Nav'
import Rail from './sections/Rail'
import Hero from './sections/Hero'
import Statement from './sections/Statement'
import Nexa from './sections/Nexa'
import AugMind from './sections/AugMind'
import Forma from './sections/Forma'
import Connect from './sections/Connect'
import HardRock from './sections/HardRock'
import Oryx from './sections/Oryx'
import Careers from './sections/Careers'
import Footer from './sections/Footer'

const themeOf = (el) => el.dataset.theme

export default function App() {
  // The nav takes the colour of whichever section sits under it (pins wrap sections, so match any depth).
  const navTheme = useActiveSection('main [data-theme], footer', 40, themeOf) ?? 'light'

  useEffect(() => initSmoothScroll(), [])

  // Pins add height after other triggers measured; re-measure once layout and fonts settle.
  useEffect(() => {
    // Arriving from another page with /#section: go there once the layout has settled.
    const hash = window.location.hash.slice(1)
    const refresh = () => ScrollTrigger.refresh()
    const toHash = hash ? setTimeout(() => scrollToId(hash), 450) : 0
    document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 300)
    return () => {
      window.removeEventListener('load', refresh)
      clearTimeout(t)
      clearTimeout(toHash)
    }
  }, [])

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <div className="signal-bar">
        <a href="https://nexafuturic.com" target="_blank" rel="noreferrer">NEXA is live: smart factory transformation, operational today →</a>
      </div>
      <Nav theme={navTheme} />
      <Rail />
      <main id="main">
        <Hero />
        <Statement />
        <Connect />
        <Nexa />
        <AugMind />
        <Forma />
        <HardRock />
        <Oryx />
        <Careers />
      </main>
      <Footer />
    </>
  )
}
