// NexaFactory — an isometric NEXA smart factory drawn with react-isokit, modelled on isokit's
// "EV charger" figure. Five agents each run one task on their own, in a loop:
//   AMR-01 shuttles stock from the rack, ARM-02 picks and places on the belt,
//   QA-03 scans every unit, AGV-04 carries finished units to the dock,
//   and the AI hub (AugMind) plans the work and shows it on its screen.
// Micro-animations: particles run along the stock, belt and dispatch lanes and down the hub's
// data links; the rack fills (+1, +2) until the AMR pulls it; finished units stack on the dock.
// Pressing the console key dispatches a work order: a signal runs from the hub to every agent.
// Ported to plain JS for this Vite project (no TypeScript or Tailwind).

import { useEffect, useRef, useState } from 'react'
import { Box, Cursor, Glow, Plate, Press, Ripple, Signal, path, playSound, project, useDemoTap } from 'react-isokit'
import { Callout } from 'react-isokit/drafting'
import 'react-isokit/styles.css'
import 'react-isokit/themes.css'

const FLOOR = { x: 0, y: 0, z: 0, w: 320, d: 200, h: 8 }
const Z = FLOOR.h

const RACK = { x: 14, y: 16, z: Z, w: 46, d: 30, h: 66 }
const HUB = { x: 252, y: 14, z: Z, w: 56, d: 36, h: 80 }
const CONSOLE = { x: 262, y: 66, z: Z, w: 26, d: 18, h: 16 }
const KEY = { x: 267, y: 69, z: Z + 16, w: 16, d: 12, h: 4 }

const BELT = { x: 44, y: 104, z: Z, w: 236, d: 24, h: 14 }
const BELT_TOP = Z + BELT.h
const CRATE = { w: 14, d: 14, h: 12 }
const CRATE_START = BELT.x + 6
const CRATE_RUN = BELT.w - CRATE.w - 12
const BELT_LOOP = 8.4 // seconds for one crate to ride the belt; four crates, one every 2.1 s

const ARM_BASE = { x: 104, y: 66, z: Z, w: 24, d: 24, h: 10 }
const ARM_COL = { x: 111, y: 73, z: Z + 10, w: 10, d: 10, h: 40 }
const ARM_BOOM = { x: 109, y: 72, z: Z + 50, w: 14, d: 44, h: 8 }
const ARM_HEAD = { x: 111, y: 104, z: Z + 32, w: 10, d: 12, h: 18 }

const GATE_POSTS = [{ x: 186, y: 96, z: Z, w: 7, d: 7, h: 46 }, { x: 186, y: 128, z: Z, w: 7, d: 7, h: 46 }]
const GATE_BEAM = { x: 184, y: 94, z: Z + 46, w: 11, d: 43, h: 7 }

const AMR = { x: 26, y: 160, z: Z, w: 32, d: 24, h: 10 }
const AMR_LOAD = { x: 35, y: 165, z: Z + 10, w: 14, d: 14, h: 10 }
const AGV = { x: 262, y: 158, z: Z, w: 34, d: 26, h: 10 }
const AGV_LOAD = { x: 272, y: 164, z: Z + 10, w: 14, d: 14, h: 10 }

// Dispatch dock: finished units stack here until the AGV clears it.
const DOCK = { x: 100, y: 158, z: Z, w: 30, d: 30, h: 4 }
const DOCK_MAX = 4
const UNIT = { w: 12, d: 12, h: 9 }
const UNIT_SPOTS = [[2, 2], [16, 2], [2, 16], [16, 16]]

// Rack slots: two columns by three shelves; each holds one tote.
const SLOTS = [[5, 6], [25, 6], [5, 24], [25, 24], [5, 42], [25, 42]]
const RESTOCK = [1, 2, 1, 2, 1] // the rack's intake pattern, read in a loop

// Screen-space offsets for the loops, so CSS can move parts along world axes.
const css = (name, [x, y]) => ({ [`--${name}x`]: `${x}px`, [`--${name}y`]: `${y}px` })
const BELT_MOVE = css('m', project(CRATE_RUN, 0, 0))
const ARM_DIP = css('m', project(0, 0, -14))
const AMR_MOVE = css('m', project(DOCK.x - AMR.x - AMR.w - 6, 0, 0))
const AGV_MOVE = css('m', project(0, 34, 0))

