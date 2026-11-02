// RobotHero — adapted from the 21st.dev "robot-hero" component for this Vite project.
// Kept: a procedural robot built from lathes and primitives, and its cursor behaviour: the body
// drifts toward the pointer and the head turns to look at it.
// Changed for Futuric: plain JS (no TypeScript, Tailwind, framer-motion or drei); the robot is
// the Futuric design (square armoured helmet with a gloss visor in a dark-silver frame and a
// cyan light line, armoured shoulders and arms with cyan accents, embossed FUTURIC chest mark);
// reflections come from three's built-in RoomEnvironment (nothing downloaded); the pointer is
// read from the window so text over the canvas doesn't block it; touch screens get a slow sway.

import { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// Fine speckled shell texture, as in the original component.
function makeShellTextures() {
  const size = 512
  const cc = document.createElement('canvas')
  const cb = document.createElement('canvas')
  cc.width = cb.width = cc.height = cb.height = size
  const c = cc.getContext('2d')
  const b = cb.getContext('2d')
  c.fillStyle = '#26292f'
  c.fillRect(0, 0, size, size)
  b.fillStyle = '#808080'
  b.fillRect(0, 0, size, size)
  for (let i = 0; i < 9000; i++) {
    const x = Math.random() * size
    const y = Math.random() * size
    const r = 0.5 + Math.random() * 1.2
    const dark = Math.random() > 0.5
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = dark ? '#1c1f24' : '#30343b'; c.fill()
    b.beginPath(); b.arc(x, y, r, 0, Math.PI * 2); b.fillStyle = dark ? '#000' : '#fff'; b.fill()
  }
  const color = new THREE.CanvasTexture(cc)
  const bump = new THREE.CanvasTexture(cb)
  for (const t of [color, bump]) {
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    t.repeat.set(6, 3)
  }
  color.colorSpace = THREE.SRGBColorSpace
  return { color, bump }
}

function Studio() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => { scene.environment = null; env.dispose(); pmrem.dispose() }
  }, [gl, scene])
  return null
}

