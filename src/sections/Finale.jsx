import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion, scrollToId } from '../lib/motion'
import { ventures } from '../lib/content'

const lines = [
  'We built factories.',
  'We built intelligence.',
  'We built digital worlds.',
  'We built intelligent homes.',
  'We connected people to new possibilities.',
]

// The aircraft has left: Earth rises with the routes out of Perth while the story closes.
export default function Finale() {
  const root = useRef(null)
  const [lit, setLit] = useState(reducedMotion() ? lines.length : 0)

  useGSAP(() => {
    if (reducedMotion()) return
    gsap.timeline({
      scrollTrigger: {
        trigger: root.current, start: 'top 75%', end: 'bottom bottom', scrub: 0.6,
        onUpdate: (s) => setLit(Math.min(lines.length, Math.round(s.progress * (lines.length + 1)))),
      },
    })
      .fromTo('.finale .earth picture', { yPercent: 18, scale: 1.15 }, { yPercent: 0, scale: 1, ease: 'none' }, 0)
      .fromTo('.finale .earth img', { filter: 'brightness(0.35)' }, { filter: 'brightness(1)', ease: 'none' }, 0)
  }, { scope: root })

  return (
    <section className="finale dark" id="finale" data-theme="dark" ref={root} aria-labelledby="fin-h">
      {/* Higgsfield still: night Earth with flight routes from Perth to the Gulf and India. */}
      <figure className="earth" aria-hidden="true">
        <picture>
          <source type="image/webp" srcSet="/img/finale-earth-800.webp 800w, /img/finale-earth-1344.webp 1344w" sizes="100vw" />
          <img src="/img/finale-earth-1344.jpg" width="1344" height="752" loading="lazy" alt="" />
        </picture>
      </figure>

      <div className="lines">
        {lines.map((l, i) => <p key={l} className={i < lit ? 'on' : ''}>{l}</p>)}
      </div>
      <h2 className="display" id="fin-h">Building what comes next.</h2>
      <div className="names" aria-label="Ventures">
        {ventures.map((v) => <button key={v.id} onClick={() => scrollToId(v.id)}>{v.name}</button>)}
      </div>
      <a className="btn" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact') }}>
        Build with us <span className="arrow" aria-hidden="true">→</span>
      </a>
    </section>
  )
}
