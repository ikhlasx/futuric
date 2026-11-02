import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion } from '../lib/motion'

const text =
  'Futuric drives intelligent industrial ecosystems and high-performance ventures across Australia and the world. From the factory floor to the front door, we build the systems that run what comes next.'
const words = text.split(' ')

// airform's statement: hidden at first, the words appear one by one as you scroll,
// over a blurred close-up of the Core.
export default function Statement() {
  const root = useRef(null)
  const [lit, setLit] = useState(0)

  useGSAP(() => {
    // The word reveal follows the scroll even with reduced motion: it fades in place, nothing travels.
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: root.current, start: 'top 70%', end: 'bottom 55%', scrub: true,
        onUpdate: (s) => setLit(Math.round(s.progress * words.length)),
      },
    })
    if (!reducedMotion()) tl.fromTo('.statement .haze', { scale: 1.25, yPercent: -6 }, { scale: 1.05, yPercent: 6, ease: 'none' })
  }, { scope: root })

  return (
    <section className="statement light" id="about" data-theme="light" ref={root} aria-labelledby="statement-h">
      <div className="haze" aria-hidden="true" />
      <h2 className="sr-only" id="statement-h">About Futuric</h2>
      <p aria-label={text}>
        {words.map((w, i) => (
          <span key={i} className={i < lit ? 'w on' : 'w'} aria-hidden="true">{w} </span>
        ))}
      </p>
    </section>
  )
}