// The client's embossed FUTURIC logo on the chest: white letters with a dark edge, used as-is.
function ChestMark({ y = 0.26, z = 0.32 }) {
  const tex = useLoader(THREE.TextureLoader, '/futuric-logo-emboss.png')
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  const w = 0.26
  return (
    <mesh position={[0, y, z]} rotation={[-0.12, 0, 0]}>
      <planeGeometry args={[w, (w * 106) / 891]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

// Rounded-box parts of the square helmet and armour, built once.
const box = (w, h, d, r) => new RoundedBoxGeometry(w, h, d, 4, r)
const HELMET = {
  shell: box(0.5, 0.6, 0.52, 0.09),
  frame: box(0.43, 0.47, 0.06, 0.05),
  visor: box(0.37, 0.41, 0.06, 0.045),
  crest: box(0.16, 0.06, 0.46, 0.025),
  cheek: box(0.05, 0.38, 0.4, 0.022),
  jaw: box(0.4, 0.07, 0.36, 0.03),
}
// The same rounded-box language for the shoulders and arms.
const ARMOUR = {
  pauldron: box(0.3, 0.13, 0.4, 0.045),
  arm: box(0.2, 1.06, 0.25, 0.05),
}

const v2 = (pts) => pts.map(([x, y]) => new THREE.Vector2(x, y))

function Robot({ pointer, reduced }) {
  const body = useRef(null)
  const head = useRef(null)
  const { viewport } = useThree()
  const [tex] = useState(makeShellTextures)
  useEffect(() => () => { tex.color.dispose(); tex.bump.dispose() }, [tex])

  // Satin black under-suit, gloss black armour, dark-silver trim, cyan light.
  const satin = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff', map: tex.color, bumpMap: tex.bump, bumpScale: 0.003, roughness: 0.5, metalness: 0.5, envMapIntensity: 0.9,
  }), [tex])
  const gloss = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#050505', roughness: 0.08, metalness: 0.35, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.4,
  }), [])
  const trim = useMemo(() => new THREE.MeshStandardMaterial({ color: '#7d838d', metalness: 0.95, roughness: 0.25, envMapIntensity: 1.4 }), [])
  // Partial lathes show their inside from the front, so the chest plate renders both faces.
  const plateMat = useMemo(() => { const m = gloss.clone(); m.side = THREE.DoubleSide; return m }, [gloss])
  // A human bust turned on a lathe, then flattened front to back.
  const torso = useMemo(() => v2([
    [0.0, 0.37], [0.17, 0.37], [0.34, 0.31], [0.45, 0.2], [0.5, 0.05], [0.49, -0.2], [0.44, -0.6], [0.42, -1.1], [0.0, -1.1],
  ]), [])
  // The chest plate: the same profile, a touch proud of the suit, front only.
  const plate = useMemo(() => v2([[0.3, 0.33], [0.43, 0.21], [0.49, 0.05], [0.48, -0.2], [0.44, -0.55]]), [])
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0b0d10', roughness: 0.05, metalness: 0.6, clearcoat: 1 }), [])
  const glow = useMemo(() => new THREE.MeshBasicMaterial({ color: '#3fe3ec', toneMapped: false }), [])

  useFrame((state, delta) => {
    if (!body.current || !head.current) return
    const dt = Math.min(delta, 0.1)
    const p = pointer.current
    // Without a recent pointer (touch screens, or the visitor not moving), sway slowly.
    const idle = performance.now() - p.t > 2500
    const time = state.clock.getElapsedTime()
    const tx = idle ? Math.sin(time * 0.4) * 0.35 : p.x
    const ty = idle ? Math.sin(time * 0.27) * 0.12 : p.y
    const k = reduced ? 0.4 : 1

    const maxMove = viewport.width / 9
    body.current.position.x = THREE.MathUtils.lerp(body.current.position.x, tx * maxMove, 0.35 * dt * k)
    const rel = tx - body.current.position.x / 2.5
    body.current.rotation.y = THREE.MathUtils.lerp(body.current.rotation.y, -rel * 0.55, 6 * dt * k)
    body.current.rotation.x = THREE.MathUtils.lerp(body.current.rotation.x, -ty * 0.12, 6 * dt * k)
    body.current.rotation.z = THREE.MathUtils.lerp(body.current.rotation.z, -rel * 0.08, 6 * dt * k)
    head.current.rotation.y = THREE.MathUtils.lerp(head.current.rotation.y, rel * 1.2, 10 * dt * k)
    head.current.rotation.x = THREE.MathUtils.lerp(head.current.rotation.x, -ty * 0.35, 10 * dt * k)
  })

  return (
    <group ref={body} position={[0, -0.3, 0]}>
      {/* rounded torso and gloss chest plate */}
      <mesh material={satin} scale={[1.22, 1, 0.62]}>
        <latheGeometry args={[torso, 96]} />
      </mesh>
      <mesh material={plateMat} scale={[1.25, 1, 0.66]}>
        <latheGeometry args={[plate, 64, -0.62, 1.24]} />
      </mesh>
      {/* cyan strip across the chest and two curved accents low on the sides */}
      <mesh material={glow} position={[0, -0.09, 0.322]}>
        <boxGeometry args={[0.15, 0.011, 0.006]} />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh key={side} material={glow} position={[side * 0.3, -0.52, 0.255]} rotation={[0, side * 0.55, side * 0.42]}>
          <boxGeometry args={[0.01, 0.24, 0.006]} />
        </mesh>
      ))}
      <ChestMark y={0.26} z={0.33} />
      <mesh material={trim} position={[0, 0.37, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.125, 0.016, 16, 48]} />
      </mesh>

      {/* square shoulder plates over square arms: one gloss black piece per side, the arm rising
          up under the plate so no gap shows; a cyan line runs down the front-outer edge */}
      {[-1, 1].map((side) => (
        <group key={side}>
          <group position={[side * 0.5, 0.27, 0]} rotation={[0, 0, side * -0.16]}>
            <mesh material={gloss} geometry={ARMOUR.pauldron} />
          </group>
          <mesh material={gloss} geometry={ARMOUR.arm} position={[side * 0.565, -0.3, 0]} />
          <mesh material={glow} position={[side * (0.565 + 0.068), -0.1, 0.124]}>
            <boxGeometry args={[0.008, 0.26, 0.004]} />
          </mesh>
        </group>
      ))}

      {/* slender neck */}
      <mesh material={satin} position={[0, 0.47, 0]}>
        <cylinderGeometry args={[0.078, 0.095, 0.24, 32]} />
      </mesh>

      {/* the Futuric helmet: square armoured shell, gloss visor in a dark-silver frame, cyan line */}
      <group ref={head} position={[0, 0.8, 0]}>
        <mesh material={satin} geometry={HELMET.shell} />
        <mesh material={trim} geometry={HELMET.frame} position={[0, 0.02, 0.24]} />
        <mesh material={gloss} geometry={HELMET.visor} position={[0, 0.02, 0.262]} />
        <mesh material={glow} position={[0, 0.03, 0.293]}>
          <boxGeometry args={[0.009, 0.24, 0.004]} />
        </mesh>
        {/* armour: a raised crest over the top, plates on the cheeks, a heavy jaw */}
        <mesh material={trim} geometry={HELMET.crest} position={[0, 0.305, -0.01]} />
        {[-1, 1].map((side) => (
          <mesh key={side} material={gloss} geometry={HELMET.cheek} position={[side * 0.262, -0.03, -0.01]} />
        ))}
        <mesh material={gloss} geometry={HELMET.jaw} position={[0, -0.285, 0.03]} />
        {/* chin sensors */}
        {[-1, 1].map((side) => (
          <mesh key={side} material={glass} position={[side * 0.075, -0.262, 0.215]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.02, 24]} />
          </mesh>
        ))}
        <mesh material={glass} position={[0, -0.262, 0.218]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.011, 0.011, 0.02, 16]} />
        </mesh>
      </group>
    </group>
  )
}

