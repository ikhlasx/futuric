import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PMREMGenerator, Vector3 } from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { ventures } from '../lib/content'

const clamp01 = (v) => Math.min(1, Math.max(0, v))
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const lerp = (a, b, t) => a + (b - a) * t

const H = 0.54 // slab height; five stacked make the Core
const anchor = new Vector3()

// Studio reflections generated from three's built-in room, so nothing is downloaded.
function Studio() {
  const { gl, scene } = useThree()
  useEffect(() => {
    const pmrem = new PMREMGenerator(gl)
    const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    scene.environment = env
    return () => { scene.environment = null; env.dispose(); pmrem.dispose() }
  }, [gl, scene])
  return null
}

// One venture slab. `progress` (0–1, from the scroll) turns the Core, then pulls the slabs apart.
function Slab({ i, progress, tag, geometry }) {
  const group = useRef(null)
  const { viewport, camera, size } = useThree()

  useFrame(() => {
    const p = progress.current
    const turn = ease(clamp01(p / 0.35))
    const split = ease(clamp01((p - 0.3) / 0.6))
    const k = i - 2
    const narrow = viewport.width < viewport.height
    const stackY = -k * H

    // Phones get a smaller Core so the split fits between the nav and the headline.
    const base = narrow ? Math.min(0.62, viewport.width / 3.1) : 1
    let x, y
    if (narrow) {
      // Phones: the slabs fan out vertically.
      x = (k % 2 ? 0.34 : -0.34) * split * base
      y = stackY * lerp(1, 1.42, split) * base + 0.12
    } else {
      const spread = Math.min(1.45, viewport.width / 5.4)
      x = k * spread * split
      y = lerp(stackY, k % 2 ? -0.22 : 0.16, split)
    }

    const g = group.current
    g.position.set(x, y, 0)
    g.rotation.set(lerp(0.08, k % 2 ? 0.1 : -0.06, split), lerp(-0.6, 0.35, turn) - 0.35 * split, k * 0.05 * split)
    g.scale.setScalar(base * lerp(1, 0.88, split))

    // Pin the DOM label under the slab.
    const el = tag.current
    if (!el) return
    anchor.set(0, -H * 0.8, 0)
    g.localToWorld(anchor)
    anchor.project(camera)
    el.style.transform = `translate(${((anchor.x + 1) / 2) * size.width}px, ${((1 - anchor.y) / 2) * size.height}px) translate(-50%, 0)`
    el.style.opacity = String(clamp01((split - 0.55) / 0.3 - i * 0.04))
  })

  return (
    <group ref={group}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#3b3f47" metalness={0.86} roughness={0.3} />
      </mesh>
      {[0, 1, 2, 3, 4].map((j) => (
        <mesh key={j} position={[-0.06, 0.1 - j * 0.05, 0.362]}>
          <boxGeometry args={[0.72, 0.012, 0.004]} />
          <meshStandardMaterial color="#14161a" roughness={0.9} />
        </mesh>
      ))}
      {i === 4 && (
        <mesh position={[-0.42, -0.17, 0.362]}>
          <circleGeometry args={[0.02, 24]} />
          <meshBasicMaterial color="#5299d8" toneMapped={false} />
        </mesh>
      )}
    </group>
  )
}

export default function CoreScene({ progress, active = true }) {
  const tags = useRef(ventures.map(() => ({ current: null })))
  const geometry = useMemo(() => new RoundedBoxGeometry(1.12, H - 0.01, 0.72, 4, 0.035), [])

  return (
    <div className="core-scene">
      <Canvas
        frameloop={active ? 'always' : 'never'}
        dpr={[1, 2]}
        camera={{ position: [0, 0.1, 8.6], fov: 30 }}
        gl={{ antialias: true, alpha: true }}
      >
        <Studio />
        <ambientLight intensity={0.15} />
        <directionalLight position={[3, 4, 5]} intensity={0.9} />
        <directionalLight position={[-5, -1, 2]} intensity={0.8} color="#5299d8" />
        <group position={[0, 0.42, 0]}>
          {ventures.map((v, i) => <Slab key={v.id} i={i} progress={progress} tag={tags.current[i]} geometry={geometry} />)}
        </group>
      </Canvas>
      {ventures.map((v, i) => (
        <div key={v.id} ref={(el) => { tags.current[i].current = el }} className="core-tag" style={{ opacity: 0 }}>
          {v.name}<small>{v.field}</small>
        </div>
      ))}
    </div>
  )
}
