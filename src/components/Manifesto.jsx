import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Words, wordsIn } from '../lib/split'

gsap.registerPlugin(ScrollTrigger)

export default function Manifesto() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        wordsIn(rootRef.current),
        { opacity: 0.13 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: {
            trigger: rootRef.current,
            start: 'top 78%',
            end: 'bottom 48%',
            scrub: 0.6,
          },
        },
      )
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="manifesto section-pad" id="studio" ref={rootRef}>
      <p className="mono-label section-tag">01 — Manifesto</p>
      <p className="manifesto-text">
        <Words text="Engineers who studied typography. Designers who ship shaders. Architecture taught us the only rule that matters: structure decides whether beauty survives contact with reality. So we engineer the skeleton first — render budgets, data flow, physics — then pour the beauty in. Everything we ship is load-bearing." />
      </p>
    </section>
  )
}
