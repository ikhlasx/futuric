import { lazy, Suspense, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion } from '../lib/motion'
import { ventures } from '../lib/content'

const v = ventures[4]
const CobeGlobe = lazy(() => import('@/components/ui/cobe-globe'))

// Perth is home; every route starts there.
const PERTH = [-31.95, 115.86]
const MARKERS = [
  { id: 'per', name: 'Perth', location: PERTH, size: 0.045, home: true },
  { id: 'dxb', name: 'Dubai', location: [25.25, 55.36], side: 'right' },
  { id: 'ruh', name: 'Riyadh', location: [24.71, 46.68], side: 'left' },
  { id: 'doh', name: 'Doha', location: [25.29, 51.53], side: 'up' },
  { id: 'mel', name: 'Melbourne', location: [-37.81, 144.96] },
  { id: 'cok', name: 'Kochi', location: [9.93, 76.27] },
]
const ARCS = MARKERS.slice(1).map((m) => ({ id: `per-${m.id}`, from: PERTH, to: m.location }))
const FOCUS = [0, 92]

// The traveller from the hero reaches the gate; then the globe shows the routes out of Perth.
export default function Oryx() {
  const root = useRef(null)

  useGSAP(() => {
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
  }, { scope: root })

  return (
    <section className="oryx-wrap" id="oryx" data-theme="light" ref={root} aria-labelledby="oryx-h">
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

      <div className="oryx" role="img" aria-label="A globe with routes from Perth to Dubai, Riyadh, Doha, Melbourne and Kochi">
        <Suspense fallback={null}>
          <CobeGlobe markers={MARKERS} arcs={ARCS} focus={FOCUS} />
        </Suspense>
      </div>
    </section>
  )
}
