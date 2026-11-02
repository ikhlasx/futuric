import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { Reveal } from 'cube-motion/react'
import { gsap, reducedMotion } from '../lib/motion'
import { ventures } from '../lib/content'

const v = ventures[2]

// Sample data, to be swapped for real Forma client work before launch.
const orders = [
  { id: 'WO-2041', site: 'Kwinana', status: 'Running', due: 'Today' },
  { id: 'WO-2042', site: 'Perth', status: 'Queued', due: 'Today' },
  { id: 'WO-2038', site: 'Dubai', status: 'Running', due: 'Tue' },
  { id: 'WO-2035', site: 'Doha', status: 'Blocked', due: 'Wed' },
  { id: 'WO-2033', site: 'Perth', status: 'Done', due: 'Mon' },
]
const hourly = [152, 168, 171, 160, 149, 163, 158, 163] // sums to 1,284
const target = 1400
const total = hourly.reduce((a, b) => a + b, 0)
const tasks = [
  { t: 'Check conveyor 2 belt tension', done: true },
  { t: 'Sign off chiller 2 readings', done: true },
  { t: 'Hand over Line 3 to night shift', done: false },
]

function Platform() {
  return (
    <div className="ui ui-table" data-ui>
      <div className="ui-head">
        <span className="ui-title">Work orders</span>
        <span className="ui-muted">{orders.filter((o) => o.status !== 'Done').length} open</span>
      </div>
      <table>
        <thead><tr><th>Order</th><th>Site</th><th>Status</th><th>Due</th></tr></thead>
        <tbody>
          {orders.map((o, i) => (
            <tr key={o.id} style={{ '--d': `${i * 70}ms` }}>
              <td>{o.id}</td><td>{o.site}</td>
              <td><span className={`pill ${o.status.toLowerCase()}`}>{o.status}</span></td>
              <td>{o.due}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Dashboard() {
  const max = Math.max(...hourly)
  return (
    <div className="ui ui-dash" data-ui>
      <div className="ui-head">
        <span className="ui-title">Line 3 output, this shift</span>
      </div>
      <p className="big">{total.toLocaleString()}<span className="ui-muted"> / {target.toLocaleString()} units</span></p>
      <p className="ui-muted">{((total / target) * 100).toFixed(1)}% of target, 2 hours left</p>
      <div className="bars" aria-hidden="true">
        {hourly.map((h, i) => (
          <span key={i} style={{ '--h': h / max, '--d': `${i * 50}ms` }} />
        ))}
      </div>
    </div>
  )
}

function Mobile() {
  return (
    <div className="ui ui-phone" data-ui>
      <div className="screen">
        <span className="ui-title">Shift handover</span>
        <span className="ui-muted">Line 3 · 2 of 3 done</span>
        <ul>
          {tasks.map((k, i) => (
            <li key={k.t} className={k.done ? 'done' : ''} style={{ '--d': `${i * 90}ms` }}>
              <i aria-hidden="true" />{k.t}
            </li>
          ))}
        </ul>
        <span className="cta">Hand over</span>
      </div>
    </div>
  )
}

function Device() {
  const temp = 4.2
  const set = 4.0
  // Ring shows temperature across a 0–10 °C range.
  const c = 2 * Math.PI * 34
  return (
    <div className="ui ui-device" data-ui>
      <span className="ui-title">Chiller 2</span>
      <svg viewBox="0 0 80 80" className="ring" aria-hidden="true">
        <circle cx="40" cy="40" r="34" className="track" />
        <circle cx="40" cy="40" r="34" className="val" style={{ '--c': c, '--o': c * (1 - temp / 10) }} />
      </svg>
      <p className="big">{temp.toFixed(1)}°C</p>
      <p className="ui-muted">Set {set.toFixed(1)}°C · Online, 12 s ago</p>
    </div>
  )
}

function Assistant() {
  return (
    <div className="ui ui-chat" data-ui>
      <p className="q">Why did Line 3 slow down at 14:00?</p>
      <p className="a">
        Conveyor 2 paused for 11 minutes after its jam sensor tripped. Output was back to target by 14:20.
      </p>
      <div className="src"><span>Sensor log</span><span>Shift report</span></div>
    </div>
  )
}

const builds = [
  { cap: 'Enterprise platform', cls: 'wide', ui: <Platform /> },
  { cap: 'Operations dashboard', ui: <Dashboard /> },
  { cap: 'Mobile app', cls: 'tall', ui: <Mobile /> },
  { cap: 'AI-powered ecosystem', ui: <Assistant /> },
  { cap: 'Connected IoT device', ui: <Device /> },
]

// The /forma page: ghost.ai's device grid with a scan line; each Forma product wakes as the line passes.
export default function FormaShowcase() {
  const root = useRef(null)

  useGSAP(() => {
    const tiles = gsap.utils.toArray('.bench > .tile')
    if (reducedMotion()) { tiles.forEach((t) => t.classList.add('lit')); return }
    const tl = gsap.timeline({ scrollTrigger: { trigger: '.bench', start: 'top 75%', end: 'bottom 40%', scrub: 0.6 } })
    tl.fromTo('.scan', { y: 0 }, { y: () => root.current.querySelector('.bench').offsetHeight, ease: 'none', duration: 1 })
    tiles.forEach((t, i) => {
      tl.call(() => t.classList.toggle('lit', tl.scrollTrigger.direction > 0), null, 0.12 + i * 0.15)
    })
  }, { scope: root })

  return (
    <section className="forma-full dark" id="forma-products" data-theme="dark" ref={root} aria-labelledby="forma-h">
      <div className="head">
        <Reveal targets="children" style={{ display: 'grid', gap: 24 }}>
          <h1 className="h2" id="forma-h">Ideas, built into products.</h1>
        </Reveal>
        <Reveal targets="children" style={{ display: 'grid', gap: 20 }}>
          <p className="lede">Forma: {v.line.toLowerCase()}</p>
          <p className="note">{v.body}</p>
        </Reveal>
      </div>

      <div className="bench">
        {builds.map((b) => (
          <figure key={b.cap} className={`tile ${b.cls ?? ''}`}>
            {b.ui}
            <figcaption className="cap">{b.cap}</figcaption>
          </figure>
        ))}
        <span className="scan" aria-hidden="true" />
      </div>
    </section>
  )
}