const ANTENNA = [HUB.x + HUB.w / 2, HUB.y + HUB.d / 2, HUB.z + HUB.h + 14]
const AGENTS = [
  { id: 'AMR-01', task: 'moving stock from rack B3', at: [AMR.x + 16, AMR.y + 12, Z + 20] },
  { id: 'ARM-02', task: 'pick and place · 0.4 s', at: [ARM_HEAD.x + 5, ARM_HEAD.y + 6, ARM_HEAD.z] },
  { id: 'QA-03', task: 'vision check · 99.8% pass', at: [GATE_BEAM.x + 5, GATE_BEAM.y + 20, GATE_BEAM.z] },
  { id: 'AGV-04', task: 'carrying units to dock 2', at: [AGV.x + 17, AGV.y + 13, Z + 20] },
  { id: 'AI-05', task: 'planning the next batch', at: ANTENNA },
]
// The hub's load chart for each task, as bar heights out of 10.
const LOAD = [[4, 7, 5, 8], [6, 9, 4, 6], [8, 5, 7, 9], [5, 6, 9, 4], [7, 8, 6, 7]]

// Dispatch signals: up from the hub, then down to each agent.
const ROUTES = AGENTS.slice(0, 4).map(({ at }) => [ANTENNA, [at[0], at[1], ANTENNA[2]], at])

// Floor lanes the particles run along: rack to belt, along the belt, belt end to the dock and AGV.
const LANES = [
  { d: path([[RACK.x + RACK.w / 2, RACK.y + RACK.d + 2, Z], [RACK.x + RACK.w / 2, BELT.y - 6, Z], [BELT.x + 4, BELT.y - 6, Z]]), dur: 3.2, n: 2 },
  { d: path([[BELT.x + 6, BELT.y + BELT.d / 2, BELT_TOP], [BELT.x + BELT.w - 6, BELT.y + BELT.d / 2, BELT_TOP]]), dur: BELT_LOOP / 2, n: 3 },
  { d: path([[BELT.x + BELT.w - 4, BELT.y + BELT.d + 6, Z], [AGV.x + AGV.w / 2, BELT.y + BELT.d + 6, Z], [AGV.x + AGV.w / 2, AGV.y - 2, Z]]), dur: 2.4, n: 2 },
  { d: path([[AMR.x + AMR.w + 2, AMR.y + AMR.d / 2, Z], [DOCK.x - 2, AMR.y + AMR.d / 2, Z]]), dur: 1.6, n: 2 },
]
// Data links from the hub to the arm and the vision gate: the plan, streaming out.
const LINKS = [
  path([ANTENNA, [ARM_BOOM.x + 7, ARM_BOOM.y + 4, ANTENNA[2]], [ARM_BOOM.x + 7, ARM_BOOM.y + 4, ARM_BOOM.z + ARM_BOOM.h]]),
  path([ANTENNA, [GATE_BEAM.x + 5, GATE_BEAM.y + 20, ANTENNA[2]], [GATE_BEAM.x + 5, GATE_BEAM.y + 20, GATE_BEAM.z + GATE_BEAM.h]]),
]

const STAGE = [FLOOR, { ...HUB, z: 0, h: HUB.h + 20 }, { ...RACK, z: 0 }, AGV, AMR, [-20, 220, 0]]
// Wide frames keep open floor to the left for the section copy that sits over it.
const fitFor = (wide) => (wide ? [...STAGE, [-215, 215, 0]] : STAGE)

