import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { kilnState, layoutTarget, isDesktop } from '../lib/store'

gsap.registerPlugin(ScrollTrigger)

const STATS = [
  { value: 47, suffix: '', label: 'Pieces fired' },
  { value: 19, suffix: '', label: 'Awards & honors' },
  { value: 98, suffix: '/100', label: 'Avg. Lighthouse score' },
  { value: 6, suffix: 'yrs', label: 'At the forge' },
]

export default function Stats() {
  const rootRef = useRef(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.stat', {
        autoAlpha: 0,
        y: 34,
        duration: 0.85,
        stagger: 0.09,
        ease: 'power3.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 82%', once: true },
      })
      rootRef.current.querySelectorAll('.stat-num').forEach((el) => {
        const target = parseFloat(el.dataset.value)
        const obj = { v: 0 }
        gsap.to(obj, {
          v: target,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          onUpdate: () => {
            el.textContent = String(Math.round(obj.v)).padStart(2, '0')
          },
        })
      })
    }, rootRef)

    /* While proof owns the room, the core recedes to a distant glow. */
    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: parkCore,
      onEnterBack: parkCore,
    })

    return () => {
      ctx.revert()
      st.kill()
    }
  }, [])

  return (
    <section className="stats section-pad" ref={rootRef}>
      <p className="mono-label section-tag">Proof, not promises</p>
      <ul className="stats-grid">
        {STATS.map((s) => (
          <li className="stat" key={s.label}>
            <span className="stat-line">
              <span className="stat-num" data-value={s.value}>
                00
              </span>
              {s.suffix && <span className="stat-suffix">{s.suffix}</span>}
            </span>
            <span className="mono-label stat-label">{s.label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function parkCore() {
  kilnState.chapter = 5
  layoutTarget.x = isDesktop() ? -1.9 : 0
  layoutTarget.y = 0.2
  layoutTarget.scale = 0.55
}
