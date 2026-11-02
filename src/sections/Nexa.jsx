import { Component, lazy, Suspense, useEffect, useState } from 'react'
import { Reveal } from 'cube-motion/react'
import { ventures } from '../lib/content'

const nexa = ventures[0]
const NexaFactory = lazy(() => import('@/components/ui/nexa-factory'))

// One tab per agent, in the order the hub works through them.
const agents = ['Stock', 'Pick', 'Vision', 'Dispatch', 'Plan']
const WIDE = '(min-width: 961px)'

// If the figure fails to load, the section keeps its copy and the factory photograph.
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

// NEXA as one blueprint frame: the copy sits on the factory floor's open side,
// and the agent tabs run along the frame's foot, lit by whichever task the hub is on.
export default function Nexa() {
  const [step, setStep] = useState(0)
  const wide = useWide()

  const still = (
    <img className="nexa-still" src="/img/nexa-factory-880.webp" width="880" height="1168" alt="A person at the open door of a NEXA smart factory." />
  )
  const tabs = (
    <ol className="steps" aria-label="What the NEXA agents are doing">
      {agents.map((name, i) => (
        <li key={name} className={i === step ? 'on' : ''} aria-current={i === step ? 'step' : undefined}>{name}</li>
      ))}
    </ol>
  )

  return (
    <section className="nexa ghost-ground" id="nexa" data-theme="light" aria-labelledby="nexa-h">
      <div className="connect-grid" aria-hidden="true" />
      <div className="nexa-frame">
        <Reveal targets="children" className="copy">
          <h2 className="h2" id="nexa-h">{nexa.line}</h2>
          <p className="lede">Industrial AI and robotics, running on factory floors today.</p>
          <div>
            <a className="btn ink" href={nexa.href} target="_blank" rel="noreferrer">
              Visit nexafuturic.com <span className="arrow" aria-hidden="true">→</span>
            </a>
          </div>
        </Reveal>

        <div className="nexa-figure">
          <Fallback still={still}>
            <Suspense fallback={null}>
              <NexaFactory onStep={setStep} wide={wide} hint={tabs} />
            </Suspense>
          </Fallback>
        </div>
      </div>
    </section>
  )
}
