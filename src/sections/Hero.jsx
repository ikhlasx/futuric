import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion, scrollToId } from '../lib/motion'

const CoreScene = lazy(() => import('../three/CoreScene'))

// If WebGL is unavailable, keep the still Core instead of a blank hero.
class Fallback extends Component {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? this.props.still : this.props.children }
}

// ghost.ai's dark hero with airform's giant wordmark: the Futuric Core splits into the five ventures.
export default function Hero() {
  const root = useRef(null)
  const track = useRef(null)
  const progress = useRef(0)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting))
    io.observe(root.current)
    return () => io.disconnect()
  }, [])

  useGSAP(() => {
    if (reducedMotion()) { progress.current = 1; return }
    // The intro rise is CSS (see .hero .rise). The hero holds with CSS sticky inside a tall
    // track rather than a GSAP pin, so the NEXA pin further down measures the page correctly.
    track.current.classList.add('hold')
    gsap.timeline({
      scrollTrigger: {
        trigger: track.current, start: 'top top', end: 'bottom bottom', scrub: 1,
        onUpdate: (s) => { progress.current = s.progress },
      },
    })
      .fromTo('.hero .wordmark-wrap', { opacity: 1, y: 0 }, { opacity: 0, y: -50, ease: 'none', duration: 0.4, immediateRender: false }, 0.3)
      .to('.hero .horizon', { yPercent: -6, ease: 'none', duration: 1 }, 0)
  }, { scope: root })

  const still = <div className="core-still" aria-hidden="true" />

  return (
    <div className="hero-track" id="top" ref={track}>
    <section className="hero dark" data-theme="dark" ref={root} aria-labelledby="hero-h">
      <div className="wordmark-wrap" aria-hidden="true"><span className="logo wordmark rise" /></div>
      <div className="horizon" aria-hidden="true" />
      <div className="canvas" aria-hidden="true">
        <Fallback still={still}>
          <Suspense fallback={still}>
            <CoreScene progress={progress} active={inView} />
          </Suspense>
        </Fallback>
      </div>

      <div className="copy">
        <h1 id="hero-h" className="rise" style={{ '--d': '0.35s' }}>Building what comes next.<span>One group. Five ventures.</span></h1>
        <div className="actions rise" style={{ '--d': '0.5s' }}>
          <a className="btn" href="#ventures" onClick={(e) => { e.preventDefault(); scrollToId('ventures') }}>
            Explore ventures <span className="arrow" aria-hidden="true">→</span>
          </a>
          <a className="btn ghost" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact') }}>
            Build with us
          </a>
        </div>
      </div>
    </section>
    </div>
  )
}
