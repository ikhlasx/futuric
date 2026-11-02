import { Reveal } from 'cube-motion/react'
import { ventures } from '../lib/content'

const v = ventures[2]

// Forma on the home page: one product shot (a Control Center for factory operations) on the same
// grid paper as About, Connect and NEXA. The full showcase lives on /forma.
export default function Forma() {
  return (
    <section className="forma ghost-ground" id="forma" data-theme="light" aria-labelledby="forma-h">
      <div className="connect-grid" aria-hidden="true" />
      <Reveal targets="children" className="head">
        <h2 className="h2" id="forma-h">{v.name}</h2>
        <p className="lede">{v.line}</p>
      </Reveal>
      <figure className="forma-shot">
        <img
          src="/img/forma-control-center.webp"
          width="1600"
          height="900"
          loading="lazy"
          alt="A Forma-built Control Center: an assistant chat beside isometric tiles for procurement, sales, production, quality control and fulfilment."
        />
      </figure>
      <a className="btn ink" href="/forma">
        Explore Forma <span className="arrow" aria-hidden="true">→</span>
      </a>
    </section>
  )
}
