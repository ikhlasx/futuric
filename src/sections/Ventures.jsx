import { useRef } from 'react'
import { Reveal } from 'cube-motion/react'
import { ventures } from '../lib/content'
import { scrollToId } from '../lib/motion'

const pics = {
  nexa: { src: '/img/nexa-factory-880', w: 880, h: 1168, alt: 'A person at the open door of a NEXA smart factory.' },
  augmind: { src: '/img/augmind-lab-1344', w: 1344, h: 752, alt: 'The AugMind lab floating in a blue sky.' },
  hardrock: { src: '/img/hardrock-living-1344', w: 1344, h: 752, alt: 'A HardRock living room at dusk over a river city.' },
  oryx: { src: '/img/oryx-gate-1344', w: 1344, h: 752, alt: 'A traveller at a dawn departure gate.' },
}

const points = [
  { h: ['Engineered in Perth.', 'Deployed worldwide.'], p: 'One engineering office oversees industrial intelligence, robotics and software for every venture.' },
  { h: ['Built to run,', 'not to demo.'], p: 'NEXA is fully operational on factory floors today. Every venture is held to the same standard.' },
  { h: ['Five countries.', 'One team.'], p: 'Australia, UAE, Qatar, KSA and India, served from one group with one point of contact.' },
]

// Forma has no photograph: its card shows a crop of the product UI it builds.
function FormaFace() {
  const bars = [152, 168, 171, 160, 149, 163, 158, 163]
  return (
    <div className="forma-face" data-ui aria-hidden="true">
      <span className="t">Line 3 output, this shift</span>
      <span className="big">1,284<small> / 1,400 units</small></span>
      <span className="bars">{bars.map((b, i) => <i key={i} style={{ height: `${(b / 171) * 100}%` }} />)}</span>
    </div>
  )
}

// airform's "One system, two parts." carousel, as Futuric's one group and five ventures.
export default function Ventures() {
  const rail = useRef(null)
  const drag = useRef({ down: false, x: 0, left: 0, moved: false })

  const onDown = (e) => {
    drag.current = { down: true, x: e.clientX, left: rail.current.scrollLeft, moved: false }
  }
  const onMove = (e) => {
    const d = drag.current
    if (!d.down || e.pointerType !== 'mouse') return
    const dx = e.clientX - d.x
    if (Math.abs(dx) > 4) d.moved = true
    rail.current.scrollLeft = d.left - dx
  }
  const onUp = () => { drag.current.down = false }
  // A drag must not count as a click on the card underneath.
  const open = (id) => (e) => {
    if (drag.current.moved) { e.preventDefault(); return }
    e.preventDefault()
    scrollToId(id)
  }

  return (
    <section className="parts light" id="ventures" data-theme="light" aria-labelledby="parts-h">
      <Reveal targets="children" className="head">
        <h2 className="h2" id="parts-h">One group. Five parts.</h2>
        <p>A factory that runs itself, an intelligence you can trust, software that ships, a home that listens and a route to anywhere. Built by one team in Perth.</p>
      </Reveal>

      <div
        className="cards"
        ref={rail}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        aria-label="Futuric ventures"
      >
        {ventures.map((v) => {
          const pic = pics[v.id]
          return (
            <a key={v.id} className={`card${pic ? '' : ' ui'}`} href={`#${v.id}`} onClick={open(v.id)} draggable="false">
              {pic ? (
                <picture>
                  <source type="image/webp" srcSet={`${pic.src}.webp`} />
                  <img src={`${pic.src}.jpg`} width={pic.w} height={pic.h} alt={pic.alt} loading="lazy" draggable="false" />
                </picture>
              ) : <FormaFace />}
              <span className="lab">{v.name} · {v.field}</span>
            </a>
          )
        })}
      </div>
      <p className="hint">Scroll or drag to view more</p>

      <Reveal targets="children" className="points">
        {points.map((pt, i) => (
          <div key={pt.h[0]}>
            {/* airform's light numerals, requested by the client. taste-skill-ignore */}
            <span className="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
            <h3>{pt.h[0]}<br />{pt.h[1]}</h3>
            <p>{pt.p}</p>
          </div>
        ))}
      </Reveal>
    </section>
  )
}
