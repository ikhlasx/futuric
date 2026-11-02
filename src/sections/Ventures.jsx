import { useState } from 'react'
import { Reveal, Morph } from 'cube-motion/react'
import { ventures } from '../lib/content'

// Counter requested by the client (ghost.ai's 01 / 04). taste-skill-ignore
const pad = (n) => String(n).padStart(2, '0')

// ghost.ai's gallery slider, carrying the five ventures.
export default function Ventures() {
  const [i, setI] = useState(0)
  const [flip, setFlip] = useState(false)
  const [faces, setFaces] = useState([pad(1), pad(1)])

  function to(next) {
    // Morph needs two faces: write the new number into the hidden one, then flip.
    setFaces((f) => (flip ? [pad(next + 1), f[1]] : [f[0], pad(next + 1)]))
    setFlip((x) => !x)
    setI(next)
  }

  return (
    <section className="ventures light" id="about" data-theme="light" aria-labelledby="ventures-h">
      <Reveal targets="children" className="intro">
        <h2 className="h2" id="ventures-h">One group. Five ventures.</h2>
        <p className="lede">
          From the factory floor to the front door, Futuric builds the systems that run what comes next.
        </p>
        <p className="note">Parent group headquarters in Perth, overseeing industrial intelligence, robotics and software engineering.</p>
      </Reveal>

      <div className="slider" aria-roledescription="carousel" aria-label="Futuric ventures">
        <div className="viewport">
          <div className="track" style={{ transform: `translateX(-${i * 100}%)` }}>
            {ventures.map((v, n) => (
              <article className="slide" data-v={v.id} key={v.id} aria-hidden={n !== i} aria-label={`${n + 1} of ${ventures.length}`}>
                <h3 className="name">{v.name}</h3>
                <p className="what">{v.field}. {v.line}</p>
              </article>
            ))}
          </div>
        </div>
        <div className="controls">
          <span className="count" aria-live="polite">
            <Morph active={flip} off={faces[0]} on={faces[1]} /> / {pad(ventures.length)}
          </span>
          <div className="arrows">
            <button aria-label="Previous venture" disabled={i === 0} onClick={() => to(i - 1)}>←</button>
            <button aria-label="Next venture" disabled={i === ventures.length - 1} onClick={() => to(i + 1)}>→</button>
          </div>
        </div>
      </div>
    </section>
  )
}
