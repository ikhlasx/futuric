import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

// Honour the OS setting, but let `?motion` force the full experience for previews.
export const reducedMotion = () =>
  !new URLSearchParams(window.location.search).has('motion') &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

let lenis = null

// Lenis drives the scroll; GSAP's ticker drives Lenis so ScrollTrigger stays in sync.
export function initSmoothScroll() {
  if (reducedMotion()) return () => {}
  lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
  lenis.on('scroll', ScrollTrigger.update)
  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)
  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    lenis = null
  }
}

export function scrollToId(id) {
  const el = document.getElementById(id)
  // On another page (e.g. /augmind) the section lives on the home page.
  if (!el) {
    if (window.location.pathname !== '/') window.location.href = `/#${id}`
    return
  }
  if (lenis) lenis.scrollTo(el, { duration: 1.6 })
  else el.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth' })
}

export { gsap, ScrollTrigger }
