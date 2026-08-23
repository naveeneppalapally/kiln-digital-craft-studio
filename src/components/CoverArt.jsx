import React, { useId, useMemo } from 'react'

/** String -> deterministic u32 seed (FNV-1a). */
function hashSeed(str) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(seed) {
  let a = seed >>> 0
  return function next() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/**
 * Procedural case-study artwork.
 * Layered gradients + turbulence-displaced blobs + orbital rings + an
 * oversized outlined index numeral. Zero image assets — every cover is
 * unique per seed and renders crisply at any size.
 */
export default function CoverArt({ seed, index, palette }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '')

  const art = useMemo(() => {
    const rnd = mulberry32(hashSeed(seed))
    const blobs = Array.from({ length: 3 }, (_, i) => ({
      cx: 60 + rnd() * 280,
      cy: 40 + rnd() * 220,
      r: 46 + rnd() * 90,
      o: 0.16 + rnd() * 0.25,
      fill: i % 2 ? palette.accent : palette.mid,
    }))
    const rings = Array.from({ length: 4 }, () => ({
      r: 30 + rnd() * 120,
      sw: 0.6 + rnd() * 1.4,
      o: 0.1 + rnd() * 0.22,
    }))
    return { blobs, rings }
  }, [seed, palette])

  return (
    <svg viewBox="0 0 400 300" className="cover-art" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={palette.bg1} />
          <stop offset="100%" stopColor={palette.bg2} />
        </linearGradient>
        <filter id={`rough-${uid}`} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves="2"
            seed="7"
            result="turb"
          />
          <feDisplacementMap in="SourceGraphic" in2="turb" scale="26" />
        </filter>
      </defs>

      <rect width="400" height="300" fill={`url(#bg-${uid})`} />

      <g filter={`url(#rough-${uid})`}>
        {art.blobs.map((b, i) => (
          <circle key={i} cx={b.cx} cy={b.cy} r={b.r} fill={b.fill} opacity={b.o} />
        ))}
      </g>

      <g fill="none" stroke="#EDE6DA">
        {art.rings.map((r, i) => (
          <circle key={i} cx="200" cy="150" r={r.r} strokeWidth={r.sw} opacity={r.o} />
        ))}
      </g>

      <text
        x="24"
        y="272"
        fontFamily="Syne, sans-serif"
        fontWeight="800"
        fontSize="150"
        fill="none"
        stroke="#EDE6DA"
        strokeOpacity="0.5"
        strokeWidth="1.2"
      >
        {index}
      </text>
    </svg>
  )
}
