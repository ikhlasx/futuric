import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion, scrollToId } from '../lib/motion'
import { ventures, contact } from '../lib/content'

// Big footer with ghost.ai's engraved wordmark, swept by light as it arrives.
export default function Footer() {
  const root = useRef(null)

  useGSAP(() => {
    if (reducedMotion()) return
    gsap.fromTo('.engraved .sweep', { clipPath: 'inset(0 100% 0 0)' }, {
      clipPath: 'inset(0 0% 0 0)', ease: 'none',
      scrollTrigger: { trigger: '.engraved', start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
    })
    gsap.from('.engraved', { yPercent: 20, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true } })
  }, { scope: root })

  return (
    <footer className="footer light" id="contact" data-theme="light" ref={root}>
      <div className="cols">
        <div className="say">
          <h2 className="h3">Let's build something intelligent.</h2>
          <p>Our engineers and AI architects are ready to help you scale.</p>
          <div>
            <a className="btn" href={`mailto:${contact.email}?subject=Building%20with%20Futuric`}>
              Email {contact.email} <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
        <div>
          <h2>Ventures</h2>
          <ul>
            {ventures.map((v) => (
              <li key={v.id}><a href={`#${v.id}`} onClick={(e) => { e.preventDefault(); scrollToId(v.id) }}>{v.name}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Company</h2>
          <ul>
            {[['about', 'About'], ['careers', 'Careers'], ['faq', 'FAQ']].map(([id, label]) => (
              <li key={id}><a href={`#${id}`} onClick={(e) => { e.preventDefault(); scrollToId(id) }}>{label}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Head office</h2>
          <ul>
            <li>{contact.city}</li>
            <li><a href={contact.phoneHref}>{contact.phone}</a></li>
            <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
          </ul>
        </div>
        <div>
          <h2>Global coverage</h2>
          <ul>{contact.regions.map((r) => <li key={r}>{r}</li>)}</ul>
        </div>
      </div>

      {/* The Futuric logo, engraved: light edge, dark edge, face, then the ink fills in on scroll. */}
      <div className="engraved" role="img" aria-label="Futuric">
        <span className="logo hi" />
        <span className="logo lo" />
        <span className="logo face" />
        <span className="logo sweep" />
      </div>

      <div className="base note">
        <span>© {new Date().getFullYear()} Futuric. Perth, Western Australia.</span>
        <span>NEXA · AugMind · Forma · HardRock · Oryx Visa</span>
      </div>
    </footer>
  )
}
