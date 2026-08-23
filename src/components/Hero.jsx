import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitLines, charsIn } from '../lib/split'
import { scrollState, layoutTarget, isDesktop } from '../lib/store'
import { scrollToTarget } from '../lib/lenis'
import { useMagnetic } from '../lib/useMagnetic'

gsap.registerPlugin(ScrollTrigger)

export default function Hero({ revealed }) {
  const rootRef = useRef(null)
  const ctaRef = useMagnetic(0.3)

  /* Park the 3D core right of the copy on desktop, above it on mobile. */
  useEffect(() => {
    const place = () => {
      layoutTarget.x = isDesktop() ? 1.62 : 0
      layoutTarget.y = isDesktop() ? -0.05 : 0.58
      layoutTarget.scale = isDesktop() ? 1 : 0.62
    }
    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [])

  /* Hero scroll progress feeds the store + copy parallax/fade. */
  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          scrollState.hero = self.progress
        },
      })
      gsap.to('.hero-inner', {
        yPercent: 14,
        autoAlpha: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: 'bottom 25%',
          scrub: true,
        },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  /* Intro choreography, fired the moment the preloader curtain lifts. */
  useEffect(() => {
    if (!revealed) return undefined
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.fromTo(
        '.hero-eyebrow',
        { y: 26, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.8 },
        0.1,
      )
        .from(
          charsIn(rootRef.current),
          { yPercent: 118, rotateZ: 5, duration: 1.15, stagger: 0.018 },
          0.15,
        )
        .fromTo(
          '.hero-sub',
          { y: 28, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.9 },
          '-=0.7',
        )
        .fromTo(
          '.hero-cta-row > *',
          { y: 22, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.09 },
          '-=0.6',
        )
        .fromTo(
          '.hero-foot > *',
          { autoAlpha: 0 },
          { autoAlpha: 1, duration: 0.8, stagger: 0.08 },
          '-=0.5',
        )
    }, rootRef)
    return () => ctx.revert()
  }, [revealed])

  return (
    <section className="hero" id="top" ref={rootRef}>
      <div className="hero-inner">
        <p className="mono-label hero-eyebrow">Digital &amp; spatial engineering — est. 2019 · Lisbon</p>

        <h1 className="hero-title" aria-label="Raw ideas, fired to perfection">
          <SplitLines lines={['RAW IDEAS,', 'FIRED TO']} ariaHidden="true" />
          <SplitLines
            lines={['PERFECTION.']}
            className="hero-title-accent"
            ariaHidden="true"
          />
        </h1>

        <p className="hero-sub">
          Real-time 3D, precision motion and commerce systems for architecture practices,
          luxury houses and cultural institutions. Everything ships at sixty frames per
          second — or it doesn&rsquo;t ship.
        </p>

        <div className="hero-cta-row">
          <a
            ref={ctaRef}
            className="btn btn-solid"
            href="#work"
            data-cursor="link"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#work')
            }}
          >
            See the work
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M6 1v10M2 7l4 4 4-4" stroke="currentColor" strokeWidth="1.4" />
            </svg>
          </a>
          <a
            className="btn btn-ghost"
            href="#process"
            data-cursor="link"
            onClick={(e) => {
              e.preventDefault()
              scrollToTarget('#process')
            }}
          >
            Our process
          </a>
        </div>
      </div>

      <div className="hero-foot">
        <span className="mono-label">Scroll to descend ↓</span>
        <span className="mono-label hero-foot-mid">38.7223° N, 9.1393° W — LISBON</span>
        <span className="mono-label">● Booking Q3 2025</span>
      </div>
    </section>
  )
}
