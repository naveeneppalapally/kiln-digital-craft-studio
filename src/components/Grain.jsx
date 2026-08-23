import React from 'react'

const NOISE_SVG = encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>" +
    "<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/>" +
    "<feColorMatrix type='saturate' values='0'/></filter>" +
    "<rect width='160' height='160' filter='url(#n)' opacity='0.55'/></svg>",
)

/** Animated film-grain veil over the whole experience. */
export default function Grain() {
  return (
    <div
      className="grain"
      aria-hidden="true"
      style={{ backgroundImage: `url("data:image/svg+xml,${NOISE_SVG}")` }}
    />
  )
}
