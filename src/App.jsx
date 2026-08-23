import React, { useEffect, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Experience from './three/Experience.jsx'
import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import Grain from './components/Grain.jsx'
import Nav from './components/Nav.jsx'
import Hero from './components/Hero.jsx'
import Manifesto from './components/Manifesto.jsx'
import Work from './components/Work.jsx'
import Process from './components/Process.jsx'
import Stats from './components/Stats.jsx'
import Capabilities from './components/Capabilities.jsx'
import Marquee from './components/Marquee.jsx'
import Footer from './components/Footer.jsx'

import { initLenis, getLenis } from './lib/lenis'
import { scrollState, pointer } from './lib/store'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [revealed, setRevealed] = useState(false) // curtain started lifting
  const [gone, setGone] = useState(false) // preloader fully removed

  /* ------------------------------------------------------------------ */
  /* Global motion plumbing                                              */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    const lenis = initLenis()

    lenis.on('scroll', (e) => {
      scrollState.velocity = e.velocity || 0
      ScrollTrigger.update()
    })

    const raf = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    const onPointerMove = (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('mousemove', onPointerMove)

    const onLoad = () => ScrollTrigger.refresh()
    window.addEventListener('load', onLoad)

    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('load', onLoad)
    }
  }, [])

  /* Whole-page progress, used for canvas choreography + parallax. */
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 0,
      end: () => document.documentElement.scrollHeight - window.innerHeight,
      onUpdate: (self) => {
        scrollState.page = self.progress
      },
    })
    return () => st.kill()
  }, [])

  /* Unlock scrolling the moment the curtain starts lifting. */
  useEffect(() => {
    if (!revealed) return
    getLenis()?.start()
    // Layout settled under the preloader — re-measure everything.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 350)
    return () => window.clearTimeout(id)
  }, [revealed])

  return (
    <>
      <Experience />
      <Grain />
      <Cursor />
      {!gone && (
        <Preloader onReveal={() => setRevealed(true)} onGone={() => setGone(true)} />
      )}
      <Nav revealed={revealed} />
      <main className={`site${revealed ? ' site--live' : ''}`}>
        <Hero revealed={revealed} />
        <Manifesto />
        <Work />
        <Process />
        <Stats />
        <Capabilities />
        <Marquee />
        <Footer />
      </main>
    </>
  )
}

