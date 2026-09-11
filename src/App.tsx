import {
  useLayoutEffect,
  useRef,
} from 'react'

import gsap from 'gsap'

import './App.css'

import EntryLogo3D from './components/entry/EntryLogo3D'
import DotField from './components/backgrounds/DotField/DotField'

function App() {
  const entryRef =
    useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const root =
      entryRef.current

    if (!root) return

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (reducedMotion) {
      return
    }

    const context = gsap.context(
      () => {
        /*
         * =====================================
         * INITIAL STATE
         * =====================================
         */

        gsap.set(
          [
            '.entry__brand',
            '.entry__meta',
            '.entry__footer',
          ],
          {
            opacity: 0,
            y: 8,
          },
        )

        gsap.set(
          '.entry__dot-field',
          {
            opacity: 0,
            scale: 1.04,
          },
        )

        gsap.set(
          '.entry__pattern',
          {
            opacity: 0,
          },
        )

        gsap.set(
          '.entry__emblem',
          {
            opacity: 0,
            scale: 0.72,
            y: 30,
            filter:
              'blur(10px)',
          },
        )

        gsap.set(
          '.entry__enter',
          {
            opacity: 0,
            y: 20,
            letterSpacing:
              '-0.08em',
          },
        )

        gsap.set(
          '.entry__subtitle',
          {
            opacity: 0,
            y: 10,
          },
        )

        /*
         * =====================================
         * CINEMATIC TIMELINE
         * =====================================
         */

        const timeline =
          gsap.timeline({
            defaults: {
              ease:
                'power3.out',
            },
          })

        /*
         * Header.
         */

        timeline.to(
          '.entry__brand',
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          0.18,
        )

        timeline.to(
          '.entry__meta',
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
          },
          0.28,
        )

        /*
         * Dot field wakes up.
         */

        timeline.to(
          '.entry__dot-field',
          {
            opacity: 0.95,
            scale: 1,
            duration: 1.25,
            ease:
              'power2.out',
          },
          0.32,
        )

        /*
         * Technical crosshair.
         */

        timeline.to(
          '.entry__pattern',
          {
            opacity: 1,
            duration: 0.9,
            ease:
              'power1.out',
          },
          0.6,
        )

        /*
         * Main medallion.
         *
         * Appears from darkness / depth.
         */

        timeline.to(
          '.entry__emblem',
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter:
              'blur(0px)',

            duration: 1.15,

            ease:
              'power4.out',
          },
          0.72,
        )

        /*
         * ENTER.
         */

        timeline.to(
          '.entry__enter',
          {
            opacity: 1,
            y: 0,

            letterSpacing:
              '-0.045em',

            duration: 0.75,

            ease:
              'power3.out',
          },
          1.48,
        )

        /*
         * Subtitle.
         */

        timeline.to(
          '.entry__subtitle',
          {
            opacity: 1,
            y: 0,

            duration: 0.65,
          },
          1.72,
        )

        timeline.set(
          '.entry__enter',
          {
            clearProps: 'transform,letterSpacing',
          },
          2.58,
        )

        /*
         * Footer last.
         */

        timeline.to(
          '.entry__footer',
          {
            opacity: 1,
            y: 0,

            duration: 0.65,
          },
          1.92,
        )
      },
      root,
    )

    return () => {
      context.revert()
    }
  }, [])

  return (
    <main
      ref={entryRef}
      className="entry"
    >
      {/* Grain */}

      <div
        className="entry__grain"
        aria-hidden="true"
      />

      {/* Interactive Dot Field */}

      <div
        className="entry__dot-field"
        aria-hidden="true"
      >
        <DotField
          dotRadius={0.85}
          dotSpacing={14}
          cursorRadius={500}
          bulgeStrength={67}
          glowRadius={260}
          baseColor="rgba(255, 255, 255, 0.22)"
          accentColor="rgba(255, 255, 255, 0.92)"
          glowColor="rgba(255, 255, 255, 0)"
        />
      </div>

      {/* Circular vignette */}

      <div
        className="entry__corner-fade"
        aria-hidden="true"
      />

      {/* Technical crosshair */}

      <div
        className="entry__pattern"
        aria-hidden="true"
      />

      {/* Header */}

      <header className="entry__header">
        <div className="entry__brand">
          HELLSTAR
        </div>

        <div className="entry__meta entry__meta--right">
          <span>2026</span>

          <span>
            UNOFFICIAL CONCEPT
          </span>
        </div>
      </header>

      {/* Main content */}

      <section className="entry__content">
        <div
          className="entry__emblem entry__emblem--3d"
          aria-hidden="true"
        >
          <EntryLogo3D />
        </div>

        <button
          className="entry__enter"
          type="button"
        >
          ENTER
        </button>

        <p className="entry__subtitle">
          ANOTHER REALITY AWAITS
        </p>
      </section>

      {/* Footer */}

      <footer className="entry__footer">
        <span>
          PEOPLE / PLACES / IDEAS / BEYOND
        </span>

        <div className="entry__footer-center">
          <span className="entry__status-dot" />

          <span>
            HS / 001
          </span>
        </div>

        <span>
          NOT FROM HERE
        </span>
      </footer>
    </main>
  )
}

export default App