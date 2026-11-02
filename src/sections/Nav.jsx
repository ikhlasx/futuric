import { useEffect, useRef, useState } from 'react'
import { Rise } from 'cube-motion/react'
import { ventures } from '../lib/content'
import { scrollToId } from '../lib/motion'

export default function Nav({ theme }) {
  const [open, setOpen] = useState(false)
  const opener = useRef(null)

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

  function go(id) {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <header className="nav" data-theme={theme}>
        <nav className="links" aria-label="Primary">
          <button ref={opener} aria-expanded={open} aria-controls="products" onClick={() => setOpen(true)}>
            Products
          </button>
          <a href="#about" onClick={(e) => { e.preventDefault(); scrollToId('about') }}>About</a>
          <a href="#careers" onClick={(e) => { e.preventDefault(); scrollToId('careers') }}>Careers</a>
        </nav>
        <a className="mark" href="#top" aria-label="Futuric, back to top" onClick={(e) => { e.preventDefault(); scrollToId('top') }}>
          <span className="logo" aria-hidden="true" />
        </a>
        <div className="end">
          <button className="btn quiet menu-btn" aria-expanded={open} aria-controls="products" onClick={() => setOpen(true)}>
            Menu
          </button>
          <a className="btn cta" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact') }}>
            Build with us <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </header>

      <div className="products" id="products" hidden={!open} role="dialog" aria-modal="true" aria-label="Our products">
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
                  <button onClick={() => go(v.id)}>
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
