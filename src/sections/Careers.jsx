import { Reveal } from 'cube-motion/react'
import { contact } from '../lib/content'

// Drafted from futuric.com.au; the client confirms wording before launch.
const faqs = [
  {
    q: 'What is Futuric?',
    a: 'Futuric is a parent group headquartered in Perth, Western Australia. It builds intelligent industrial ecosystems and runs five ventures: NEXA, AugMind, Forma, HardRock and Oryx Visa.',
  },
  {
    q: 'Is NEXA available today?',
    a: 'Yes. NEXA, our smart factory transformation platform, is fully operational: industrial AI, IoT, robotics and connected operations. Visit nexafuturic.com.',
  },
  {
    q: 'Where do you work?',
    a: `Our head office is in ${contact.city}. We work with clients across ${contact.regions.slice(0, -1).join(', ')} and ${contact.regions.at(-1)}.`,
  },
  {
    q: 'Can Forma build our product?',
    a: 'Forma builds enterprise platforms, intelligent software and connected IoT products. Send us a short note about what you need and we will reply with next steps.',
  },
  {
    q: 'How do I reach the team?',
    a: `Email ${contact.email} or call ${contact.phone}.`,
  },
]

export default function Careers() {
  return (
    <section className="careers light" id="careers" data-theme="light" aria-labelledby="careers-h">
      <Reveal targets="children" className="join">
        <h2 className="h2" id="careers-h">Build it with us.</h2>
        <p className="lede">
          We are growing our team of engineers, AI architects and designers in Perth and across the Gulf.
        </p>
        <div>
          <a className="btn ink" href={`mailto:${contact.email}?subject=Careers%20at%20Futuric`}>
            Send your work <span className="arrow" aria-hidden="true">→</span>
          </a>
        </div>
      </Reveal>

      <div className="faq" id="faq">
        <h2 className="h3">Questions, answered.</h2>
        <Reveal targets="children" className="list">
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}<span className="mark" aria-hidden="true" /></summary>
              <p>{f.a}</p>
            </details>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
