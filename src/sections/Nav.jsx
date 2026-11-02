import { useEffect, useRef, useState } from 'react'
import { ventures } from '../lib/content'
import { scrollToId } from '../lib/motion'

const go = (id) => (e) => { e.preventDefault(); scrollToId(id) }
const pages = [['/about', 'About'], ['/careers', 'Careers'], ['/contact', 'Contact']]

function Chevron() {
  return (
    <svg className="chev" width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
      <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// One list of the five ventures; each item scrolls to its section (or opens /#id from another page).
function VentureList({ onPick }) {
  return (
    <ul className="nav-ventures">
      {ventures.map((v, i) => (
        <li key={v.id}>
          <a href={`/#${v.id}`} onClick={(e) => { e.preventDefault(); onPick(); scrollToId(v.id) }}>
            <span className="n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <span className="t"><strong>{v.name}</strong><small>{v.field}</small></span>
            <span className="arrow" aria-hidden="true">→</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

export default function Nav({ theme }) {
  // Which dropdown is open: 'ventures' (desktop), 'menu' (phones) or null.
  const [open, setOpen] = useState(null)
  const [stuck, setStuck] = useState(false)
  const header = useRef(null)

  // Once the signal bar has scrolled away, the nav moves up to the top edge.
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 30)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Escape or a click outside the nav closes the dropdown.
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => { if (e.key === 'Escape') setOpen(null) }
    const onDown = (e) => { if (!header.current?.contains(e.target)) setOpen(null) }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  const toggle = (name) => setOpen((o) => (o === name ? null : name))
  const close = () => setOpen(null)

  return (
    <header ref={header} className={`nav${stuck ? ' stuck' : ''}`} data-theme={theme}>
      <a className="mark" href="/#top" aria-label="Futuric, back to top" onClick={go('top')}>
        <span className="logo" aria-hidden="true" style={{ width: 'clamp(124px, 11vw, 160px)', aspectRatio: '1182 / 95' }} />
      </a>

      <nav className="links" aria-label="Primary">
        <div className="nav-drop">
          <button aria-expanded={open === 'ventures'} aria-controls="nav-ventures" onClick={() => toggle('ventures')}>
            Ventures <Chevron />
          </button>
          <div className="nav-panel" id="nav-ventures" hidden={open !== 'ventures'}>
            <p className="nav-panel-head">Five ventures, one group</p>
            <VentureList onPick={close} />
          </div>
        </div>
        <a href="/about">About</a>
        <a href="/careers">Careers</a>
        <a href="/#faq" onClick={go('faq')}>FAQ</a>
      </nav>

      <div className="end">
        <button className="btn ghost menu-btn" aria-expanded={open === 'menu'} aria-controls="nav-menu" onClick={() => toggle('menu')}>
          {open === 'menu' ? 'Close' : 'Menu'}
        </button>
        <a className="btn cta" href="/contact">
          Build with us <span className="arrow" aria-hidden="true">→</span>
        </a>
        <div className="nav-panel nav-menu" id="nav-menu" hidden={open !== 'menu'}>
          <p className="nav-panel-head">Ventures</p>
          <VentureList onPick={close} />
          <ul className="nav-pages">
            {pages.map(([href, label]) => <li key={href}><a href={href}>{label}</a></li>)}
            <li><a href="/#faq" onClick={(e) => { close(); go('faq')(e) }}>FAQ</a></li>
          </ul>
        </div>
      </div>
    </header>
  )
}
