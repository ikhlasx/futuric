import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion } from '../lib/motion'

const text =
  'Futuric drives intelligent industrial ecosystems and high-performance ventures across Australia and the world. From the factory floor to the front door, we build the systems that run what comes next.'
const words = text.split(' ')

// airform's statement: words darken one by one as you scroll, over a blurred close-up of the Core.
export default function Statement() {
  const root = useRef(null)
  const [lit, setLit] = useState(reducedMotion() ? words.length : 2)

  useGSAP(() => {
    if (reducedMotion()) return
    gsap.timeline({
      scrollTrigger: {
        trigger: root.current, start: 'top 75%', end: 'bottom 45%', scrub: true,
        onUpdate: (s) => setLit(2 + Math.round(s.progress * (words.length - 2))),
      },
    }).fromTo('.statement .haze', { scale: 1.25, yPercent: -6 }, { scale: 1.05, yPercent: 6, ease: 'none' })
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
