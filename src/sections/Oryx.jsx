import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { Reveal } from 'cube-motion/react'
import { gsap, reducedMotion } from '../lib/motion'
import { ventures } from '../lib/content'

const v = ventures[4]
// Rough positions on an equirectangular 600×600 frame, Perth as the origin.
const origin = { name: 'Perth', x: 470, y: 420 }
const places = [
  { name: 'Dubai', x: 330, y: 250 },
  { name: 'Riyadh', x: 300, y: 260 },
  { name: 'Doha', x: 318, y: 252 },
  { name: 'Melbourne', x: 540, y: 450 },
  { name: 'Kochi', x: 380, y: 300 },
]

// The traveller from the hero reaches the gate; then the routes out of Perth draw themselves.
export default function Oryx() {
  const root = useRef(null)
  const [hover, setHover] = useState(null)

  useGSAP(() => {
    const arcs = gsap.utils.toArray('.globe .arc')
    arcs.forEach((a) => { const len = a.getTotalLength(); gsap.set(a, { strokeDasharray: len, strokeDashoffset: reducedMotion() ? 0 : len }) })
    if (reducedMotion()) return
    // Slow push toward the aircraft as the gate scrolls past.
    gsap.fromTo('.gate picture', { scale: 1 }, {
      scale: 1.14, ease: 'none',
      scrollTrigger: { trigger: '.gate', start: 'top bottom', end: 'bottom top', scrub: true },
    })
    gsap.from('.gate .copy > *', {
      y: 28, opacity: 0, stagger: 0.09, duration: 0.9, ease: 'expo.out',
      scrollTrigger: { trigger: '.gate', start: 'top 60%' },
    })
    gsap.to(arcs, {
      strokeDashoffset: 0, stagger: 0.2, ease: 'none',
      scrollTrigger: { trigger: '.globe', start: 'top 80%', end: 'center 40%', scrub: 0.6 },
    })
  }, { scope: root })

  const arc = (p) => {
    const mx = (origin.x + p.x) / 2
    const my = Math.min(origin.y, p.y) - 120
    return `M${origin.x},${origin.y} Q${mx},${my} ${p.x},${p.y}`
  }

  return (
    <section className="oryx-wrap dark" id="oryx" data-theme="dark" ref={root} aria-labelledby="oryx-h">
      {/* Higgsfield still: a lone traveller at a dawn departure gate. */}
      <figure className="gate" data-nav-over data-theme="light">
        <picture>
          <source type="image/webp" srcSet="/img/oryx-gate-800.webp 800w, /img/oryx-gate-1344.webp 1344w" sizes="100vw" />
          <img
            src="/img/oryx-gate-1344.jpg"
            width="1344"
            height="752"
            loading="lazy"
            alt="A lone traveller with a carry-on stands at a dawn airport window, an aircraft waiting outside."
          />
        </picture>
        <figcaption className="copy">
          <h2 className="h2" id="oryx-h">{v.line}</h2>
          <p className="lede">Oryx Visa: {v.body.charAt(0).toLowerCase() + v.body.slice(1)}</p>
        </figcaption>
      </figure>

      <div className="oryx">
        <Reveal targets="children" className="routes">
          <h3 className="h3">Where we take you.</h3>
          <ul className="places" aria-label="Destinations">
            {places.map((p) => (
              <li key={p.name}>
                <button
                  className={hover === p.name ? 'on' : ''}
                  onMouseEnter={() => setHover(p.name)}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover(p.name)}
                  onBlur={() => setHover(null)}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
          <p className="note">Visa applications, documentation and relocation support from our Perth office.</p>
        </Reveal>

        <svg className="globe" viewBox="0 0 600 600" role="img" aria-label="Routes from Perth to the Gulf, India and Melbourne">
          <circle cx="300" cy="300" r="290" fill="var(--ink-850)" />
          {places.map((p) => (
            <path key={p.name} className="arc" d={arc(p)} style={{ stroke: hover && hover !== p.name ? 'var(--ink-600)' : undefined }} />
          ))}
          {[origin, ...places].map((p) => <circle key={p.name} className="pt" cx={p.x} cy={p.y} r={p === origin ? 7 : 5} />)}
          <text x={origin.x + 12} y={origin.y + 22} fill="var(--paper)" fontSize="16" fontWeight="600">Perth</text>
          {hover && (() => { const p = places.find((q) => q.name === hover); return <text x={p.x - 10} y={p.y - 14} textAnchor="end" fill="var(--paper)" fontSize="16" fontWeight="600">{p.name}</text> })()}
        </svg>
      </div>
    </section>
  )
}
