// SmartHome3D — HardRock's home as one machine you can spin, in the style of 21st.dev's
// "Agentic Factory 3D" (procedural three.js on a chamfered metal plate: no models, no images).
// Four modules sit along one line and play an arrival, in order, on a 15-second loop:
//   01 Security       the bolt slides back and the front door swings open
//   02 Lighting       a pulse runs down the line; the pendant and LED bar blink, then stay on
//   03 Entertainment  the TV wakes with a live equaliser; speakers pulse and throw sound rings
//   04 Climate        the AC spins up, air flows and the thermostat counts down to 22°
// then the house powers down and the door locks again. onStep(i) reports the module in play;
// changing `jump` (any new number) restarts the loop at module `active`. Drag to rotate (zoom is
// off so the page scrolls); clicking a module calls onPick(index). Plain JS for this Vite project.

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

const LOOP = 15 // seconds
// When each module takes over in the loop.
const STEPS = [0, 4, 6.5, 9]

export default function SmartHome3D({ active = 0, jump = 0, onStep, onPick, wide = true, className = '' }) {
  const rootRef = useRef(null)
  const state = useRef({ active, jump, onStep, onPick, wide })
  Object.assign(state.current, { active, onStep, onPick, wide })
  if (jump !== state.current.jump) {
    state.current.jump = jump
    state.current.jumpTo = STEPS[active]
  }

  useEffect(() => {
    const root = rootRef.current
    if (!root) return undefined
    let dispose
    let cancelled = false
    // The in-scene screens are painted on canvases: wait for the site font first.
    document.fonts.ready.then(() => {
      if (!cancelled) dispose = initHome(root, getComputedStyle(root).fontFamily, state)
    })
    return () => {
      cancelled = true
      dispose?.()
    }
  }, [])

  return (
    <div ref={rootRef} className={`smart-home-3d ${className}`}>
      <div className="sh-scene" />
      <div className="sh-labels" aria-hidden="true" />
    </div>
  )
}

const clamp01 = (x) => Math.min(1, Math.max(0, x))
// 0 → 1 over [a, b], held at 1, then 1 → 0 over [c, d].
const window01 = (t, a, b, c, d) => (t < a || t > d ? 0 : t < b ? (t - a) / (b - a) : t < c ? 1 : 1 - (t - c) / (d - c))

