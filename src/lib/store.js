import React from 'react'

/**
 * KILN® — shared mutable state.
 *
 * Values here are read inside requestAnimationFrame loops (Three.js, cursors,
 * previews) and mutated by GSAP ScrollTriggers. Keeping them OUTSIDE React
 * means 60fps motion never triggers a re-render.
 */

export const scrollState = {
  hero: 0, // 0..1 progress through the hero viewport
  page: 0, // 0..1 progress through the entire document
  velocity: 0, // smoothed Lenis scroll velocity
}

/** Drives the kiln core's shader mood. */
export const kilnState = {
  chapter: 0, // float 0..5 — 0 Ignition · 1 Excavate · 2 Mould · 3 Fire · 4 Temper · 5 Reveal
}

/** Where the 3D core should sit in world units (lerped every frame in Rig). */
export const layoutTarget = { x: 0, y: 0, scale: 1 }

/** Normalized pointer, -1..1 (updated on window mousemove). */
export const pointer = { x: 0, y: 0 }

export const device = {
  touch:
    typeof window !== 'undefined' &&
    (window.matchMedia('(hover: none)').matches ||
      window.matchMedia('(pointer: coarse)').matches),
  reduced:
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
}

export function isDesktop() {
  return typeof window !== 'undefined' && window.innerWidth >= 1024
}
