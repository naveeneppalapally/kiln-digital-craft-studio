import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { getLenis } from '../lib/lenis'

/**
 * Cinematic ignition sequence: counter eases toward 88% while assets load,
 * snaps to 100 when fonts + window are ready, then the curtain lifts —
 * revealing the hero exactly as its intro timeline begins.
 */
export default function Preloader({ onReveal, onGone }) {
  const rootRef = useRef(null)
  const numRef = useRef(null)
  const barRef = useRef(null)

  useEffect(() => {
    getLenis()?.stop()

    const val = { v: 0 }
    let finished = false
    const tweens = []

    const render = () => {
      if (numRef.current) {
        numRef.current.textContent = String(Math.floor(val.v)).padStart(3, '0')
      }
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${val.v / 100})`
      }
    }

    const exit = () => {
      if (finished) return
      finished = true
      const fades = Array.from(
        rootRef.current?.querySelectorAll('.preloader-fade') ?? [],
      )
      const out = gsap.timeline({
        onComplete: () => {
          getLenis()?.start()
          onGone?.()
        },
      })
      out
        .to(fades, {
          yPercent: -60,
          autoAlpha: 0,
          duration: 0.45,
          ease: 'power2.in',
          stagger: 0.06,
        })
        .to(
          rootRef.current,
          {
            yPercent: -100,
            duration: 0.95,
            ease: 'expo.inOut',
            onStart: () => onReveal?.(),
          },
          '-=0.05',
        )
      tweens.push(out)
    }

    const count = gsap.to(val, {
      v: 88,
      duration: 1.9,
      ease: 'power2.inOut',
      onUpdate: render,
    })
    tweens.push(count)

    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
    const winReady = new Promise((res) => {
      if (document.readyState === 'complete') res()
      else window.addEventListener('load', res, { once: true })
    })

    Promise.all([fontsReady, winReady]).then(() => {
      const finish = gsap.to(val, {
        v: 100,
        duration: 0.5,
        ease: 'power2.out',
        onUpdate: render,
        onComplete: exit,
      })
      tweens.push(finish)
    })

    return () => tweens.forEach((tw) => tw.kill())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="preloader" ref={rootRef} role="status" aria-label="Loading KILN">
      <div className="preloader-center">
        <p className="mono-label preloader-fade">FIRING THE KILN</p>
        <div className="preloader-num preloader-fade" ref={numRef}>
          000
        </div>
        <div className="preloader-bar">
          <span ref={barRef} />
        </div>
        <p className="mono-label preloader-foot preloader-fade">
          KILN® — DIGITAL &amp; SPATIAL ENGINEERING
        </p>
      </div>
    </div>
  )
}