function initHome(root, fontFamily, state) {
  const cleanups = []
  const listen = (target, type, fn, opts) => {
    target.addEventListener(type, fn, opts)
    cleanups.push(() => target.removeEventListener(type, fn, opts))
  }
  const TAU = Math.PI * 2
  const W = () => root.clientWidth
  const H = () => root.clientHeight

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' })
  } catch {
    root.classList.add('sh-failed')
    return () => {}
  }
  renderer.setClearColor(0x000000, 0)
  renderer.setPixelRatio(Math.min(devicePixelRatio, W() < 900 ? 1.5 : 1.75))
  renderer.setSize(W(), H())
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap
  root.querySelector('.sh-scene').appendChild(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(33, W() / H(), 0.1, 150)
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.065
  controls.enablePan = false
  controls.enableZoom = false // the wheel scrolls the page
  controls.minPolarAngle = 0.2
  controls.maxPolarAngle = Math.PI * 0.46
  controls.rotateSpeed = 0.45
  if (matchMedia('(pointer: coarse)').matches) controls.enableRotate = false

  const pmrem = new THREE.PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const env = pmrem.fromScene(room, 0.04)
  scene.environment = env.texture
  scene.environmentIntensity = 0.6
  room.dispose()
  pmrem.dispose()
  scene.add(new THREE.HemisphereLight(0xe6edf7, 0x2a2d33, 2))
  const key = new THREE.DirectionalLight(0xfff4e2, 3.8)
  key.position.set(-4, 12, 7)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  Object.assign(key.shadow.camera, { left: -9, right: 9, top: 8, bottom: -8, near: 0.5, far: 35 })
  key.shadow.normalBias = 0.035
  key.shadow.radius = 4
  scene.add(key)
  const rim = new THREE.DirectionalLight(0x9fc0f0, 2.4)
  rim.position.set(3, 7, -8)
  scene.add(rim)
  const front = new THREE.DirectionalLight(0xffffff, 0.9)
  front.position.set(5, 3, 10)
  scene.add(front)

  const mat = (color, metalness = 0.1, roughness = 0.4, extra = {}) =>
    new THREE.MeshStandardMaterial({ color, metalness, roughness, ...extra })
  const glow = (color, intensity = 1.5) => mat(color, 0.2, 0.3, { emissive: color, emissiveIntensity: intensity })
  const M = {
    body: mat(0x2c323b, 0.75, 0.3),
    base: mat(0x242a32, 0.85, 0.32),
    edge: mat(0x6d7684, 0.85, 0.24),
    chrome: mat(0xc3cad0, 0.92, 0.18),
    dark: mat(0x11161c, 0.45, 0.38),
    rubber: mat(0x0b1015, 0.1, 0.6),
    ivory: mat(0xe2e1df, 0.4, 0.3),
    copper: mat(0xc57e45, 0.85, 0.3),
    blue: glow(0x3f8cff, 1.4),
    warm: glow(0xffc477, 1.6),
    signal: glow(0xd25c2e, 1.2),
  }

  const geos = new Map()
  const cached = (k, make) => { if (!geos.has(k)) geos.set(k, make()); return geos.get(k) }
  const boxGeo = (w, h, d, r) => cached(`b${w},${h},${d},${r}`, () =>
    (r ? new RoundedBoxGeometry(w, h, d, 2, Math.min(r, w / 3, h / 3, d / 3)) : new THREE.BoxGeometry(w, h, d)))
  function add(parent, mesh, x, y, z) {
    mesh.position.set(x, y, z)
    mesh.castShadow = true
    mesh.receiveShadow = true
    parent.add(mesh)
    return mesh
  }
  const box = (p, w, h, d, x, y, z, m = M.body, r = 0.04) => add(p, new THREE.Mesh(boxGeo(w, h, d, r), m), x, y, z)
  const cyl = (p, r, h, x, y, z, m = M.chrome, r2 = r, seg = 28) =>
    add(p, new THREE.Mesh(cached(`c${r},${r2},${h},${seg}`, () => new THREE.CylinderGeometry(r, r2, h, seg)), m), x, y, z)
  const ball = (p, r, x, y, z, m = M.chrome) => add(p, new THREE.Mesh(cached(`s${r}`, () => new THREE.SphereGeometry(r, 16, 12)), m), x, y, z)
  const screw = (p, x, y, z) => { cyl(p, 0.05, 0.026, x, y, z, M.chrome, 0.05, 12) }
  function painted(w, h, draw, ...first) {
    const c = document.createElement('canvas')
    c.width = w
    c.height = h
    const ctx = c.getContext('2d')
    const texture = new THREE.CanvasTexture(c)
    texture.colorSpace = THREE.SRGBColorSpace
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy())
    const paint = (...args) => { draw(ctx, w, h, ...args); texture.needsUpdate = true }
    paint(...first)
    return { texture, paint }
  }
  const print = (ctx, txt, x, y, size = 20, color = '#e2e1df', weight = 500) => {
    ctx.fillStyle = color
    ctx.font = `${weight} ${size}px ${fontFamily}`
    ctx.fillText(txt, x, y)
  }
  function screen(p, w, h, x, y, z, tex) {
    const o = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex.texture, toneMapped: false }))
    o.position.set(x, y, z)
    p.add(o)
    return o
  }

  // ---- plate ---------------------------------------------------------------------------------
  const home = new THREE.Group()
  scene.add(home)
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 60), new THREE.ShadowMaterial({ opacity: 0.22 }))
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -0.43
  floor.receiveShadow = true
  scene.add(floor)
  box(home, 12.2, 0.38, 7.0, 0, -0.09, 0, M.base, 0.17)
  box(home, 12.0, 0.055, 6.82, 0, 0.13, 0, M.edge, 0.11)
  box(home, 11.9, 0.09, 6.7, 0, 0.19, 0, M.body, 0.1)
  box(home, 11.4, 0.026, 0.032, 0, -0.17, 3.49, M.blue, 0.01)
  for (const x of [-5.4, 5.4]) for (const z of [-2.8, 2.8]) {
    cyl(home, 0.36, 0.25, x, -0.31, z, M.rubber)
    screw(home, x, 0.253, z)
  }
  const nameplate = painted(1280, 150, (c, w, h) => {
    c.fillStyle = '#20262d'
    c.fillRect(0, 0, w, h)
    c.strokeStyle = '#4a525b'
    c.lineWidth = 2
    c.strokeRect(2, 2, w - 4, h - 4)
    print(c, 'HARDROCK', 40, 70, 40, '#e2e1df', 650)
    print(c, '·  door  ·  lights  ·  music  ·  climate', 290, 70, 30, '#a9b1ba', 450)
    print(c, 'INTELLIGENT LIVING    /    ONE QUIET SYSTEM', 42, 118, 18, '#6f7a86', 500)
    print(c, 'PERTH', 1135, 116, 22, '#5299d8', 600)
  })
  const np = screen(home, 6.4, 0.75, 1.6, 0.25, 2.95, nameplate)
  np.rotation.x = -Math.PI / 2

  // ---- stations, in the order the arrival plays ----------------------------------------------
  const DEFS = [
    { name: 'Security', pos: [-4.25, 0.29, 0.55] },
    { name: 'Lighting', pos: [-1.45, 0.29, -1.1] },
    { name: 'Entertainment', pos: [1.45, 0.29, 0.55] },
    { name: 'Climate', pos: [4.25, 0.29, -1.1] },
  ]
  const labelsEl = root.querySelector('.sh-labels')
  const stations = DEFS.map((d, i) => {
    const group = new THREE.Group()
    group.position.fromArray(d.pos)
    home.add(group)
    const pad = M.blue.clone()
    pad.emissiveIntensity = 0.3
    box(group, 2.3, 0.12, 1.95, 0, 0.03, 0, M.dark, 0.1)
    box(group, 2.22, 0.03, 1.87, 0, 0.12, 0, pad, 0.09)
    box(group, 2.28, 0.17, 1.92, 0, 0.215, 0, M.body, 0.1)
    for (const x of [-0.95, 0.95]) for (const z of [-0.78, 0.78]) screw(group, x, 0.311, z)
    const plaque = painted(512, 116, (c, w, h) => {
      c.fillStyle = '#141920'
      c.fillRect(0, 0, w, h)
      print(c, String(i + 1).padStart(2, '0'), 24, 76, 42, '#5299d8', 550)
      print(c, d.name.toUpperCase(), 111, 73, 33, '#d7d9d7', 550)
    })
    screen(group, 1.54, 0.345, 0, 0.27, 0.966, plaque)
    const label = document.createElement('div')
    label.className = 'sh-label'
    label.innerHTML = `<span class="sh-n">${String(i + 1).padStart(2, '0')}</span><strong>${d.name}</strong><small></small>`
    labelsEl.appendChild(label)
    cleanups.push(() => label.remove())
    group.traverse((o) => { o.userData.station = i })
    return { ...d, group, pad, label, status: label.querySelector('small'), anchor: new THREE.Vector3(0, 2.75, 0) }
  })

  // 01 Security: a door with a sliding bolt, a keypad screen and a sweeping camera.
  const S = stations[0].group
  box(S, 1.9, 0.36, 1.3, 0, 0.5, -0.05, M.body, 0.08)
  for (const x of [-0.62, 0.62]) box(S, 0.14, 1.7, 0.18, x, 1.53, -0.25, M.ivory, 0.03)
  box(S, 1.38, 0.14, 0.18, 0, 2.43, -0.25, M.ivory, 0.03)
  const hinge = new THREE.Group()
  hinge.position.set(-0.55, 0, -0.25)
  S.add(hinge)
  box(hinge, 1.08, 1.64, 0.07, 0.54, 1.52, 0, M.body, 0.03)
  for (const y of [1.05, 1.95]) box(hinge, 0.84, 0.5, 0.012, 0.54, y, 0.04, M.edge, 0.01)
  cyl(hinge, 0.03, 0.18, 0.97, 1.5, 0.08, M.chrome).rotation.z = Math.PI / 2
  const bolt = box(S, 0.2, 0.05, 0.05, 0.58, 1.5, -0.25, M.chrome, 0.01)
  const lockLed = M.blue.clone()
  const keypad = painted(256, 300, (c, w, h, locked) => {
    c.fillStyle = '#121a20'
    c.fillRect(0, 0, w, h)
    print(c, 'FRONT DOOR', 22, 44, 22, '#9aa6b0', 600)
    print(c, locked ? 'LOCKED' : 'OPEN', 22, 120, 52, locked ? '#5299d8' : '#e8a35f', 650)
    c.fillStyle = '#26323b'
    for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) c.fillRect(22 + k * 74, 160 + r * 44, 62, 34)
  }, true)
  box(S, 0.42, 0.52, 0.06, 0.95, 1.42, -0.12, M.dark, 0.02)
  screen(S, 0.36, 0.44, 0.95, 1.42, -0.087, keypad)
  ball(S, 0.035, 0.95, 1.73, -0.087, lockLed)
  cyl(S, 0.035, 0.8, -0.82, 2.2, 0.55, M.chrome)
  const cam = new THREE.Group()
  cam.position.set(-0.82, 2.62, 0.55)
  S.add(cam)
  box(cam, 0.36, 0.2, 0.2, 0, 0, 0.08, M.ivory, 0.05)
  cyl(cam, 0.07, 0.06, 0, 0, 0.2, M.dark).rotation.x = Math.PI / 2
  const coneMat = new THREE.MeshBasicMaterial({ color: 0x3f8cff, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.DoubleSide })
  const cone = new THREE.Mesh(new THREE.ConeGeometry(0.75, 2.2, 32, 1, true), coneMat)
  cone.rotation.x = -Math.PI / 2 - 0.55
  cone.position.set(0, -0.6, 1.0)
  cam.add(cone)

  // 02 Lighting: a pendant over a console, an LED bar and a dimmer that track the light.
  const L = stations[1].group
  box(L, 1.7, 0.5, 1.2, 0.1, 0.55, 0.05, M.ivory, 0.1)
  cyl(L, 0.06, 2.2, -0.75, 1.4, -0.55, M.chrome)
  box(L, 1.25, 0.08, 0.1, -0.15, 2.48, -0.55, M.chrome, 0.03)
  cyl(L, 0.012, 0.75, 0.42, 2.1, -0.55, M.dark)
  cyl(L, 0.13, 0.36, 0.42, 1.58, -0.55, M.dark, 0.44)
  const bulbMat = M.warm.clone()
  ball(L, 0.13, 0.42, 1.43, -0.55, bulbMat)
  const lamp = new THREE.PointLight(0xffc477, 0, 6, 2)
  lamp.position.set(0.42, 1.3, -0.55)
  L.add(lamp)
  const leds = Array.from({ length: 8 }, (_, k) => {
    const m = M.warm.clone()
    box(L, 0.13, 0.08, 0.04, -0.52 + k * 0.17, 0.62, 0.66, m, 0.015)
    return m
  })
  box(L, 1.3, 0.03, 0.08, 0.1, 0.82, 0.28, M.dark, 0.01)
  const knob = box(L, 0.14, 0.09, 0.16, -0.45, 0.86, 0.28, M.chrome, 0.03)

  // 03 Entertainment: a TV with a live equaliser, speakers that pulse and throw sound rings.
  const E = stations[2].group
  box(E, 1.95, 0.32, 0.9, 0, 0.48, -0.2, M.dark, 0.06)
  cyl(E, 0.05, 0.55, 0, 0.9, -0.35, M.chrome)
  box(E, 1.7, 1.02, 0.08, 0, 1.6, -0.35, M.dark, 0.035)
  const tv = painted(640, 384, (c, w, h, t, on) => {
    if (!on) {
      c.fillStyle = '#0b0f14'
      c.fillRect(0, 0, w, h)
      c.fillStyle = '#d25c2e'
      c.beginPath()
      c.arc(w - 40, h - 36, 7, 0, TAU)
      c.fill()
      return
    }
    const g = c.createLinearGradient(0, 0, w, h)
    g.addColorStop(0, '#0d2340')
    g.addColorStop(1, '#1f64d6')
    c.fillStyle = g
    c.fillRect(0, 0, w, h)
    print(c, 'NOW PLAYING', 34, 52, 20, '#9fc3f0', 600)
    print(c, 'Welcome home', 34, 92, 30, '#f2f2f0', 600)
    for (let k = 0; k < 24; k++) {
      const v = 0.25 + 0.75 * Math.abs(Math.sin(t * 3.1 + k * 0.7) * Math.sin(t * 1.7 + k * 0.33))
      c.fillStyle = k % 5 === 0 ? '#d25c2e' : '#e2e1df'
      c.fillRect(34 + k * 24, 300 - v * 150, 14, v * 150)
    }
    c.fillStyle = '#ffffff33'
    c.fillRect(34, 332, 572, 5)
    c.fillStyle = '#ffffff'
    c.fillRect(34, 332, ((t * 0.04) % 1) * 572, 5)
  }, 0, false)
  screen(E, 1.6, 0.94, 0, 1.6, -0.305, tv)
  const speakers = [-1.0, 1.0].map((x) => {
    box(E, 0.36, 1.05, 0.36, x, 1.06, 0.45, M.body, 0.06)
    const woofer = cyl(E, 0.12, 0.05, x, 1.2, 0.64, M.chrome)
    woofer.rotation.x = Math.PI / 2
    cyl(E, 0.07, 0.05, x, 0.82, 0.64, M.chrome).rotation.x = Math.PI / 2
    const rings = [0, 1, 2].map(() => {
      const m = new THREE.MeshBasicMaterial({ color: 0x3f8cff, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide })
      const r = new THREE.Mesh(cached('ring', () => new THREE.TorusGeometry(0.16, 0.012, 6, 40)), m)
      r.position.set(x, 1.2, 0.68)
      E.add(r)
      return r
    })
    return { woofer, rings }
  })

  // 04 Climate: an AC unit with a fan and airflow, and a thermostat counting to its set point.
  const C = stations[3].group
  box(C, 1.8, 0.42, 1.25, 0, 0.53, -0.05, M.ivory, 0.1)
  const therm = new THREE.Group()
  therm.position.set(-0.42, 1.45, -0.35)
  C.add(therm)
  cyl(therm, 0.46, 0.1, 0, 0, 0, M.body).rotation.x = Math.PI / 2
  therm.add(new THREE.Mesh(new THREE.TorusGeometry(0.47, 0.03, 10, 64), M.chrome))
  const dial = painted(256, 256, (c, w, h, temp, on) => {
    c.fillStyle = '#121a20'
    c.fillRect(0, 0, w, h)
    c.textAlign = 'center'
    print(c, `${temp.toFixed(1)}°`, w / 2, 140, 74, '#e2e1df', 600)
    print(c, on ? 'COOLING · 22°' : 'AC OFF', w / 2, 190, 22, on ? '#5299d8' : '#7f8b96', 600)
    c.textAlign = 'left'
  }, 26, false)
  const dialFace = screen(therm, 0.62, 0.62, 0, 0, 0.056, dial)
  dialFace.geometry.dispose()
  dialFace.geometry = new THREE.CircleGeometry(0.31, 48)
  const setDot = ball(therm, 0.045, 0, 0.47, 0.06, M.signal)
  cyl(C, 0.05, 0.75, -0.42, 0.95, -0.35, M.chrome)
  box(C, 0.85, 0.85, 0.5, 0.45, 1.17, -0.2, M.body, 0.08)
  const grille = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.025, 8, 48), M.chrome)
  grille.position.set(0.45, 1.17, 0.06)
  C.add(grille)
  const fan = new THREE.Group()
  fan.position.set(0.45, 1.17, 0.07)
  C.add(fan)
  for (let k = 0; k < 4; k++) {
    const blade = box(fan, 0.09, 0.3, 0.02, 0, 0.15, 0, M.edge, 0.01)
    blade.position.set(Math.sin((k / 4) * TAU) * 0.15, Math.cos((k / 4) * TAU) * 0.15, 0)
    blade.rotation.z = -(k / 4) * TAU
  }
  cyl(fan, 0.06, 0.05, 0, 0, 0.01, M.chrome).rotation.x = Math.PI / 2
  const airMat = new THREE.MeshBasicMaterial({ color: 0x7fb6ff, transparent: true, opacity: 0, depthWrite: false })
  const air = Array.from({ length: 16 }, () => {
    const m = new THREE.Mesh(cached('air', () => new THREE.SphereGeometry(0.035, 8, 6)), airMat)
    C.add(m)
    return m
  })
  const acLed = M.blue.clone()
  ball(C, 0.035, 0.8, 1.52, 0.06, acLed)

  // ---- the line: one copper run from door to lights to music to climate ----------------------
  const linePts = stations.map((s) => s.group.position.clone().setY(0.36))
  const ends = [
    linePts[0].clone().add(new THREE.Vector3(-1.2, 0, 1.2)),
    ...linePts,
  ]
  const line = new THREE.CatmullRomCurve3(ends, false, 'catmullrom', 0.3)
  const lineMesh = new THREE.Mesh(new THREE.TubeGeometry(line, 160, 0.05, 8, false), M.copper)
  lineMesh.castShadow = true
  home.add(lineMesh)
  // Where each station sits along the line (0..1), for the hand-off pulses.
  const at = stations.map((st) => {
    let best = 0
    let dist = Infinity
    for (let k = 0; k <= 200; k++) {
      const q = line.getPointAt(k / 200)
      const d = (q.x - st.pos[0]) ** 2 + (q.z - st.pos[2]) ** 2
      if (d < dist) { dist = d; best = k / 200 }
    }
    return best
  })
  const pulseMat = M.blue.clone()
  pulseMat.emissiveIntensity = 3
  const wave = Array.from({ length: 3 }, () => ball(home, 0.09, 0, 0, 0, pulseMat))
  const dotMat = M.blue.clone()
  dotMat.emissiveIntensity = 0.8
  const drift = Array.from({ length: 6 }, () => ball(home, 0.05, 0, 0, 0, dotMat))

  // ---- camera, sizing, picking ---------------------------------------------------------------
  const viewDir = new THREE.Vector3(9, 11, 17).normalize()
  const goalPos = new THREE.Vector3()
  const goalTarget = new THREE.Vector3(0, 1, 0)
  let baseDistance = 22
  let width = W()
  let height = H()
  let lastPointer = 0
  let dragging = false
  function layout() {
    if (!W() || !H()) return
    width = W()
    height = H()
    renderer.setSize(width, height)
    camera.aspect = width / height
    const wideFrame = state.current.wide && width > 900
    // Wide frames: shift the frustum so the home sits in the right ~58% and the copy has the left.
    camera.setViewOffset(width, height, wideFrame ? -width * 0.2 : 0, 0, width, height)
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const horiz = 15.5 / (2 * tanHalf * camera.aspect * (wideFrame ? 0.54 : 0.97))
    const vert = 9.5 / (2 * tanHalf * 0.8)
    baseDistance = Math.max(horiz, vert)
    camera.updateProjectionMatrix()
  }
  layout()
  goalPos.copy(viewDir).multiplyScalar(baseDistance).add(goalTarget)
  camera.position.copy(goalPos)
  controls.target.copy(goalTarget)
  controls.update()
  const ro = new ResizeObserver(layout)
  ro.observe(root)
  cleanups.push(() => ro.disconnect())
  controls.addEventListener('start', () => { dragging = true; lastPointer = performance.now() })
  controls.addEventListener('end', () => { dragging = false; lastPointer = performance.now() })

  const raycaster = new THREE.Raycaster()
  const ptr = new THREE.Vector2()
  const pickables = stations.map((s) => s.group)
  const hit = (e) => {
    const r = renderer.domElement.getBoundingClientRect()
    ptr.set(((e.clientX - r.left) / r.width) * 2 - 1, (-(e.clientY - r.top) / r.height) * 2 + 1)
    raycaster.setFromCamera(ptr, camera)
    const h = raycaster.intersectObjects(pickables, true)[0]
    return h ? h.object.userData.station : undefined
  }
  let downAt = null
  listen(renderer.domElement, 'pointerdown', (e) => { downAt = [e.clientX, e.clientY] })
  listen(renderer.domElement, 'pointermove', (e) => {
    renderer.domElement.style.cursor = hit(e) !== undefined ? 'pointer' : 'grab'
  })
  listen(renderer.domElement, 'pointerup', (e) => {
    if (!downAt || Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]) > 6) return
    const i = hit(e)
    if (i !== undefined) state.current.onPick?.(i)
  })

  let visible = true
  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting }, { threshold: 0.01 })
  io.observe(root)
  cleanups.push(() => io.disconnect())

  // ---- animation -----------------------------------------------------------------------------
  const scratch = new THREE.Vector3()
  const centre = new THREE.Vector3(0, 1, 0)
  let t = 0
  let last = performance.now()
  let lastPaint = -1
  let step = -1
  let raf = 0
  function frame(now) {
    raf = requestAnimationFrame(frame)
    const dt = Math.min((now - last) / 1000, 0.05)
    last = now
    if (!visible) return
    if (state.current.jumpTo !== undefined) {
      t = state.current.jumpTo
      state.current.jumpTo = undefined
    }
    t += dt
    const p = t % LOOP
    const ease = 1 - Math.exp(-dt * 4)

    // Which module is in play; report it so the tabs follow.
    const s = STEPS.reduce((k, start, i) => (p >= start ? i : k), 0)
    if (s !== step) {
      step = s
      state.current.onStep?.(s)
    }
    stations.forEach((st, i) => {
      const on = i === s
      st.pad.emissiveIntensity = THREE.MathUtils.lerp(st.pad.emissiveIntensity, on ? 2.6 : 0.3, ease)
      st.label.classList.toggle('on', on)
    })
    // Lean the camera toward the module in play while nobody is dragging.
    if (!dragging && now - lastPointer > 4000) {
      scratch.copy(stations[s].group.position).add(new THREE.Vector3(0, 1, 0))
      goalTarget.copy(centre).lerp(scratch, 0.18)
      goalPos.copy(viewDir).multiplyScalar(baseDistance * 0.92).add(goalTarget)
      camera.position.lerp(goalPos, 1 - Math.exp(-dt * 1.2))
      controls.target.lerp(goalTarget, 1 - Math.exp(-dt * 1.2))
    }
    const off = p > 13.6 // the house powers down before the loop restarts

    // 01 Security: unlock at 0.8 s, door open 1.4–3.6 s, locked again from 13.8 s (and at the start).
    const unlocked = p > 0.8 && p < 13.8
    bolt.position.x = THREE.MathUtils.lerp(bolt.position.x, unlocked ? 0.75 : 0.58, ease * 2)
    const open = window01(p, 1.4, 2.2, 3.0, 3.8)
    hinge.rotation.y = -open * 1.05
    lockLed.color.setHex(unlocked ? 0xe8a35f : 0x3f8cff)
    lockLed.emissive.setHex(unlocked ? 0xe8a35f : 0x3f8cff)
    cam.rotation.y = Math.sin(t * 0.8) * 0.7
    coneMat.opacity = 0.07 + 0.06 * (0.5 + 0.5 * Math.sin(t * 4))
    stations[0].status.textContent = open > 0.05 ? 'Door open · welcome home' : unlocked ? 'Unlocked · you’re in' : 'Armed · locked'

    // 02 Lighting: three blinks as the pulse arrives, then a steady evening scene.
    const blinking = p > 4 && p < 5.2
    const blink = blinking ? (Math.sin((p - 4) * Math.PI * 5) > 0 ? 1 : 0.1) : 0
    const steady = p >= 5.2 && !off ? Math.min(1, (p - 5.2) / 0.6) : 0
    const level = Math.max(blink, steady * 0.85)
    bulbMat.emissiveIntensity = 0.05 + level * 3.2
    lamp.intensity = level * 7
    leds.forEach((m, k) => { m.emissiveIntensity = k < Math.round(level * 8) ? 1.8 : 0.03 })
    knob.position.x = -0.45 + level * 1.1
    stations[1].status.textContent = blinking ? 'Lights on' : level > 0.05 ? `Evening scene · ${Math.round(level * 100)}%` : 'Off'

    // 03 Entertainment: music from 6.5 s, speakers on the beat (120 bpm) throwing rings.
    const playing = p > 6.9 && !off
    const beat = playing ? Math.pow(Math.max(0, Math.sin(t * Math.PI * 2)), 6) : 0
    speakers.forEach(({ woofer, rings }) => {
      woofer.scale.set(1 + beat * 0.25, 1 + beat * 0.6, 1 + beat * 0.25)
      rings.forEach((r, k) => {
        const f = (t * 0.7 + k / 3) % 1
        r.scale.setScalar(1 + f * 3)
        r.position.z = 0.68 + f * 0.6
        r.material.opacity = playing ? (1 - f) * 0.55 : 0
      })
    })
    stations[2].status.textContent = playing ? 'Now playing · Living room' : 'Standby'

    // 04 Climate: the AC comes on at 9 s and pulls the room from 26° down toward 22°.
    const cooling = p > 9.3 && !off
    const run = cooling ? clamp01((p - 9.3) / 1.2) : 0
    const temp = cooling ? 26 - 4 * (1 - Math.exp(-(p - 9.3) / 2.2)) : 26
    fan.rotation.z -= dt * run * (3 + (temp - 22) * 4)
    air.forEach((m, k) => {
      const f = (t * 0.6 + k / air.length) % 1
      m.position.set(0.45 + Math.sin(k * 2.3) * 0.22 * (1 + f), 1.17 + Math.cos(k * 1.7) * 0.18 + f * 0.5, 0.1 + f * 1.3)
      m.scale.setScalar(1 - f * 0.6)
    })
    airMat.opacity = run * 0.6
    acLed.emissiveIntensity = cooling ? 2 : 0.1
    const progress = clamp01((26 - temp) / 4)
    setDot.position.set(Math.sin(progress * TAU * 0.75) * 0.47, Math.cos(progress * TAU * 0.75) * 0.47, 0.06)
    stations[3].status.textContent = cooling ? `AC on · ${temp.toFixed(1)}°C → 22°C` : 'AC off · 26.0°C'

    // The line: a bright hand-off pulse runs to each module as it takes over; dim dots drift.
    const handoffs = [[3.4, 4.0, 0, 1], [5.9, 6.5, 1, 2], [8.4, 9.0, 2, 3]]
    wave.forEach((b) => { b.visible = false })
    handoffs.forEach(([a, b, from, to], k) => {
      if (p < a || p > b) return
      const f = (p - a) / (b - a)
      wave[k].visible = true
      line.getPointAt(THREE.MathUtils.lerp(at[from], at[to], f), wave[k].position)
      wave[k].position.y += 0.06
    })
    drift.forEach((d, k) => {
      line.getPointAt((t * 0.05 + k / drift.length) % 1, d.position)
      d.position.y += 0.05
    })

    // Canvas screens at ~12 fps.
    if (t - lastPaint > 1 / 12) {
      tv.paint(t, playing)
      dial.paint(temp, cooling)
      keypad.paint(!unlocked)
      lastPaint = t
    }

    controls.update(dt)

    // Labels follow their module on screen.
    stations.forEach((st) => {
      scratch.copy(st.group.position).add(st.anchor).project(camera)
      const x = (scratch.x * 0.5 + 0.5) * width
      const y = (-scratch.y * 0.5 + 0.5) * height
      st.label.style.transform = `translate(${Math.round(x)}px, ${Math.round(y)}px) translate(-50%, -100%)`
    })

    renderer.render(scene, camera)
  }
  raf = requestAnimationFrame(frame)
  root.classList.add('sh-ready')

  return () => {
    cancelAnimationFrame(raf)
    for (const fn of cleanups.reverse()) fn()
    controls.dispose()
    const textures = new Set()
    scene.traverse((o) => {
      o.geometry?.dispose()
      const list = o.material ? (Array.isArray(o.material) ? o.material : [o.material]) : []
      for (const m of list) {
        for (const v of Object.values(m)) if (v instanceof THREE.Texture) textures.add(v)
        m.dispose()
      }
    })
    geos.forEach((g) => g.dispose())
    textures.forEach((x) => x.dispose())
    env.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    renderer.domElement.remove()
  }
}
