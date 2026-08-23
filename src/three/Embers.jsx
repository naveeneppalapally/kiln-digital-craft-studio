import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { scrollState, device } from '../lib/store'

function makeSpriteTexture() {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  grad.addColorStop(0, 'rgba(255,196,130,1)')
  grad.addColorStop(0.35, 'rgba(255,110,30,0.6)')
  grad.addColorStop(1, 'rgba(255,80,0,0)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function seedEmber(arr, i, initial) {
  const r = 1.9 + Math.random() * 5.4
  const a = Math.random() * Math.PI * 2
  arr[i * 3 + 0] = Math.cos(a) * r
  arr[i * 3 + 1] = initial ? Math.random() * 11 - 5 : -5.5 - Math.random() * 1.5
  arr[i * 3 + 2] = Math.sin(a) * r * 0.6
}

/** Rising ember particles — they surge upward when you scroll fast. */
export default function Embers() {
  const COUNT = device.touch ? 70 : 170
  const pointsRef = useRef(null)
  const texture = useMemo(makeSpriteTexture, [])

  const data = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)
    const seeds = new Float32Array(COUNT)
    for (let i = 0; i < COUNT; i++) {
      seedEmber(positions, i, true)
      speeds[i] = 0.25 + Math.random() * 0.75
      seeds[i] = Math.random() * Math.PI * 2
    }
    return { positions, speeds, seeds }
  }, [COUNT])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame((state, delta) => {
    const pts = pointsRef.current
    if (!pts) return
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    const boost = Math.min(Math.abs(scrollState.velocity) * 0.02, 2.4)
    const attr = pts.geometry.attributes.position

    for (let i = 0; i < COUNT; i++) {
      let y = attr.array[i * 3 + 1] + dt * (data.speeds[i] * 0.65 + boost)
      if (y > 6.5) {
        seedEmber(attr.array, i, false)
        y = attr.array[i * 3 + 1]
      }
      attr.array[i * 3 + 1] = y
      attr.array[i * 3 + 0] += Math.sin(t * 0.5 + data.seeds[i]) * dt * 0.12
    }
    attr.needsUpdate = true
    pts.rotation.y = t * 0.02
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[data.positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.075}
        map={texture}
        color="#ffb27a"
        transparent
        opacity={0.85}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  )
}
