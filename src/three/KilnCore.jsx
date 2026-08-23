import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { kilnVertex, kilnFragment } from './shaders/kiln.glsl.js'
import { kilnState, scrollState, device } from '../lib/store'

/* Chapter moods — 0 Ignition · 1 Excavate · 2 Mould · 3 Fire · 4 Temper · 5 Reveal */
const PALETTE = [
  { deep: '#17100b', mid: '#ff4d00', hot: '#ffc46b', heat: 1.0, amp: 0.42 },
  { deep: '#241a12', mid: '#b06a3f', hot: '#e8b98a', heat: 0.55, amp: 0.3 },
  { deep: '#101820', mid: '#274b63', hot: '#9fd0e8', heat: 0.45, amp: 0.34 },
  { deep: '#1c0a05', mid: '#ff3b00', hot: '#ffd166', heat: 1.35, amp: 0.62 },
  { deep: '#0d1020', mid: '#4a5fd0', hot: '#bcd0ff', heat: 0.7, amp: 0.26 },
  { deep: '#201808', mid: '#ffb347', hot: '#fff3d6', heat: 0.7, amp: 0.4 },
]

const tmpA = new THREE.Color()
const tmpB = new THREE.Color()

/** Interpolate any palette channel along the continuous chapter float. */
function sampleChannel(channel, f, into = null) {
  const i0 = Math.floor(f)
  const i1 = Math.min(i0 + 1, PALETTE.length - 1)
  const t = f - i0
  if (into) {
    return into.set(PALETTE[i0][channel]).lerp(tmpB.set(PALETTE[i1][channel]), t)
  }
  return THREE.MathUtils.lerp(PALETTE[i0][channel], PALETTE[i1][channel], t)
}

/**
 * KilnCore — the molten centerpiece.
 * A high-density icosphere displaced by two octaves of simplex noise,
 * colored by a heat-ramped palette that morphs with the story chapters.
 */
export default function KilnCore() {
  const mesh = useRef(null)

  const geometry = useMemo(
    () => new THREE.IcosahedronGeometry(1.45, device.touch ? 32 : 64),
    [],
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: PALETTE[0].amp },
      uFreq: { value: 1.15 },
      uHeat: { value: PALETTE[0].heat },
      uColorDeep: { value: new THREE.Color(PALETTE[0].deep) },
      uColorMid: { value: new THREE.Color(PALETTE[0].mid) },
      uColorHot: { value: new THREE.Color(PALETTE[0].hot) },
    }),
    [],
  )

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05)
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t

    const ch = THREE.MathUtils.clamp(kilnState.chapter, 0, PALETTE.length - 1)
    uniforms.uColorDeep.value.copy(sampleChannel('deep', ch, tmpA))
    uniforms.uColorMid.value.copy(sampleChannel('mid', ch, tmpA))
    uniforms.uColorHot.value.copy(sampleChannel('hot', ch, tmpA))

    /* Scroll velocity stokes the fire; chapters retune base turbulence. */
    const velBoost = Math.min(Math.abs(scrollState.velocity) * 0.014, 0.55)
    const heatT = sampleChannel('heat', ch)
    const ampT = sampleChannel('amp', ch) + velBoost

    const k = 1 - Math.exp(-dt * 3.5)
    uniforms.uHeat.value += (heatT - uniforms.uHeat.value) * k
    uniforms.uAmp.value += (ampT - uniforms.uAmp.value) * k

    mesh.current.rotation.y += dt * 0.08
    mesh.current.rotation.z = Math.sin(t * 0.12) * 0.06
  })

  return (
    <mesh ref={mesh} geometry={geometry}>
      <shaderMaterial
        args={[
          {
            uniforms,
            vertexShader: kilnVertex,
            fragmentShader: kilnFragment,
          },
        ]}
      />
    </mesh>
  )
}