export function RobotHero({ className = '', scale = 1, active = true, reduced = false }) {
  // Pointer in -1..1 across the window, plus the time it last moved.
  const pointer = useRef({ x: 0, y: 0, t: -1e9 })

  useEffect(() => {
    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      pointer.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -((e.clientY / window.innerHeight) * 2 - 1),
        t: performance.now(),
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  return (
    <div className={`robot-hero ${className}`.trim()}>
      <Canvas frameloop={active ? 'always' : 'never'} dpr={[1, 2]} camera={{ position: [0, 0.2, 6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
        <Studio />
        <ambientLight intensity={0.35} />
        <directionalLight position={[2, 4, 5]} intensity={1.2} />
        {/* blue and cyan rim lights from behind outline the black robot against the night */}
        <directionalLight position={[-4, 2, -3]} intensity={2.4} color="#5299d8" />
        <directionalLight position={[4, 1, -3]} intensity={1.8} color="#5fd6df" />
        <Fit scale={scale}>
          <Robot pointer={pointer} reduced={reduced} />
        </Fit>
      </Canvas>
    </div>
  )
}

// Bust framing: the robot fills the hero from the chest up at any aspect ratio.
function Fit({ children, scale }) {
  const { viewport } = useThree()
  const narrow = viewport.width < viewport.height
  const s = (narrow ? viewport.width / 2.5 : Math.min(viewport.height / 2.15, viewport.width / 2.1)) * scale
  return <group scale={s} position={[0, -viewport.height * (narrow ? 0.1 : 0.2), 0]}>{children}</group>
}

export default RobotHero
