import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const CAPABILITIES = [
  { name: 'Real-time 3D & WebGL', note: 'Configurators, twins, point clouds' },
  { name: 'Creative Engineering', note: 'Where design meets production code' },
  { name: 'Spatial Interfaces', note: 'Depth, physics and presence on the web' },
  { name: 'Commerce Systems', note: 'Headless builds engineered to convert' },
  { name: 'Identity Systems', note: 'Brands built screen-first' },
  { name: 'Performance Engineering', note: 'Sixty frames is a budget, not a wish' },
]

export default function Capabilities() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.cap-row', {
        autoAlpha: 0,
        y: 30,
        duration: 0.7,
        stagger: 0.07,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 78%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="capabilities section-pad" ref={rootRef}>
      <div className="cap-head">
        <p className="mono-label section-tag">04 — Capabilities</p>
        <h2 className="section-title">
          Everything a launch needs,<br />
          under one roof.
        </h2>
      </div>
      <ul className="cap-list">
        {CAPABILITIES.map((c, i) => (
          <li className="cap-row" key={c.name} data-cursor="link">
            <span className="mono-label cap-idx">{String(i + 1).padStart(2, '0')}</span>
            <span className="cap-name">{c.name}</span>
            <span className="mono-label cap-note">{c.note}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}
