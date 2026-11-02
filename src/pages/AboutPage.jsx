import { useEffect } from 'react'
import { Reveal } from 'cube-motion/react'
import { initSmoothScroll } from '../lib/motion'
import { useActiveSection } from '../lib/useActiveSection'
import { ventures } from '../lib/content'
import Nav from '../sections/Nav'
import Footer from '../sections/Footer'

const themeOf = (el) => el.dataset.theme

// Page copy adapted from nexafuturic.com's "Who we are" for the Futuric group; the client
// confirms it before launch.
const tags = ['Smart factories', 'Secure AI', 'Digital products', 'Intelligent living', 'Global mobility']

const wins = [
  { h: 'Strategy with clear execution', p: 'Every engagement is built around your goals, measurable outcomes and a structured delivery roadmap.' },
  { h: 'Engineered around you', p: 'Systems shaped to your infrastructure, workflows, requirements and growth plans, not the other way round.' },
  { h: 'Connected operations', p: 'Real-time visibility across machines, software, sites and the people who run them.' },
  { h: 'AI you can act on', p: 'Systems that find patterns, improve performance, cut waste and support faster decisions.' },
  { h: 'One connected platform', p: 'Monitoring, analytics, automation, alerts and reporting in one environment.' },
  { h: 'A long-term partner', p: 'From discovery and deployment to continuous improvement, we work alongside you at every stage.' },
]

const team = [
  {
    name: 'Dr Ashique Ahmed', role: 'Chief Executive Officer', focus: 'Strategy · Growth · Partnerships',
    bio: 'Holds a PhD in Air Transport Management specialising in aviation security and complex systems, bringing together technical depth, systems thinking and entrepreneurial leadership.',
  },
  {
    name: 'Mohammed Sehil Elayodan', role: 'Chief Technology Officer', focus: 'Architecture · Integration · Industrial performance',
    bio: 'An electronics engineer specialising in industrial automation, IoT infrastructure, edge computing and distributed systems, who also studied innovation and entrepreneurship through the National Institute of Technology (NIT).',
  },
  {
    name: 'Yogesh Ravichandran', role: 'Director, Operations & Implementation', focus: 'Systems integration · Deployment · Operational readiness',
    bio: 'Qualified in mechanical engineering and computer-aided design, with expertise across Industry 4.0, intelligent automation, system integration and digital transformation.',
  },
  {
    name: 'Sohaj Elayodan', role: 'Director, Strategy & Commercial Growth', focus: 'Systems thinking · Commercial strategy · Transformation',
    bio: 'Holds master’s qualifications in psychology and business administration, combining behavioural insight with systems thinking and commercial strategy.',
  },
  {
    name: 'Ikhlas Pv', role: 'Head of AI & Foundational Systems', focus: 'Computer vision · Machine learning · IoT',
    bio: 'A specialist in computer vision and industrial automation, working where AI orchestration meets hardware integration.',
  },
]

const capabilities = [
  'Industrial IoT infrastructure',
  'Intelligent automation systems',
  'Edge computing architecture',
  'Real-time operational coordination',
  'Cyber-physical system integration',
  'Smart environments',
]

const cities = [
  ['Perth', 'Australia', 'Head office'],
  ['Melbourne', 'Australia'],
  ['Dubai', 'UAE'],
  ['Abu Dhabi', 'UAE'],
  ['Sharjah', 'UAE'],
  ['Riyadh', 'Saudi Arabia'],
  ['Doha', 'Qatar'],
  ['Bangalore', 'India'],
]

const initials = (name) => name.replace(/^Dr\s+/, '').split(/\s+/).map((w) => w[0]).slice(0, 2).join('')

