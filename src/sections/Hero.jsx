import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion, scrollToId } from '../lib/motion'

const RobotHero = lazy(() => import('@/components/ui/robot-hero'))

// If WebGL is unavailable, the hero keeps its wordmark and copy without the robot.
class Fallback extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

// ghost.ai's dark hero with airform's giant wordmark; the Futuric robot stands in front and
// follows the cursor with its body and head.
export default function Hero() {
  const root = useRef(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting))
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  useGSAP(() => {
    if (reducedMotion()) return
    // The intro rise is CSS (see .hero .rise); scrolling away lifts the wordmark and the horizon.
    gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: 1 } })
      .fromTo('.hero .wordmark-wrap', { opacity: 1, y: 0 }, { opacity: 0, y: -60, ease: 'none', immediateRender: false }, 0)
      .to('.hero .horizon', { yPercent: -8, ease: 'none' }, 0)
  }, { scope: root })

  return (
    <section className="hero dark" id="top" data-theme="dark" ref={root} aria-labelledby="hero-h">
      <div className="wordmark-wrap" aria-hidden="true"><span className="logo wordmark rise" /></div>
      <div className="horizon" aria-hidden="true" />
      <div className="canvas rise" style={{ '--d': '0.15s' }} aria-hidden="true">
        <Fallback>
          <Suspense fallback={null}>
            <RobotHero active={inView} reduced={reducedMotion()} />
          </Suspense>
        </Fallback>
      </div>

      <div className="copy">
        <h1 id="hero-h" className="rise" style={{ '--d': '0.35s' }}>Building what comes next.<span>One group. Five ventures.</span></h1>
        <div className="actions rise" style={{ '--d': '0.5s' }}>
          <a className="btn" href="#connect" onClick={(e) => { e.preventDefault(); scrollToId('connect') }}>
            Explore ventures <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a className="btn ghost" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact') }}>
            Build with us
          </a>
        </div>
      </div>
    </section>
  )
}
