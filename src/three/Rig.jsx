import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { pointer, layoutTarget, scrollState } from '../lib/store'

/**
 * Rig — the choreography layer.
 *
 * Every frame it eases the whole scene group toward `layoutTarget`
 * (set by whichever section owns the viewport) and adds pointer tilt +
 * scroll-depth drift. Sections never touch Three.js objects directly;
 * they just declare intent. That keeps 3D and DOM fully decoupled.
 */
export default function Rig({ children }) {
  const group = useRef(null)
  const cur = useRef(null)

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    if (!cur.current) {
      cur.current = { ...layoutTarget }
    }

    const kLayout = 1 - Math.exp(-dt * 4.5)
    const kPointer = 1 - Math.exp(-dt * 7)

    cur.current.x += (layoutTarget.x - cur.current.x) * kLayout
    cur.current.y += (layoutTarget.y - cur.current.y) * kLayout
    cur.current.scale += (layoutTarget.scale - cur.current.scale) * kLayout

    const g = group.current
    g.position.x = cur.current.x
    g.position.y = cur.current.y + pointer.y * 0.14
    g.position.z = -scrollState.page * 2.4 // slow recede as you descend
    g.scale.setScalar(cur.current.scale)

    g.rotation.y += (pointer.x * 0.38 - g.rotation.y) * kPointer
    g.rotation.x += (-pointer.y * 0.24 - g.rotation.x) * kPointer
  })

  return <group ref={group}>{children}</group>
}
