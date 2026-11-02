import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion } from '../lib/motion'
import { ventures } from '../lib/content'

const v = ventures[3]
// Each hotspot sits on the part of the room it controls (percent of the section).
const spots = [
  { id: 'Lighting', x: '62%', y: '11%' },
  { id: 'Climate', x: '76%', y: '32%' },
  { id: 'Entertainment', x: '58%', y: '66%' },
  { id: 'Security', x: '92%', y: '56%' },
]
const systems = ['Lighting', 'Climate', 'Security', 'Entertainment', 'Automation']

// ghost.ai's kitchen with hotspots, as a HardRock living room whose lights come on as you arrive.
export default function HardRock() {
  const root = useRef(null)
  const [on, setOn] = useState(new Set(['Lighting', 'Climate', 'Security', 'Automation']))

  useGSAP(() => {
    if (reducedMotion()) { gsap.set('.hardrock .dim', { opacity: 0.25 }); return }
    const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', end: 'bottom bottom', scrub: 0.6 } })
    tl.fromTo('.hardrock .dim', { opacity: 0.85 }, { opacity: 0.25, ease: 'none' }, 0)
      .from('.hotspot', { y: 20, opacity: 0, stagger: 0.15, ease: 'power2.out' }, 0.2)
    // The room drifts and settles toward the window as the section passes.
    gsap.fromTo('.room picture', { scale: 1.12, xPercent: -2 }, {
      scale: 1, xPercent: 0, ease: 'none',
      scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: true },
    })
  }, { scope: root })

  const toggle = (id) => setOn((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <section
      className="hardrock dark"
      id="hardrock"
      data-theme="dark"
      data-lights={on.has('Lighting') ? 'on' : 'off'}
      ref={root}
      aria-labelledby="hr-h"
    >
      {/* Higgsfield still: dusk living room, cove lights, windows over a river city. */}
      <figure className="room" data-slot="hardrock-room">
        <picture>
          <source type="image/webp" srcSet="/img/hardrock-living-800.webp 800w, /img/hardrock-living-1344.webp 1344w" sizes="100vw" />
          <img
            src="/img/hardrock-living-1344.jpg"
            width="1344"
            height="752"
            loading="lazy"
            alt="A dark living room at dusk with warm cove lighting and tall windows over a river city skyline."
          />
        </picture>
      </figure>
      <div className="dim" />

      <div className="copy">
        <h2 className="h2" id="hr-h">{v.line}</h2>
        <p className="lede">HardRock: {v.body.charAt(0).toLowerCase() + v.body.slice(1)}</p>
      </div>

      {spots.map((s) => (
        <button key={s.id} className="hotspot" style={{ left: `min(${s.x}, calc(100% - 150px))`, top: s.y }} aria-pressed={on.has(s.id)} onClick={() => toggle(s.id)}>
          <span className="pip" aria-hidden="true" />{s.id}
        </button>
      ))}

      <div className="systems" aria-label="HardRock systems">
        {systems.map((s) => <span key={s} className={on.has(s) ? 'on' : ''}>{s}</span>)}
      </div>
    </section>
  )
}
