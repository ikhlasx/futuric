import { useEffect } from 'react'
import { initSmoothScroll, ScrollTrigger } from './lib/motion'
import { useActiveSection } from './lib/useActiveSection'
import Nav from './sections/Nav'
import Rail from './sections/Rail'
import Hero from './sections/Hero'
import Statement from './sections/Statement'
import Ventures from './sections/Ventures'
import Nexa from './sections/Nexa'
import AugMind from './sections/AugMind'
import Forma from './sections/Forma'
import Connect from './sections/Connect'
import HardRock from './sections/HardRock'
import Oryx from './sections/Oryx'
import Finale from './sections/Finale'
import Careers from './sections/Careers'
import Footer from './sections/Footer'

const themeOf = (el) => el.dataset.theme

export default function App() {
  // The nav takes the colour of whichever section sits under it (pins wrap sections, so match any depth).
  const navTheme = useActiveSection('main [data-theme], footer', 40, themeOf) ?? 'light'

  useEffect(() => initSmoothScroll(), [])

  // Pins add height after other triggers measured; re-measure once layout and fonts settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh()
    document.fonts.ready.then(refresh)
    window.addEventListener('load', refresh)
    const t = setTimeout(refresh, 300)
    return () => {
      window.removeEventListener('load', refresh)
      clearTimeout(t)
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
        <Ventures />
        <Nexa />
        <AugMind />
        <Forma />
        <Connect />
        <HardRock />
        <Oryx />
        <Finale />
        <Careers />
      </main>
      <Footer />
    </>
  )
}
