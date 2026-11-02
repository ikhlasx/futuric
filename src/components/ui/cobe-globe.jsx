// CobeGlobe — a WebGL globe (cobe) with named markers and arcs, from the 21st.dev
// "cobe-globe-cdn" component, ported to plain JS for this Vite project.
// Labels ride CSS anchor positioning: cobe publishes an anchor per marker
// (--cobe-<id>) and a visibility var (--cobe-visible-<id>) so labels fade as they turn away.
// Changes from the original: Futuric's blue on a paper-white globe, a spinning-pyramid pin and a name per
// city (nudged left, right or up where cities crowd), no traffic readouts, and a gentle sway around the routes instead of a full spin.

import { useCallback, useEffect, useRef } from 'react'
import createGlobe from 'cobe'

const TAU = Math.PI * 2
// Point the globe at a longitude/latitude (cobe's own recipe).
const facing = ([lat, lon]) => [Math.PI - ((lon * Math.PI) / 180 - Math.PI / 2), (lat * Math.PI) / 180]

export default function CobeGlobe({ markers, arcs, focus = [0, 90], sway = 0.45, className = '' }) {
  const canvasRef = useRef(null)
  const drag = useRef(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const offset = useRef({ phi: 0, theta: 0 })

  const onPointerDown = useCallback((e) => {
    drag.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.style.cursor = 'grabbing'
  }, [])

  useEffect(() => {
    const move = (e) => {
      if (!drag.current) return
      dragOffset.current = { phi: (e.clientX - drag.current.x) / 300, theta: (e.clientY - drag.current.y) / 1000 }
    }
    const up = () => {
      if (!drag.current) return
      offset.current.phi += dragOffset.current.phi
      offset.current.theta += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
      drag.current = null
      if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
    }
    window.addEventListener('pointermove', move, { passive: true })
    window.addEventListener('pointerup', up, { passive: true })
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const [phi0, theta0] = facing(focus)
    let globe = null
    let raf = 0
    let ro = null
    let t = 0

    const init = () => {
      const width = canvas.offsetWidth
      if (!width || globe) return
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width, height: width,
        phi: phi0, theta: theta0,
        dark: 0, diffuse: 1.4,
        mapSamples: 16000, mapBrightness: 8,
        baseColor: [1, 1, 1],
        markerColor: [0.12, 0.39, 0.84],
        glowColor: [0.89, 0.89, 0.87],
        markerElevation: 0.02,
        markers: markers.map((m) => ({ location: m.location, size: m.size ?? 0.03, id: m.id })),
        arcs: arcs.map((a) => ({ from: a.from, to: a.to, id: a.id })),
        arcColor: [0.12, 0.39, 0.84],
        arcWidth: 0.6, arcHeight: 0.3, opacity: 0.85,
      })
      const frame = () => {
        if (!drag.current) t = (t + 0.0035) % TAU
        globe.update({
          phi: phi0 + Math.sin(t) * sway + offset.current.phi + dragOffset.current.phi,
          theta: theta0 + offset.current.theta + dragOffset.current.theta,
        })
        raf = requestAnimationFrame(frame)
      }
      frame()
      requestAnimationFrame(() => { canvas.style.opacity = '1' })
    }

    if (canvas.offsetWidth > 0) init()
    else {
      ro = new ResizeObserver(([e]) => { if (e.contentRect.width > 0) { ro.disconnect(); init() } })
      ro.observe(canvas)
    }
    return () => {
      ro?.disconnect()
      cancelAnimationFrame(raf)
      globe?.destroy()
    }
  }, [markers, arcs, focus, sway])

  return (
    <div className={`cobe-globe ${className}`}>
      <canvas ref={canvasRef} onPointerDown={onPointerDown} />
      {markers.map((m) => (
        <div
          key={m.id}
          className={`cobe-pin${m.home ? ' home' : ''}${m.side ? ` ${m.side}` : ''}`}
          style={{ positionAnchor: `--cobe-${m.id}`, '--seen': `var(--cobe-visible-${m.id}, 0)` }}
        >
          <span className="cobe-pyramid" aria-hidden="true">
            {[0, 1, 2, 3].map((n) => <i key={n} />)}
          </span>
          <span className="cobe-name">{m.name}</span>
        </div>
      ))}
    </div>
  )
}
