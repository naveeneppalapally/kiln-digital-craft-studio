import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { kilnState, layoutTarget, isDesktop } from '../lib/store'

gsap.registerPlugin(ScrollTrigger)

const STEPS = [
  {
    n: '01',
    title: 'EXCAVATE',
    copy: 'Two weeks inside your business before a single pixel. Stakeholder interviews, technical archaeology, competitor forensics. We leave with the constraint nobody wrote down.',
  },
  {
    n: '02',
    title: 'MOULD',
    copy: 'Prototypes over presentations. The design system and motion language take shape on the wheel — tested on real devices while other studios are still scheduling kickoffs.',
  },
  {
    n: '03',
    title: 'FIRE',
    copy: 'Shaders, physics, render budgets, sixty frames under load. This is the part most studios outsource. We have been firing this kiln for six years.',
  },
  {
    n: '04',
    title: 'TEMPER',
    copy: 'Forty device profiles. Accessibility audits. Failure-mode testing that other studios discover in production — so that you never do.',
  },
  {
    n: '05',
    title: 'REVEAL',
    copy: 'Launch is a premiere, not a handoff. Staged rollout, analytics wired before day one, and a team that stays in the room for the applause.',
  },
]

/**
 * The Firing — a pinned five-chapter sequence. As you scrub through it,
 * the kiln core morphs through each chapter's palette and turbulence
 * (chapters 1..5 map straight onto kilnState.chapter).
 */
export default function Process() {
  const rootRef = useRef(null)
  const stageRef = useRef(null)
  const barRef = useRef(null)
  const lastIdx = useRef(-1)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top top',
        end: '+=320%',
        pin: true,
        scrub: true,
        anticipatePin: 1,
        onUpdate: (self) => {
          kilnState.chapter = 1 + self.progress * (STEPS.length - 1)
          layoutTarget.x = isDesktop() ? 1.55 : 0
          layoutTarget.y = isDesktop() ? 0 : 0.95
          layoutTarget.scale = isDesktop() ? 0.92 : 0.5
          if (barRef.current) {
            barRef.current.style.transform = `scaleX(${self.progress})`
          }
          const idx = Math.min(
            STEPS.length - 1,
            Math.floor(self.progress * STEPS.length),
          )
          if (idx !== lastIdx.current) {
            lastIdx.current = idx
            setActive(idx)
          }
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="process" id="process" ref={rootRef}>
      <div className="process-stage" ref={stageRef}>
        <div className="process-inner">
          <p className="mono-label section-tag">03 — The firing</p>

          <div className="process-steps">
            {STEPS.map((s, i) => (
              <article key={s.n} className={`process-step${i === active ? ' active' : ''}`}>
                <span className="process-num">{s.n}</span>
                <h3 className="process-title">{s.title}</h3>
                <p className="process-copy">{s.copy}</p>
              </article>
            ))}
          </div>

          <div className="process-hud">
            <span className="mono-label">
              {String(active + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
            </span>
            <div className="process-bar">
              <span ref={barRef} />
            </div>
            <span className="mono-label">KEEP SCROLLING</span>
          </div>
        </div>
      </div>
    </section>
  )
}
