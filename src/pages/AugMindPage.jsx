import { useEffect, useState } from 'react'
import { Morph, Reveal } from 'cube-motion/react'
import { CloudShader } from '@/components/ui/cloud-shader'
import { initSmoothScroll } from '../lib/motion'
import { useActiveSection } from '../lib/useActiveSection'
import { ventures, augmindThoughts as thoughts, contact } from '../lib/content'
import Nav from '../sections/Nav'
import Footer from '../sections/Footer'

const v = ventures[1]

// Page copy is drafted from the Futuric brief; the client confirms it before launch.
const loop = [
  { h: 'Understand.', p: 'AugMind reads the material you connect, from manuals and contracts to sensor logs, and keeps track of what each source says.' },
  { h: 'Reason.', p: 'It connects facts across sources, checks them against each other and works out what actually happened.' },
  { h: 'Respond.', p: 'It answers in plain language, points to the sources it used and says when it is not sure.' },
]

const sources = [
  { name: 'Documents', what: 'Manuals, procedures, contracts and reports.' },
  { name: 'Data', what: 'Sensor readings, production figures and business systems.' },
  { name: 'Workflows', what: 'Tickets, approvals and the steps your teams follow.' },
  { name: 'Knowledge', what: 'What your experienced people know, written down once.' },
  { name: 'Context', what: 'Who is asking, for which site, and why it matters now.' },
]

const places = [
  { name: 'On the factory floor', with: 'With NEXA', p: 'Explains why a line slowed, which machine needs attention and what changed since the last shift.', href: '/#nexa' },
  { name: 'Across the business', with: 'With Forma', p: 'Answers questions over documents and dashboards that teams already use, inside the software Forma builds.', href: '/#forma' },
  { name: 'At home', with: 'With HardRock', p: 'Turns everyday requests into the right lighting, climate and security settings.', href: '/#hardrock' },
]

const faqs = [
  { q: 'What does AugMind read?', a: 'Only the sources you connect: documents, data, workflows, team knowledge and context. Nothing else.' },
  { q: 'How does it show where an answer came from?', a: 'Every answer lists the sources it used, so your team can open and check them.' },
  { q: 'Does it work with NEXA?', a: 'Yes. AugMind can read NEXA sensor and production data to explain what happened on the floor.' },
  { q: 'How do we start?', a: `Email ${contact.email} with the questions your team asks most often, and we will scope a first deployment.` },
]

const themeOf = (el) => el.dataset.theme

// The brain narrating one question: Listening → Thinking → Understanding → Responding.
function useThoughts() {
  const [n, setN] = useState(0)
  const [flip, setFlip] = useState(false)
  const [faces, setFaces] = useState([thoughts[0].text, thoughts[0].text])
  // The thought changes even with reduced motion: it is content, not travel.
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
  return { t: thoughts[n], flip, faces }
}

export default function AugMindPage() {
  const navTheme = useActiveSection('main [data-theme], footer', 40, themeOf) ?? 'light'
  const { t, flip, faces } = useThoughts()

  useEffect(() => {
    document.title = 'AugMind by Futuric — Secure intelligence for complex environments'
    return initSmoothScroll()
  }, [])

  return (
    <>
      <a className="skip" href="#main">Skip to content</a>
      <div className="grain" aria-hidden="true" />
      <div className="signal-bar">
        <a href="/">← Back to Futuric</a>
      </div>
      <Nav theme={navTheme} />

      <main id="main" className="am">
        <section className="am-hero" data-theme="dark" aria-labelledby="am-h">
          <CloudShader className="am-sky soft-sky" speed={2.2} skyTopColor="#07578c" skyBottomColor="#4e84b0" cloudColor="#eceeee">
            <div className="am-hero-in">
              <h1 id="am-h">AugMind<span>Secure intelligence for complex environments.</span></h1>
              <div className="mind">
                <p className="thought" data-state={t.state} aria-live="polite">
                  <span className="who"><i aria-hidden="true" />{t.state}</span>
                  <Morph className="thought-text" active={flip} off={faces[0]} on={faces[1]} />
                </p>
                <img className="am-brain" src="/img/augmind-brain.webp" width="640" height="556" alt="The AugMind brain, a white folded sculpture glowing softly blue." />
              </div>
              <div className="actions">
                <a className="btn" href={`mailto:${contact.email}?subject=AugMind`}>Talk to the AugMind team <span className="arrow" aria-hidden="true">→</span></a>
                <a className="btn ghost" href="#how">How it works</a>
              </div>
            </div>
          </CloudShader>
          <div className="sky-grain" aria-hidden="true" />
        </section>

        <section className="am-sec light" id="how" data-theme="light" aria-labelledby="how-h">
          <Reveal targets="children" className="am-head">
            <h2 className="h2" id="how-h">Understand. Reason. Respond.</h2>
            <p className="lede">{v.body}</p>
          </Reveal>
          <Reveal targets="children" className="am-loop">
            {loop.map((step, i) => (
              <div key={step.h}>
                {/* airform's light numerals, requested by the client. taste-skill-ignore */}
                <span className="num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{step.h}</h3>
                <p>{step.p}</p>
              </div>
            ))}
          </Reveal>
        </section>

        <section className="am-sec deep am-reads" data-theme="dark" aria-labelledby="reads-h">
          <h2 className="h2" id="reads-h">What AugMind reads.</h2>
          <Reveal as="ul" targets="children" className="am-sources">
            {sources.map((s) => (
              <li key={s.name}><strong>{s.name}</strong><span>{s.what}</span></li>
            ))}
          </Reveal>
        </section>

        <section className="am-sec light" data-theme="light" aria-labelledby="think-h">
          <div className="am-head">
            <h2 className="h2" id="think-h">One question, start to finish.</h2>
            <p className="lede">A shift lead asks about a slowdown. This is what AugMind does with it.</p>
          </div>
          <ol className="am-trace">
            {thoughts.map((step) => (
              <li key={step.state} data-state={step.state}>
                <span className="who"><i aria-hidden="true" />{step.state}</span>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
          <p className="note">Sources used: Line 3 sensor log, shift report (sample exchange).</p>
        </section>

        <section className="am-sec blueprint" data-theme="light" aria-labelledby="where-h">
          <h2 className="h2" id="where-h">Where it works.</h2>
          <div className="am-places">
            {places.map((pl) => (
              <a key={pl.name} href={pl.href} className="am-place">
                <span className="with">{pl.with}</span>
                <h3>{pl.name}</h3>
                <p>{pl.p}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="am-sec light" data-theme="light" aria-labelledby="amfaq-h">
          <div className="careers am-faq">
            <div className="join">
              <h2 className="h2" id="amfaq-h">Questions, answered.</h2>
              <p className="lede">Bring the questions your team asks every week. We will show you AugMind answering them.</p>
              <div><a className="btn" href={`mailto:${contact.email}?subject=AugMind`}>Email the team <span className="arrow" aria-hidden="true">→</span></a></div>
            </div>
            <div className="list">
              {faqs.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}<span className="mark" aria-hidden="true" /></summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
