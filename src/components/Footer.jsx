import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitLines, charsIn } from '../lib/split'
import { kilnState, layoutTarget, isDesktop } from '../lib/store'
import { scrollToTarget } from '../lib/lenis'
import { useMagnetic } from '../lib/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

const SOCIALS = ['Instagram', 'X / Twitter', 'Are.na', 'GitHub']

function StudioClock() {
  const [time, setTime] = useState('--:--:--')

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'Europe/Lisbon',
    })
    const tick = () => setTime(fmt.format(new Date()))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="mono-label">
      {time} — LISBON (WET)
    </span>
  )
}

export default function Footer() {
  const rootRef = useRef(null)
  const mailRef = useMagnetic(0.3)

  /* Park the core dead-center and gilt it for the finale. */
  useEffect(() => {
    const centerCore = () => {
      kilnState.chapter = 5
      layoutTarget.x = 0
      layoutTarget.y = -0.3
      layoutTarget.scale = isDesktop() ? 1.02 : 0.78
    }
    const st = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top 70%',
      end: 'bottom bottom',
      onEnter: centerCore,
      onEnterBack: centerCore,
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(charsIn(rootRef.current), {
        yPercent: 118,
        rotateZ: 4,
        duration: 1.05,
        stagger: 0.02,
        ease: 'power4.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 72%', once: true },
      })
      gsap.from('.footer-meta > *, .footer-mail-wrap', {
        autoAlpha: 0,
        y: 26,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.footer-meta', start: 'top 92%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <footer className="footer section-pad" id="contact" ref={rootRef}>
      <p className="mono-label section-tag">05 — Commissions open</p>

      <h2 className="footer-title" aria-label="Let's fire something unbreakable">
        <SplitLines lines={['LET’S FIRE']} ariaHidden="true" />
        <SplitLines lines={['SOMETHING']} ariaHidden="true" />
        <SplitLines lines={['UNBREAKABLE.']} className="footer-title-accent" ariaHidden="true" />
      </h2>

      <div className="footer-mail-wrap">
        <a ref={mailRef} className="footer-mail" href="mailto:hello@kiln.studio" data-cursor="link">
          hello@kiln.studio
          <span className="footer-mail-line" aria-hidden="true" />
        </a>
      </div>

      <div className="footer-meta">
        <div className="footer-col">
          <p className="mono-label footer-col-tag">Studio</p>
          <p>
            Rua da Prata 14, 2º<br />
            1100-052 Lisboa<br />
            Portugal
          </p>
        </div>
        <div className="footer-col">
          <p className="mono-label footer-col-tag">Elsewhere</p>
          <ul className="footer-socials">
            {SOCIALS.map((s) => (
              <li key={s}>
                <a href="#contact" data-cursor="link" onClick={(e) => e.preventDefault()}>
                  {s} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="footer-col">
          <p className="mono-label footer-col-tag">Local time</p>
          <StudioClock />
          <p className="footer-status">● Currently booking Q3 2025</p>
        </div>
      </div>

      <div className="footer-bottom">
        <span className="mono-label">© 2025 KILN® — Digital Craft Studio</span>
        <span className="mono-label footer-credit">Concept showcase — no templates were harmed</span>
        <button
          type="button"
          className="mono-label to-top"
          data-cursor="link"
          onClick={() => scrollToTarget(0)}
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  )
}
