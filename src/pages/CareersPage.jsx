import { useEffect } from 'react'
import { Reveal } from 'cube-motion/react'
import { initSmoothScroll } from '../lib/motion'
import { useActiveSection } from '../lib/useActiveSection'
import { contact, roles } from '../lib/content'
import Nav from '../sections/Nav'
import Footer from '../sections/Footer'

const themeOf = (el) => el.dataset.theme
const teams = ['Engineering', 'AI & data', 'Industrial automation', 'Design', 'Operations']

// Careers: the open roles from lib/content.js (`roles`), or a stay-tuned note while there are none.
export default function CareersPage() {
  const navTheme = useActiveSection('main [data-theme], footer', 40, themeOf) ?? 'light'

  useEffect(() => {
    document.title = 'Careers — Futuric'
    return initSmoothScroll()
  }, [])

  const apply = (title) => `mailto:${contact.email}?subject=${encodeURIComponent(title ? `Application: ${title}` : 'Careers at Futuric')}`

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <div className="signal-bar">
        <a href="/">← Back to Futuric</a>
      </div>
      <Nav theme={navTheme} />

      <main id="main">
        <section className="cr-page ghost-ground" data-theme="light" aria-labelledby="cr-h">
          <div className="connect-grid" aria-hidden="true" />

          <Reveal targets="children" className="cr-head">
            <p className="ab-kicker">Careers</p>
            <h1 className="display" id="cr-h">Build what comes next, with us.</h1>
            <p className="lede">We are growing a team of engineers, AI architects, designers and operators in Perth and across the Gulf.</p>
          </Reveal>

          <div className="cr-board" aria-labelledby="cr-open">
            <div className="cr-board-head">
              <h2 className="h3" id="cr-open">Open roles</h2>
              <span className="cr-count">{roles.length ? `${roles.length} open` : 'None right now'}</span>
            </div>

            {roles.length ? (
              <ul className="cr-roles">
                {roles.map((r) => (
                  <li key={r.title}>
                    <div>
                      <h3>{r.title}</h3>
                      <p>{[r.team, r.location, r.type].filter(Boolean).join(' · ')}</p>
                    </div>
                    <a className="btn ink" href={apply(r.title)}>Apply <span className="arrow" aria-hidden="true">→</span></a>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="cr-empty">
                <span className="cr-pulse" aria-hidden="true" />
                <div>
                  <h3>No open roles at the moment. Stay tuned.</h3>
                  <p>New positions will be listed here as the team grows. If you would like to be first in line, send us your work and tell us what you want to build.</p>
                </div>
              </div>
            )}

            <ul className="cr-teams" aria-label="Teams we hire for">
              {teams.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </div>

          <div className="cr-send">
            <div>
              <h2 className="h3">Don’t see your role?</h2>
              <p>Send your CV or portfolio to {contact.email}. We read every one.</p>
            </div>
            <a className="btn" href={apply()}>Send your work <span className="arrow" aria-hidden="true">→</span></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
