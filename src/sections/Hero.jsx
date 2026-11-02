import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, reducedMotion, scrollToId } from '../lib/motion'

const headline = ['Building', 'what', 'comes', 'next.']

export default function Hero() {
  const root = useRef(null)

  useGSAP(() => {
    if (reducedMotion()) return
    gsap.from('.word > span', {
      yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: 0.08, delay: 0.15,
      // Masks are only needed while the words rise; drop them so nothing stays clipped.
      onComplete: () => gsap.set('.hero h1 .word', { overflow: 'visible' }),
    })
    gsap.from('.hero .rest > *', { y: 24, opacity: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, delay: 0.55 })
    // The frame opens upward while the picture settles from a slow push-in.
    gsap.from('.hero .stage', { clipPath: 'inset(100% 0 0 0)', duration: 1.4, ease: 'expo.inOut', delay: 0.1 })
    gsap.from('.hero .stage img', { scale: 1.18, duration: 2.4, ease: 'expo.out', delay: 0.1 })
    // Parallax: the picture drifts inside its frame as the hero scrolls away.
    gsap.to('.hero .stage picture', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
  }, { scope: root })

  return (
    <section className="hero light" id="top" data-theme="light" ref={root}>
      <div className="copy">
        <h1 className="display" aria-label="Building what comes next.">
          {headline.map((w, i) => (
            <span className="word" key={i} aria-hidden="true">
              <span>{w}</span>{i < headline.length - 1 ? ' ' : ''}
            </span>
          ))}
        </h1>
        <div className="rest" style={{ display: 'grid', gap: 32 }}>
          <p className="lede">
            Futuric drives intelligent industrial ecosystems and high-performance ventures across Australia and the world.
          </p>
          <div className="actions">
            <a className="btn" href="#nexa" onClick={(e) => { e.preventDefault(); scrollToId('nexa') }}>
              Explore NEXA <span className="arrow" aria-hidden="true">→</span>
            </a>
            <a className="btn quiet" href="#contact" onClick={(e) => { e.preventDefault(); scrollToId('contact') }}>
              Let's build something intelligent
            </a>
          </div>
        </div>
      </div>

      {/* Higgsfield still: a person walking toward a monolith with a blue-lit doorway. */}
      <figure className="stage" data-slot="hero-object">
        <picture>
          <source type="image/webp" srcSet="/img/hero-portal-640.webp 640w, /img/hero-portal-880.webp 880w" sizes="(max-width: 960px) 100vw, 36vw" />
          <img
            src="/img/hero-portal-880.jpg"
            width="880"
            height="1168"
            alt="A lone person walks across a pale stone plain toward a tall graphite monolith with a doorway glowing blue."
            fetchPriority="high"
          />
        </picture>
      </figure>
    </section>
  )
}
