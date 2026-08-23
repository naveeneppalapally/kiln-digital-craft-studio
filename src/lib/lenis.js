import Lenis from 'lenis'

/** Single shared smooth-scroll instance (App owns its lifecycle). */
let instance = null

export function initLenis() {
  if (instance) return instance
  instance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.4,
  })
  return instance
}

export function getLenis() {
  return instance
}

export function scrollToTarget(target, offset = 0) {
  if (!instance) return
  instance.scrollTo(target, { offset, duration: 1.6 })
}
