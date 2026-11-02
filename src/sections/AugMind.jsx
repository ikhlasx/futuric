import { useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { Morph, Reveal } from 'cube-motion/react'
import { gsap, reducedMotion } from '../lib/motion'
import { ventures } from '../lib/content'

const v = ventures[1]
const states = ['Idle', 'Listening', 'Thinking', 'Understanding', 'Responding']
const sources = ['Documents', 'Data', 'Workflows', 'Knowledge', 'Context']

// ghost.ai's room-in-the-clouds, as the AugMind lab. The brain cycles through its states.
export default function AugMind() {
  const root = useRef(null)
  const [n, setN] = useState(0)
  const [flip, setFlip] = useState(false)
  const [faces, setFaces] = useState([states[0], states[0]])
  const [picked, setPicked] = useState(new Set(['Documents', 'Data']))

  useEffect(() => {
    if (reducedMotion()) return
    const id = setInterval(() => {
      setN((prev) => {
        const next = (prev + 1) % states.length
        setFlip((f) => {
          setFaces((fc) => (f ? [states[next], fc[1]] : [fc[0], states[next]]))
          return !f
        })
        return next
      })
    }, 2200)
    return () => clearInterval(id)
  }, [])

  useGSAP(() => {
    if (reducedMotion()) return
    // The lab drifts up through the sky as the section passes, settling from a slight zoom.
    gsap.fromTo('.lab-field picture', { yPercent: -6, scale: 1.08 }, {
      yPercent: 6, scale: 1, ease: 'none',
      scrollTrigger: { trigger: '.lab-field', start: 'top bottom', end: 'bottom top', scrub: true },
    })
  }, { scope: root })

  // A picked source flies from its button into the brain in the picture.
  function send(button, label) {
    const target = root.current.querySelector('.brain-anchor')
    if (reducedMotion() || !target) return
    const from = button.getBoundingClientRect()
    const to = target.getBoundingClientRect()
    const chip = document.createElement('span')
    chip.className = 'flying-source'
    chip.textContent = label
    chip.setAttribute('aria-hidden', 'true')
    document.body.appendChild(chip)
    gsap.set(chip, { left: from.left, top: from.top })
    gsap.to(chip, {
      left: to.left - chip.offsetWidth / 2, top: to.top - chip.offsetHeight / 2,
      scale: 0.4, opacity: 0, duration: 1.1, ease: 'power3.in',
      onComplete: () => chip.remove(),
    })
  }

  function toggle(s, e) {
    if (!picked.has(s)) send(e.currentTarget, s)
    setPicked((p) => {
      const nx = new Set(p)
      nx.has(s) ? nx.delete(s) : nx.add(s)
      return nx
    })
  }

  return (
    <section className="augmind deep" id="augmind" data-theme="dark" ref={root} aria-labelledby="aug-h">
      <div className="top">
        <Reveal targets="children" style={{ display: 'grid', gap: 24 }}>
          <h2 className="h2" id="aug-h">Understand. Reason. Respond.</h2>
          <p className="lede">AugMind: {v.line.toLowerCase()} {v.body}</p>
        </Reveal>
        <Reveal targets="children" style={{ display: 'grid', gap: 16 }}>
          <p className="note">What should AugMind read?</p>
          <div className="pills">
            {sources.map((s) => (
              <button key={s} aria-pressed={picked.has(s)} onClick={(e) => toggle(s, e)}>{s}</button>
            ))}
          </div>
          <p className="note">
            Reading {picked.size ? [...picked].join(', ').toLowerCase() : 'nothing yet'}.
          </p>
        </Reveal>
      </div>

      {/* Higgsfield still: the AugMind lab floating in the clouds, brain on the desk. */}
      <figure className="lab-field" data-slot="augmind-lab" data-nav-over data-theme="light">
        <picture>
          <source type="image/webp" srcSet="/img/augmind-lab-800.webp 800w, /img/augmind-lab-1344.webp 1344w" sizes="100vw" />
          <img
            src="/img/augmind-lab-1344.jpg"
            width="1344"
            height="752"
            loading="lazy"
            alt="A graphite research lab floating in a blue sky, a white brain sculpture resting on its desk."
          />
        </picture>
        <span className="brain-anchor" aria-hidden="true" />
        <p className="state" data-state={states[n]} aria-live="polite">
          <span className="dot" aria-hidden="true" />
          <Morph active={flip} off={faces[0]} on={faces[1]} />
          <span className="sr-only" style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0 0 0 0)' }}>{states[n]}</span>
        </p>
      </figure>
    </section>
  )
}
