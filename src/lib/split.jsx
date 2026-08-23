import React from 'react'

/**
 * Display type rendered as masked lines of individually animatable characters.
 *
 * `lines` is an array of strings — every line gets its own overflow-hidden
 * mask, so character reveals NEVER depend on runtime line measurement
 * (fonts, zoom or viewport can't break them).
 */
export function SplitLines({ lines, className = '', ariaLabel, ariaHidden = false }) {
  return (
    <span
      className={`split ${className}`}
      aria-label={ariaHidden ? undefined : (ariaLabel ?? lines.join(' '))}
      aria-hidden={ariaHidden || undefined}
    >
      {lines.map((line, li) => (
        <span className="split-line" key={li} aria-hidden="true">
          <span className="split-inner">
            {Array.from(line).map((ch, ci) =>
              ch === ' ' ? (
                <span className="split-space" key={ci}>
                  &nbsp;
                </span>
              ) : (
                <span className="split-char" key={ci}>
                  {ch}
                </span>
              ),
            )}
          </span>
        </span>
      ))}
    </span>
  )
}

/** All animatable char spans beneath `root`, in DOM order. */
export function charsIn(root) {
  return root ? Array.from(root.querySelectorAll('.split-char')) : []
}

/** All word spans beneath `root` (used by the manifesto scrub). */
export function wordsIn(root) {
  return root ? Array.from(root.querySelectorAll('.word')) : []
}

/** Wrap a plain string into word spans (keeps spaces outside spans). */
export function Words({ text, className = '' }) {
  return (
    <span className={`words ${className}`} aria-label={text}>
      {text.split(' ').map((w, i) => (
        <React.Fragment key={i}>
          <span className="word" aria-hidden="true">
            {w}
          </span>{' '}
        </React.Fragment>
      ))}
    </span>
  )
}
