import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { device } from '../lib/store'

/**
 * Custom cursor: a precise dot with a lagging ring. Elements tagged with
 * [data-cursor="link"|"view"] morph the ring — "view" swells it into a
 * labeled badge over the work index. Native cursor is hidden via CSS on
 * fine-pointer devices only.
 */
export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    if (device.touch || device.reduced) return undefined

    const dot = dotRef.current
    const ring = ringRef.current
    document.documentElement.classList.add('has-custom-cursor')

    const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' })
    const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' })
    const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    const move = (e) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      const hit = e.target instanceof Element ? e.target.closest('[data-cursor]') : null
      const kind = hit ? hit.dataset.cursor : null
      ring.classList.toggle('cursor-ring--link', kind === 'link')
      ring.classList.toggle('cursor-ring--view', kind === 'view')
    }

    window.addEventListener('mousemove', move, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      document.documentElement.classList.remove('has-custom-cursor')
    }
  }, [])

  if (device.touch) return null

  return (
    <>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
      <div className="cursor-ring" ref={ringRef} aria-hidden="true">
        <span>VIEW</span>
      </div>
    </>
  )
}
