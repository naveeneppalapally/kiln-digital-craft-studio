import React from 'react'

const WORDS = [
  'WebGL',
  'Creative Engineering',
  'Motion',
  'Commerce',
  'Spatial UI',
  'Performance',
]

/** Infinite capability marquee — pure CSS loop, duplicated row for seamlessness. */
export default function Marquee() {
  const row = (hidden) => (
    <div className="marquee-row" aria-hidden={hidden || undefined}>
      {WORDS.map((w, i) => (
        <React.Fragment key={w}>
          <span className={`marquee-word${i % 2 ? ' outline' : ''}`}>{w}</span>
          <span className="marquee-sep">✦</span>
        </React.Fragment>
      ))}
    </div>
  )

  return (
    <div className="marquee" aria-label="Capabilities ticker">
      <div className="marquee-track">
        {row(false)}
        {row(true)}
      </div>
    </div>
  )
}
