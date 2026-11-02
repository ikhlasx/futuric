import { useEffect, useState } from 'react'
import { Reveal } from 'cube-motion/react'
import { initSmoothScroll } from '../lib/motion'
import { useActiveSection } from '../lib/useActiveSection'
import { ventures, contact } from '../lib/content'
import Nav from '../sections/Nav'
import Footer from '../sections/Footer'

const themeOf = (el) => el.dataset.theme
const topics = [...ventures.map((v) => v.name), 'Something else']

// "Build with us": every way to reach Futuric, on the same grid paper as the home page.
// The note composer only builds a mailto: link; nothing is sent from the page itself.
export default function ContactPage() {
  const navTheme = useActiveSection('main [data-theme], footer', 40, themeOf) ?? 'light'
  const [topic, setTopic] = useState(topics[0])
  const [name, setName] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    document.title = 'Build with us — Futuric'
    return initSmoothScroll()
  }, [])

  const subject = `Building with Futuric: ${topic}`
  const body = [note.trim(), name.trim() && `— ${name.trim()}`].filter(Boolean).join('\n\n')
  const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}${body ? `&body=${encodeURIComponent(body)}` : ''}`

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <div className="signal-bar">
        <a href="/">← Back to Futuric</a>
      </div>
      <Nav theme={navTheme} />

      <main id="main">
        <section className="contact-page ghost-ground" data-theme="light" aria-labelledby="contact-h">
          <div className="connect-grid" aria-hidden="true" />

          <Reveal targets="children" className="contact-head">
            <h1 className="display" id="contact-h">Build with us.</h1>
            <p className="lede">Our engineers and AI architects are ready to help you scale. Tell us what you want to build.</p>
          </Reveal>

          <div className="contact-body">
            <form className="contact-compose" onSubmit={(e) => { e.preventDefault(); window.location.href = mailto }}>
              <fieldset>
                <legend>What do you want to build?</legend>
                <div className="contact-topics">
                  {topics.map((t) => (
                    <label key={t} className={t === topic ? 'on' : ''}>
                      <input type="radio" name="topic" value={t} checked={t === topic} onChange={() => setTopic(t)} />
                      {t}
                    </label>
                  ))}
                </div>
              </fieldset>
              <label className="contact-field">
                <span>Your name</span>
                <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
              </label>
              <label className="contact-field">
                <span>A few lines about the project</span>
                <textarea rows={5} value={note} onChange={(e) => setNote(e.target.value)} />
              </label>
              <div className="contact-send">
                <button className="btn" type="submit">
                  Write the email <span className="arrow" aria-hidden="true">→</span>
                </button>
                <p className="note">Opens your email app, addressed to {contact.email}.</p>
              </div>
            </form>

            <aside className="contact-cards" aria-label="Contact details">
              <a className="contact-card" href={`mailto:${contact.email}?subject=${encodeURIComponent('Building with Futuric')}`}>
                <span className="k">Email</span>
                <strong>{contact.email}</strong>
              </a>
              <a className="contact-card" href={contact.phoneHref}>
                <span className="k">Phone</span>
                <strong>{contact.phone}</strong>
              </a>
              <div className="contact-card">
                <span className="k">Head office</span>
                <strong>{contact.city}</strong>
              </div>
              <div className="contact-card">
                <span className="k">Global coverage</span>
                <ul>{contact.regions.map((r) => <li key={r}>{r}</li>)}</ul>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
