import React from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import KilnCore from './KilnCore.jsx'
import Embers from './Embers.jsx'
import Rig from './Rig.jsx'
import { device } from '../lib/store'

/**
 * The single persistent WebGL stage. It sits FIXED behind the entire
 * document (pointer-events: none) and is choreographed purely through
 * the shared store — one context, zero re-mounts, cheap frames.
 */
export default function Experience() {
  return (
    <div className="canvas-stage" aria-hidden="true">
      <Canvas
        dpr={[1, device.touch ? 1.5 : 1.75]}
        camera={{ fov: 42, near: 0.1, far: 60, position: [0, 0, 7] }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
      >
        <fog attach="fog" args={['#0b0907', 10, 20]} />
        <Rig>
          <KilnCore />
          <Embers />
        </Rig>
        <EffectComposer multisampling={device.touch ? 0 : 4}>
          <Bloom
            mipmapBlur
            intensity={0.95}
            luminanceThreshold={0.38}
            luminanceSmoothing={0.22}
          />
          <Noise
            premultiply
            opacity={device.touch ? 0.07 : 0.1}
            blendFunction={BlendFunction.OVERLAY}
          />
          <Vignette offset={0.22} darkness={0.72} eskil={false} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
