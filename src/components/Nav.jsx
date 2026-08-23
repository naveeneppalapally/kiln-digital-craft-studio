import React from 'react'
import { scrollToTarget } from '../lib/lenis'
import { useMagnetic } from '../lib/useMagnetic'

const LINKS = [
  { label: 'Work', href: '#work' },
  { label: 'Studio', href: '#studio' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav({ revealed }) {
  const ctaRef = useMagnetic(0.25)

  const go = (e, target) => {
    e.preventDefault()
    scrollToTarget(target)
  }

  return (
    <header className={`nav${revealed ? ' nav--live' : ''}`}>
      <a
        className="nav-logo"
        href="#top"
        aria-label="KILN — back to top"
        data-cursor="link"
        onClick={(e) => go(e, 0)}
      >
        KILN<sup>®</sup>
      </a>

      <nav className="nav-links" aria-label="Primary">
        {LINKS.map((l) => (
          <a key={l.href} href={l.href} data-cursor="link" onClick={(e) => go(e, l.href)}>
            {l.label}
          </a>
        ))}
      </nav>

      <a ref={ctaRef} className="nav-cta" href="mailto:hello@kiln.studio" data-cursor="link">
        Start a project
      </a>
    </header>
  )
}
