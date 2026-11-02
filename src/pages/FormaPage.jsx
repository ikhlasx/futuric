import { useEffect } from 'react'
import { initSmoothScroll } from '../lib/motion'
import { useActiveSection } from '../lib/useActiveSection'
import Nav from '../sections/Nav'
import FormaShowcase from '../sections/FormaShowcase'
import Footer from '../sections/Footer'

const themeOf = (el) => el.dataset.theme

// Forma's own page: everything it builds, from enterprise platforms to connected devices.
export default function FormaPage() {
  const navTheme = useActiveSection('main [data-theme], footer', 40, themeOf) ?? 'dark'

  useEffect(() => {
    document.title = 'Forma by Futuric — Digital products built for what comes next'
    return initSmoothScroll()
  }, [])

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <div className="signal-bar">
        <a href="/#forma">← Back to Futuric</a>
      </div>
      <Nav theme={navTheme} />
      <main id="main">
        <FormaShowcase />
      </main>
      <Footer />
    </>
  )
}
