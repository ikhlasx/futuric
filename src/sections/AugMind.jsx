import { useEffect, useState } from 'react'
import { Morph } from 'cube-motion/react'
import { CloudShader } from '@/components/ui/cloud-shader'
import { augmindThoughts as thoughts } from '../lib/content'

// AugMind opens straight into drifting clouds: the brain narrates what it is doing, and opens /augmind.
export default function AugMind() {
  const [n, setN] = useState(0)
  const [flip, setFlip] = useState(false)
  const [faces, setFaces] = useState([thoughts[0].text, thoughts[0].text])

  // The thought changes every few seconds even with reduced motion: it is content, not travel.
  useEffect(() => {
    const id = setInterval(() => {
      setN((prev) => {
        const next = (prev + 1) % thoughts.length
        setFlip((f) => {
          setFaces((fc) => (f ? [thoughts[next].text, fc[1]] : [fc[0], thoughts[next].text]))
          return !f
        })
        return next
      })
    }, 2800)
    return () => clearInterval(id)
  }, [])

  const t = thoughts[n]

  return (
    <section className="augmind" id="augmind" data-theme="dark" aria-labelledby="aug-h">
      <h2 className="sr-only" id="aug-h">AugMind: secure intelligence for complex environments</h2>
      {/* ghost.ai's sky: deep blue, clouds soft-focused behind a heavy grain so the brain stays sharp. */}
      <CloudShader className="lab-sky soft-sky" speed={2.2} skyTopColor="#07578c" skyBottomColor="#4e84b0" cloudColor="#eceeee">
        <div className="mind">
          <p className="thought" data-state={t.state} aria-live="polite">
            <span className="who"><i aria-hidden="true" />{t.state}</span>
            <Morph className="thought-text" active={flip} off={faces[0]} on={faces[1]} />
          </p>
          <a className="brain-link" href="/augmind" aria-label="Open AugMind: secure intelligence for complex environments">
            <img src="/img/augmind-brain.webp" width="640" height="556" alt="" />
            <span className="open">Open AugMind <span aria-hidden="true">→</span></span>
          </a>
        </div>
      </CloudShader>
      <div className="sky-grain" aria-hidden="true" />
    </section>
  )
}
