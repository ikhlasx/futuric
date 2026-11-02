import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion } from '../lib/motion'
import { ventures } from '../lib/content'

const nexa = ventures[0]

// The camera pushes through the hangar door toward this point (percent of the picture).
const origin = { x: 50, y: 52 }
const zoom = 1.45

// Each step of the stack is pinned to the thing in the picture that does it.
const steps = [
  { name: 'Machines', tag: 'Machines · robot cells', x: 27, y: 52 },
  { name: 'IoT', tag: 'IoT · line sensors', x: 64, y: 24 },
  { name: 'Data', tag: 'Data · live feed', x: 76, y: 58 },
  { name: 'AI', tag: 'AI · machine vision', x: 50, y: 67 },
  { name: 'Autonomous action', tag: 'Autonomous action', x: 63, y: 46 },
]

// Where a point lands once the picture is scaled by --s around the origin.
const at = (v, o) => `calc(${o}% + (${v}% - ${o}%) * var(--s))`

// ghost.ai's exploded view, retold: walk into the NEXA factory as it comes alive.
export default function Nexa() {
  const root = useRef(null)
  const [step, setStep] = useState(-1)

  useGSAP(() => {
    if (reducedMotion()) { setStep(steps.length - 1); return }
    const mm = gsap.matchMedia()
    const build = (pin, end) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pin ? '.nexa .pin' : '.nexa-shot',
          start: pin ? 'top top' : 'top 80%',
          end,
          pin,
          scrub: 0.8,
          onUpdate: (self) => setStep(Math.min(steps.length - 1, Math.floor(self.progress * (steps.length + 0.6)) - 1)),
        },
      })
      tl.fromTo('.nexa-shot', { '--s': 1 }, { '--s': zoom, ease: 'none', duration: 1 }, 0)
        .fromTo('.nexa-shot .dark', { opacity: 0.35 }, { opacity: 0, ease: 'none', duration: 0.5 }, 0)
    }
    mm.add('(min-width: 961px)', () => build(true, '+=1500'))
    mm.add('(max-width: 960px)', () => build(false, 'bottom 30%'))
  }, { scope: root })

  return (
    <section className="nexa light-2" id="nexa" data-theme="light" ref={root} aria-labelledby="nexa-h">
      <div className="pin">
        <div className="copy">
          <h2 className="h2" id="nexa-h">{nexa.line}</h2>
          <p className="lede">{nexa.body}</p>
          <ol className="steps" aria-label="How NEXA works">
            {steps.map((s, i) => <li key={s.name} className={i <= step ? 'on' : ''}>{s.name}</li>)}
          </ol>
          <div>
            <a className="btn ink" href={nexa.href} target="_blank" rel="noreferrer">
              Visit nexafuturic.com <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </div>

        {/* Higgsfield still: the NEXA hangar door. Later: a scroll-scrubbed walk-in clip. */}
        <figure className="nexa-shot" data-slot="nexa-factory" style={{ '--s': 1, '--ox': `${origin.x}%`, '--oy': `${origin.y}%` }}>
          <div className="cam">
            <picture>
              <source type="image/webp" srcSet="/img/nexa-factory-640.webp 640w, /img/nexa-factory-880.webp 880w" sizes="(max-width: 960px) 100vw, 40vw" />
              <img
                src="/img/nexa-factory-880.jpg"
                width="880"
                height="1168"
                loading="lazy"
                alt="A person stands in the open door of a NEXA smart factory, robotic arms working along the lines inside."
              />
            </picture>
            <div className="dark" aria-hidden="true" />
          </div>
          {steps.map((s, i) => (
            <span
              key={s.name}
              className={`tag${i <= step ? ' on' : ''}${s.x > 60 ? ' flip' : ''}`}
              style={{ left: at(s.x, origin.x), top: at(s.y, origin.y) }}
              aria-hidden="true"
            >
              <i className="pip" />{s.tag}
            </span>
          ))}
        </figure>
      </div>
    </section>
  )
}
