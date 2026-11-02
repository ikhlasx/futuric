import { Component, lazy, Suspense, useEffect, useState } from 'react'
import { Reveal } from 'cube-motion/react'
import { ventures } from '../lib/content'

const v = ventures[3]
const SmartHome3D = lazy(() => import('@/components/ui/smart-home-3d'))
// The order the arrival plays: the door opens, the lights come on, the music starts, the AC runs.
const systems = ['Security', 'Lighting', 'Entertainment', 'Climate']
const WIDE = '(min-width: 961px)'

// If WebGL or the chunk fails, the section keeps its copy and the living-room photograph.
class Fallback extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.still : this.props.children }
}

function useWide() {
  const [wide, setWide] = useState(() => window.matchMedia(WIDE).matches)
  useEffect(() => {
    const mq = window.matchMedia(WIDE)
    const on = () => setWide(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return wide
}

// HardRock as one machine you can spin: four systems on one line, playing an arrival in order.
export default function HardRock() {
  const [active, setActive] = useState(0)
  const [jump, setJump] = useState(0)
  const wide = useWide()

  // A tab or a module in the scene restarts the arrival from that system.
  const pick = (i) => {
    setActive(i)
    setJump((n) => n + 1)
  }

  const still = (
    <img className="hr-still" src="/img/hardrock-living-1344.webp" width="1344" height="752" loading="lazy" alt="A HardRock living room at dusk with warm cove lighting." />
  )

  return (
    <section className="hardrock ghost-ground" id="hardrock" data-theme="light" aria-labelledby="hr-h">
      <div className="connect-grid" aria-hidden="true" />
      <div className="hr-stage">
        <Fallback still={still}>
          <Suspense fallback={null}>
            <SmartHome3D active={active} jump={jump} onStep={setActive} onPick={pick} wide={wide} />
          </Suspense>
        </Fallback>
      </div>

      <Reveal targets="children" className="copy">
        <h2 className="h2" id="hr-h">{v.line}</h2>
        <p className="lede">HardRock: {v.body.charAt(0).toLowerCase() + v.body.slice(1)}</p>
      </Reveal>

      <div className="systems" role="tablist" aria-label="HardRock systems, in the order they come on">
        {systems.map((s, i) => (
          <button key={s} role="tab" aria-selected={i === active} className={i === active ? 'on' : ''} onClick={() => pick(i)}>
            <i aria-hidden="true" />{s}
          </button>
        ))}
      </div>
      <p className="hr-hint" aria-hidden="true">Drag to turn the house</p>
    </section>
  )
}