export default function NexaFactory({ onStep, wide = false, hint }) {
  const [task, setTask] = useState(0)
  const [orders, setOrders] = useState(1284)
  const [dispatch, setDispatch] = useState(0)
  const [stock, setStock] = useState({ level: 3, pop: null, n: 0 })
  const [dock, setDock] = useState({ units: 1, shipped: 412, n: 0 })
  const [batch, setBatch] = useState(118)
  const live = useLive()
  const stop = useRef(() => {})

  // The hub works through its agents' tasks on its own; a full round starts a new batch.
  useEffect(() => {
    if (!live.on) return undefined
    const id = setInterval(() => setTask((t) => {
      if (t === AGENTS.length - 1) setBatch((b) => b + 1)
      return (t + 1) % AGENTS.length
    }), 2400)
    return () => clearInterval(id)
  }, [live.on])
  useEffect(() => { onStep?.(task) }, [task, onStep])

  // Stock arrives at the rack in ones and twos; when it's full the AMR pulls a load.
  useEffect(() => {
    if (!live.on) return undefined
    const id = setInterval(() => setStock((s) => {
      if (s.level >= SLOTS.length) return { level: 2, pop: `−${s.level - 2}`, n: s.n + 1 }
      const add = Math.min(RESTOCK[s.n % RESTOCK.length], SLOTS.length - s.level)
      return { level: s.level + add, pop: `+${add}`, n: s.n + 1 }
    }), 2800)
    return () => clearInterval(id)
  }, [live.on])

  // A finished unit leaves the belt every 2.1 s and lands on the dock; the AGV clears a full dock.
  useEffect(() => {
    if (!live.on) return undefined
    const id = setInterval(() => setDock((d) => ({
      units: d.units >= DOCK_MAX ? 1 : d.units + 1,
      shipped: d.shipped + 1,
      n: d.n + 1,
    })), (BELT_LOOP / 4) * 1000)
    return () => clearInterval(id)
  }, [live.on])

  useEffect(() => () => stop.current(), [])

  const send = (audible) => {
    stop.current()
    if (audible) stop.current = playSound('cascade', { count: 4, stagger: 0.12 })
    setDispatch((n) => n + 1)
    setOrders((n) => n + 1)
  }
  const demo = useDemoTap(() => send(false), { delay: 1400 })
  const press = () => { demo.dismiss(); send(true) }

  const a = AGENTS[task]
  const rackTop = [RACK.x + RACK.w / 2, RACK.y + RACK.d / 2, RACK.z + RACK.h + 6]
  const dockTop = [DOCK.x + DOCK.w / 2, DOCK.y + DOCK.d / 2, DOCK.z + DOCK.h + UNIT.h * 2 + 8]
  return (
    <Plate
      {...demo.plate}
      fig="NEXA"
      name="Autonomous line"
      hint={hint ?? 'Press the console to dispatch'}
      readout={`${orders.toLocaleString()} work orders · ${dock.shipped.toLocaleString()} shipped`}
      className="fig-nexa"
      fit={fitFor(wide)}
      aspect={wide ? 1.8 : 1.3}
      pad={0.03}
      look="blueprint"
      theme="light"
      credit={false}
      label="An isometric NEXA factory floor. Stock fills a rack and a mobile robot carries it to a conveyor, a robot arm places it on the belt, a vision gate checks every unit, finished units stack on a dock for a guided vehicle, and an AI hub plans the work. Press the console key to dispatch a work order to every agent."
    >
      <g ref={demo.ref}>
        <g ref={live.ref}>
          <Box {...FLOOR} r={14} top={
            <>
              <path className="ik-detail" d={`M8 ${BELT.y - 8}H${FLOOR.w - 8}M8 ${BELT.y + BELT.d + 8}H${FLOOR.w - 8}`} />
              <path className="ik-dash" d={`M24 150V190M${FLOOR.w - 24} 150V190`} />
            </>
          } />
        </g>

        {/* floor lanes, with parts flowing along them */}
        {LANES.map((lane, k) => <path key={k} className="ik-dash nx-lane" d={lane.d} />)}
        <Flow lanes={LANES} />

        {/* intake rack: totes fill its slots, then the AMR pulls a load */}
        <Box {...RACK} r={4} front={
          <>
            {[19, 37, 55].map((y) => <path key={y} className="ik-detail" d={`M2 ${y}H${RACK.w - 2}`} />)}
            {SLOTS.map(([x, y], k) => (
              <g key={k}>
                <rect className="ik-well" x={x} y={y} width={16} height={11} rx={1.5} />
                {k < stock.level ? <rect className="nx-tote" x={x + 1.5} y={y + 1.5} width={13} height={8} rx={1} /> : null}
              </g>
            ))}
            <text className="ik-label" x={4} y={RACK.h - 3}>RACK B · {stock.level}/{SLOTS.length}</text>
          </>
        } />
        {stock.pop ? <Pop key={`s${stock.n}`} at={rackTop} text={stock.pop} out={stock.pop.startsWith('−')} /> : null}

        {/* AI hub (AugMind): live task, batch number, a progress bar and a load chart */}
        <Box {...HUB} r={6} front={
          <>
            <rect className="ik-screen" x={5} y={8} width={HUB.w - 10} height={40} rx={3} />
            <text className="ik-screen-text ik-dim" x={9} y={17} fontSize={5}>AugMind · batch {batch}</text>
            <g key={task} className="ik-enter">
              <text className="ik-screen-text" x={9} y={27} fontSize={6.6}>{a.id}</text>
              <text className="ik-screen-text ik-dim" x={9} y={35} fontSize={4.4}>{a.task}</text>
            </g>
            <rect className="nx-track" x={9} y={40} width={HUB.w - 18} height={2.4} rx={1.2} />
            <rect key={`p${task}-${batch}`} className="nx-progress" x={9} y={40} width={HUB.w - 18} height={2.4} rx={1.2} />
            {LOAD[task].map((v, k) => (
              <rect key={k} className="nx-bar" x={9 + k * 6} y={62 - v * 1.1} width={4} height={v * 1.1} rx={0.6} />
            ))}
            {[54, 58, 62].map((y) => <path key={y} className="ik-detail" d={`M34 ${y}H${HUB.w - 8}`} />)}
          </>
        } side={<rect className="ik-well" x={6} y={12} width={HUB.d - 12} height={22} rx={3} />} />
        <path className="ik-line" d={path([[ANTENNA[0], ANTENNA[1], HUB.z + HUB.h], ANTENNA])} />
        <Glow><circle className="ik-dot nx-blink" {...dot(ANTENNA)} r={2.2} /></Glow>

        {/* the plan streaming from the hub to the arm and the gate */}
        {LINKS.map((d, k) => <path key={k} className="nx-link" d={d} />)}
        <Flow lanes={LINKS.map((d, k) => ({ d, dur: 1.8, n: 2, delay: k * 0.6 }))} className="nx-data" r={1.3} />

        {/* console: press to dispatch */}
        <Box {...CONSOLE} r={4} front={<text className="ik-label" x={4} y={12}>DISPATCH</text>} />
        <Press label="Dispatch a work order to every agent" material="plastic" onPress={press} data-hot>
          <g><Box {...KEY} r={3} /></g>
        </Press>
        {demo.phase !== 'aim' && demo.phase !== 'press' && dispatch === 0 ? <Ripple {...KEY} z={KEY.z + KEY.h} r={3} /> : null}

        {/* robot arm (behind the belt) */}
        <Box {...ARM_BASE} r={5} />
        <Box {...ARM_COL} r={3} side={<path className="ik-detail" d="M3 4V34" />} />
        <Box {...ARM_BOOM} r={3} top={<path className="ik-detail" d={`M7 4V${ARM_BOOM.d - 4}`} />} />

        {/* conveyor, rollers and moving crates */}
        <Box {...BELT} r={5} top={
          <g className="nx-rollers">
            {Array.from({ length: 19 }, (_, k) => <path key={k} className="ik-detail" d={`M${8 + k * 12} 3V${BELT.d - 3}`} />)}
          </g>
        } front={<path className="ik-detail" d={`M6 ${BELT.h - 4}H${BELT.w - 6}`} />} />
        {[0, 1, 2, 3].map((k) => (
          <g key={k} className="nx-belt" style={{ ...BELT_MOVE, animationDelay: `${-k * (BELT_LOOP / 4)}s` }}>
            <Box x={CRATE_START} y={BELT.y + 5} z={BELT_TOP} {...CRATE} r={2}
              top={<path className="ik-detail" d={`M3 ${CRATE.d / 2}H${CRATE.w - 3}`} />} />
          </g>
        ))}

        {/* arm head dips onto the belt */}
        <g className="nx-dip" style={ARM_DIP}>
          <Box {...ARM_HEAD} r={3} front={<path className="ik-detail" d="M3 12H7" />} />
        </g>

        {/* QA vision gate scanning every unit */}
        <Box {...GATE_POSTS[0]} r={2} />
        <g className="nx-scan">
          {[0, 1, 2].map((k) => (
            <path key={k} className="ik-live" d={path([[GATE_BEAM.x + 5.5, GATE_BEAM.y + 10 + k * 11, GATE_BEAM.z], [GATE_BEAM.x + 5.5, GATE_BEAM.y + 10 + k * 11, BELT_TOP + 1]])} />
          ))}
        </g>
        <Box {...GATE_POSTS[1]} r={2} />
        <Box {...GATE_BEAM} r={3} side={<rect className="ik-screen" x={8} y={1.5} width={26} height={4} rx={1} />} />

        {/* dispatch dock: finished units stack up, two high */}
        <Box {...DOCK} r={3} top={<path className="ik-dash" d={`M3 ${DOCK.d / 2}H${DOCK.w - 3}`} />} />
        {Array.from({ length: dock.units }, (_, k) => {
          const [ox, oy] = UNIT_SPOTS[k]
          return (
            <g key={k} className={k === dock.units - 1 ? 'nx-land' : undefined}>
              <Box x={DOCK.x + ox} y={DOCK.y + oy} z={DOCK.z + DOCK.h} {...UNIT} r={2}
                top={<path className="ik-detail" d={`M3 ${UNIT.d / 2}H${UNIT.w - 3}`} />} />
            </g>
          )
        })}
        <Pop key={`d${dock.n}`} at={dockTop} text="+1" />

        {/* AMR and AGV agents, shuttling */}
        <g className="nx-shuttle" style={AMR_MOVE}>
          <Box {...AMR} r={5} front={<rect className="ik-well" x={4} y={3} width={8} height={4} rx={1} />} />
          <Box {...AMR_LOAD} r={2} />
        </g>
        <g className="nx-shuttle" style={{ ...AGV_MOVE, animationDelay: '-2.6s' }}>
          <Box {...AGV} r={5} front={<rect className="ik-well" x={4} y={3} width={8} height={4} rx={1} />} />
          <Box {...AGV_LOAD} r={2} />
        </g>

        {/* sensors on every station */}
        {[[RACK.x + RACK.w / 2, RACK.y + RACK.d / 2, RACK.z + RACK.h], [ARM_BOOM.x + 7, ARM_BOOM.y + 4, ARM_BOOM.z + ARM_BOOM.h], [BELT.x + 6, BELT.y + 4, BELT_TOP]].map((p, k) => (
          <circle key={k} className="ik-dot nx-blink" style={{ animationDelay: `${k * 0.4}s` }} {...dot(p)} r={1.6} />
        ))}

        {/* dispatch: a signal from the hub to each agent */}
        {dispatch > 0 ? ROUTES.map((pts, k) => (
          <Signal key={`${dispatch}-${k}`} points={pts} delay={k * 120} duration={700} />
        )) : null}

        <Callout at={AGENTS[0].at} dx={-10} dy={36} label="AMR-01 · stock" />
        <Callout at={AGENTS[1].at} dx={-30} dy={-30} label="ARM-02 · pick" />
        <Callout at={AGENTS[2].at} dx={18} dy={-26} label="QA-03 · vision" />
        <Callout at={AGENTS[3].at} dx={16} dy={24} label="AGV-04 · dispatch" />
        <Callout at={ANTENNA} dx={-26} dy={-14} label="AI-05 · plan" />
        <Cursor at={[KEY.x + KEY.w / 2, KEY.y + KEY.d / 2, KEY.z + KEY.h]} phase={demo.phase} />
      </g>
    </Plate>
  )
}

// Particles riding a set of paths, spaced evenly along each.
function Flow({ lanes, className = 'nx-particle', r = 1.7 }) {
  return lanes.map(({ d, dur, n, delay = 0 }, k) =>
    Array.from({ length: n }, (_, i) => (
      <circle key={`${k}-${i}`} className={className} r={r}>
        <animateMotion dur={`${dur}s`} begin={`${-delay - (dur / n) * i}s`} repeatCount="indefinite" path={d} />
      </circle>
    )),
  )
}

// A count that floats up from a station and fades: +1, +2, or −6 when the AMR pulls stock.
function Pop({ at, text, out = false }) {
  const [x, y] = project(...at)
  return <text className={`nx-pop${out ? ' out' : ''}`} x={x} y={y} textAnchor="middle">{text}</text>
}

// Only run the counters while the figure is on screen.
function useLive() {
  const [on, setOn] = useState(false)
  const [el, setEl] = useState(null)
  useEffect(() => {
    if (!el) return undefined
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { rootMargin: '120px' })
    io.observe(el)
    return () => io.disconnect()
  }, [el])
  return { on, ref: setEl }
}

function dot(p) {
  const [cx, cy] = project(...p)
  return { cx, cy }
}
