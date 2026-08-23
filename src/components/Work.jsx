import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitLines, charsIn } from '../lib/split'
import { device } from '../lib/store'
import CoverArt from './CoverArt.jsx'

gsap.registerPlugin(ScrollTrigger)

const PROJECTS = [
  {
    title: 'Haus Kessler',
    tags: ['Parametric Commerce', 'WebGL'],
    year: '2025',
    blurb:
      'A century of modular furniture rebuilt as geometry. Collectors assemble authentic Kessler systems in real time — every joint validated against the original 1924 tolerances — then acquire exactly what they built. Average order value rose 92%.',
    deliverables: ['Parametric 3D engine', 'Headless commerce', 'Archive digitisation'],
    palette: { bg1: '#160d08', bg2: '#3a2408', mid: '#ff8c1a', accent: '#ffd166' },
  },
  {
    title: 'Studio Ansel',
    tags: ['Spatial Portfolio', 'Point Clouds'],
    year: '2025',
    blurb:
      'An architecture practice asked us to make drawings feel like buildings. Twelve projects reconstructed as navigable point clouds and daylight studies — clients now walk through the unbuilt. Three international commissions cited the site directly.',
    deliverables: ['Point-cloud rendering', 'Custom CMS', 'Art direction'],
    palette: { bg1: '#0b1016', bg2: '#22384e', mid: '#4f86ad', accent: '#bcd9ec' },
  },
  {
    title: 'Vantablack Records',
    tags: ['Audio-Reactive', 'Identity'],
    year: '2024',
    blurb:
      'An electronic label wanted releases you could walk through. Each artist page listens to its own masters — typography, grain and light resolving from the waveform in real time. 2.1M sessions in the first month.',
    deliverables: ['Audio-reactive WebGL', 'Artist microsites', 'Visual identity'],
    palette: { bg1: '#0a0507', bg2: '#2e0a12', mid: '#c41f3e', accent: '#ff7a90' },
  },
  {
    title: 'Nord Terminal',
    tags: ['Real-time Data', 'Wayfinding'],
    year: '2023',
    blurb:
      'A Nordic airport authority briefed us on a single word: calm. We rebuilt the passenger journey as a living map — gates, queues and daylight modelled in real time across nine million travellers a year. Stress scores fell 34%.',
    deliverables: ['Live data pipeline', '3D wayfinding', 'Service design'],
    palette: { bg1: '#08111a', bg2: '#14304a', mid: '#3f7fc4', accent: '#a8d4f0' },
  },
  {
    title: 'Ondine Hotels',
    tags: ['Booking Systems', 'Art Direction'],
    year: '2023',
    blurb:
      'Boutique hospitality deserved better than thumbnail grids. Ondine books like a tide table — rooms surface as you descend, rates breathe with occupancy. Direct bookings climbed 61%, and OTA dependence fell for the first time in the brand’s history.',
    deliverables: ['Booking experience', 'Photography system', 'Design engineering'],
    palette: { bg1: '#071512', bg2: '#12403a', mid: '#2fa98c', accent: '#ffe3b4' },
  },
]

export default function Work() {
  const rootRef = useRef(null)
  const previewRef = useRef(null)
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const rafId = useRef(0)
  const [open, setOpen] = useState(-1)
  const [active, setActive] = useState(0)
  const [previewOn, setPreviewOn] = useState(false)

  /* Floating artwork preview lerps toward the cursor, forever cheap. */
  useEffect(() => {
    if (device.touch) return undefined
    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * 0.11
      pos.current.y += (target.current.y - pos.current.y) * 0.11
      const el = previewRef.current
      if (el) {
        const tilt = (target.current.x - pos.current.x) * 0.05
        el.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px)`
        const inner = el.firstElementChild
        if (inner) inner.style.transform = `rotate(${tilt}deg)`
      }
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId.current)
  }, [])

  /* Section entrance: title chars, then rows stagger in. */
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(charsIn(rootRef.current), {
        yPercent: 118,
        rotateZ: 4,
        duration: 1,
        stagger: 0.02,
        ease: 'power4.out',
        scrollTrigger: { trigger: rootRef.current, start: 'top 72%', once: true },
      })
      gsap.from('.work-item', {
        autoAlpha: 0,
        y: 42,
        duration: 0.9,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.work-list', start: 'top 82%', once: true },
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section className="work section-pad" id="work" ref={rootRef}>
      <div className="work-head">
        <p className="mono-label section-tag">02 — Fired pieces</p>
        <h2 className="section-title">
          <SplitLines lines={['SELECTED WORK']} ariaLabel="Selected work" />
        </h2>
        <p className="mono-label work-count">(05)</p>
      </div>

      <ul
        className="work-list"
        onMouseMove={(e) => {
          target.current.x = e.clientX
          target.current.y = e.clientY
        }}
        onMouseLeave={() => setPreviewOn(false)}
      >
        {PROJECTS.map((p, i) => (
          <li key={p.title} className={`work-item${open === i ? ' open' : ''}`}>
            <button
              type="button"
              className="work-row"
              data-cursor="view"
              aria-expanded={open === i}
              onClick={() => setOpen(open === i ? -1 : i)}
              onMouseEnter={() => {
                setActive(i)
                setPreviewOn(true)
              }}
            >
              <span className="mono-label work-idx">{String(i + 1).padStart(2, '0')}</span>
              <span className="work-title">{p.title}</span>
              <span className="mono-label work-tags">{p.tags.join(' · ')}</span>
              <span className="mono-label work-year">{p.year}</span>
              <span className="work-plus" aria-hidden="true" />
            </button>
            <div className="work-detail">
              <div className="work-detail-inner">
                <div className="work-detail-content">
                  <p>{p.blurb}</p>
                  <ul className="chips">
                    {p.deliverables.map((d) => (
                      <li key={d}>{d}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {!device.touch && (
        <div
          className={`work-preview${previewOn ? ' on' : ''}`}
          ref={previewRef}
          aria-hidden="true"
        >
          <div className="work-preview-inner">
            <CoverArt
              seed={PROJECTS[active].title}
              index={String(active + 1).padStart(2, '0')}
              palette={PROJECTS[active].palette}
            />
          </div>
        </div>
      )}
    </section>
  )
}
