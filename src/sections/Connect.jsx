import { useEffect, useState } from 'react'
import { Morph } from 'cube-motion/react'

// Each tab: one Futuric venture's world, four things it connects. Images are quadrants of one
// Higgsfield sheet per tab (public/img/connect-<tab>-<n>.webp).
const tabs = [
  {
    id: 'industry', label: 'Industry', venture: 'NEXA',
    line: 'Connects the machines, sensors and controllers on your factory floor.',
    items: ['Robot cells', 'AMR fleets', 'Line sensors', 'Controllers'],
  },
  {
    id: 'intelligence', label: 'Intelligence', venture: 'AugMind',
    line: 'Reads your documents, data and systems, and keeps them private.',
    items: ['Documents', 'Data stores', 'Access control', 'Voice notes'],
  },
  {
    id: 'living', label: 'Living', venture: 'HardRock',
    line: 'Runs the climate, light, locks and sound of the home as one system.',
    items: ['Climate', 'Lighting', 'Security', 'Audio'],
  },
  {
    id: 'mobility', label: 'Mobility', venture: 'Oryx Visa',
    line: 'Moves people and their paperwork from Perth to the Gulf and back.',
    items: ['Travel documents', 'Relocation', 'Flights', 'Baggage'],
  },
]

const TURN = 2000 // ms each world stays up

// Where the four objects sit around the Core, ghost.ai style (percent of the stage).
const spots = [
  { x: 14, y: 30 },
  { x: 86, y: 26 },
  { x: 24, y: 72 },
  { x: 80, y: 68 },
]

// ghost.ai's tabbed grid page: the Core in the middle, the things each venture connects around it.
export default function Connect() {
  const [active, setActive] = useState(0)
  const [flip, setFlip] = useState(false)
  const [faces, setFaces] = useState([tabs[0].line, tabs[0].line])
  const tab = tabs[active]

  function choose(i) {
    if (i === active) return
    setFaces((f) => (flip ? [tabs[i].line, f[1]] : [f[0], tabs[i].line]))
    setFlip((x) => !x)
    setActive(i)
  }

  // Industry → Intelligence → Living → Mobility, on a loop.
  useEffect(() => {
    const id = setTimeout(() => choose((active + 1) % tabs.length), TURN)
    return () => clearTimeout(id)
  })

  return (
    <section className="connect" id="connect" data-theme="light" aria-labelledby="connect-h">
      <div className="connect-grid" aria-hidden="true" />

      <h2 className="h2" id="connect-h">Everything we connect.</h2>

      <div className="connect-tabs" role="tablist" aria-label="Futuric worlds">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            role="tab"
            id={`tab-${t.id}`}
            aria-selected={i === active}
            aria-controls="connect-panel"
            onClick={() => choose(i)}
          >
            <i aria-hidden="true" />{t.label}
          </button>
        ))}
      </div>

      <div className="connect-stage" id="connect-panel" role="tabpanel" aria-labelledby={`tab-${tab.id}`}>
        <div className="connect-core" aria-hidden="true">
          <span className="logo" />
        </div>
        {tab.items.map((name, n) => (
          <figure key={`${tab.id}-${n}`} className="connect-item" style={{ left: `${spots[n].x}%`, top: `${spots[n].y}%`, '--d': `${n * 70}ms` }}>
            <img src={`/img/connect-${tab.id}-${n}.webp`} width="420" height="420" alt="" loading="lazy" />
            <figcaption><i aria-hidden="true" />{name}</figcaption>
          </figure>
        ))}
      </div>

      <p className="connect-line">
        <strong>{tab.venture}.</strong> <Morph active={flip} off={faces[0]} on={faces[1]} />
      </p>
    </section>
  )
}
