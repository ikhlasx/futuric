import { useEffect, useRef, useState } from 'react'
import { Rise } from 'cube-motion/react'
import { ventures } from '../lib/content'
import { scrollToId } from '../lib/motion'

const go = (id) => (e) => { e.preventDefault(); scrollToId(id) }

export default function Nav({ theme }) {
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  const opener = useRef(null)

  // Once the signal bar has scrolled away, the nav moves up to the top edge.
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  function close() {
    setOpen(false)
    opener.current?.focus()
  }

  function goVenture(id) {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <header className={`nav${stuck ? ' stuck' : ''}`} data-theme={theme}>
        <a className="mark" href="#top" aria-label="Futuric, back to top" onClick={go('top')}>
          <span className="logo" aria-hidden="true" style={{ width: 'clamp(124px, 11vw, 160px)', aspectRatio: '1182 / 95' }} />
        </a>
        <nav className="links" aria-label="Primary">
          <button ref={opener} aria-expanded={open} aria-controls="products" onClick={() => setOpen(true)}>
            Ventures
          </button>
          <a href="#about" onClick={go('about')}>About</a>
          <a href="#careers" onClick={go('careers')}>Careers</a>
          <a href="#faq" onClick={go('faq')}>FAQ</a>
        </nav>
        <div className="end">
          <button className="btn ghost menu-btn" aria-expanded={open} aria-controls="products" onClick={() => setOpen(true)}>
            Menu
          </button>
          <a className="btn cta" href="#contact" onClick={go('contact')}>
            Build with us <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <div className="products" id="products" hidden={!open} role="dialog" aria-modal="true" aria-label="Our ventures">
        <button className="close" onClick={close}>Close</button>
        {open && (
          <>
            <Rise targets="children" className="say">
              <p className="h3">Five ventures.</p>
              <p className="note">One group building what comes next, from Perth to the Gulf.</p>
            </Rise>
            <Rise as="ol" targets="children">
              {ventures.map((v) => (
                <li key={v.id}>
                  <button onClick={() => goVenture(v.id)}>
                    <span className="n">{v.name}</span>
                    <span className="f">{v.field}</span>
                  </button>
                </li>
              ))}
            </Rise>
          </>
        )}
      </div>
    </>
  )
}