// Who Futuric is: the group, how it works, the people, the technology and where it operates.
export default function AboutPage() {
  const navTheme = useActiveSection('main [data-theme], footer', 40, themeOf) ?? 'light'

  useEffect(() => {
    document.title = 'About — Futuric'
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

      <main id="main" className="about-page">
        <section className="ab-hero ghost-ground" data-theme="light" aria-labelledby="ab-h">
          <div className="connect-grid" aria-hidden="true" />
          <Reveal targets="children" className="ab-intro">
            <p className="ab-kicker">Who we are</p>
            <h1 className="display" id="ab-h">Engineering intelligence into the way things run.</h1>
            <p className="lede">Futuric is an Australian technology group, headquartered in Perth, building intelligent systems for industry, business and everyday life.</p>
            <p className="ab-body">
              Across five ventures we connect machines, data, software and people into environments designed for visibility,
              automation and growth: {ventures.map((v) => v.name).join(', ').replace(/, ([^,]*)$/, ' and $1')}.
            </p>
            <ul className="ab-tags" aria-label="What we work on">
              {tags.map((t) => <li key={t}>{t}</li>)}
            </ul>
          </Reveal>
          <blockquote className="ab-quote">
            <p>“We turn fragmented operations into intelligent systems that improve efficiency and reduce waste.”</p>
          </blockquote>
        </section>

        <section className="ab-section ab-dark" data-theme="dark" aria-labelledby="ab-win">
          <div className="ab-head">
            <p className="ab-kicker">What we build</p>
            <h2 className="h2" id="ab-win">How you win.</h2>
            <p className="lede">Our focus is simple: make complex operations connected, visible and intelligent, in real time.</p>
          </div>
          <ol className="ab-wins">
            {wins.map((w, i) => (
              <li key={w.h}>
                <span className="n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3>{w.h}</h3>
                <p>{w.p}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="ab-section ghost-ground" data-theme="light" aria-labelledby="ab-team">
          <div className="connect-grid" aria-hidden="true" />
          <div className="ab-head">
            <p className="ab-kicker">Leadership</p>
            <h2 className="h2" id="ab-team">The team behind the intelligence.</h2>
            <p className="lede">Systems thinkers, engineers, strategists and operators, turning complexity into systems that scale.</p>
          </div>
          <ul className="ab-team">
            {team.map((m) => (
              <li key={m.name}>
                <span className="ab-mono" aria-hidden="true">{initials(m.name)}</span>
                <h3>{m.name}</h3>
                <p className="role">{m.role}</p>
                <p className="focus">{m.focus}</p>
                <p className="bio">{m.bio}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="ab-section ab-dark" data-theme="dark" aria-labelledby="ab-ip">
          <div className="ab-split">
            <div className="ab-head">
              <p className="ab-kicker">Innovation</p>
              <h2 className="h2" id="ab-ip">Proprietary intellectual property.</h2>
              <p className="lede">Our foundation is built on patented innovation, industrial systems engineering and intelligent automation frameworks made for real-world environments.</p>
              <p className="ab-body">One ecosystem combines IoT infrastructure, edge computing and AI-driven coordination into an architecture built to adapt for the long term, and every Futuric venture builds on it.</p>
            </div>
            <ul className="ab-caps">
              {capabilities.map((c) => <li key={c}><i aria-hidden="true" />{c}</li>)}
            </ul>
          </div>
        </section>

        <section className="ab-section ghost-ground" data-theme="light" aria-labelledby="ab-net">
          <div className="connect-grid" aria-hidden="true" />
          <div className="ab-head">
            <p className="ab-kicker">Global network</p>
            <h2 className="h2" id="ab-net">Where we work.</h2>
            <p className="lede">Futuric works across Australia, the Middle East and Asia, from one head office in Perth.</p>
          </div>
          <ul className="ab-cities">
            {cities.map(([city, country, note]) => (
              <li key={city} className={note ? 'home' : ''}>
                <strong>{city}</strong>
                <span>{note ? `${country} · ${note}` : country}</span>
              </li>
            ))}
          </ul>
          <div>
            <a className="btn" href="/contact">Build with us <span className="arrow" aria-hidden="true">→</span></a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
