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

  const transitioningRef =
    useRef(false)

  /* =========================================
     INTRO CINEMATIC
  ========================================= */

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
        /* -----------------------------
           INITIAL STATE
        ----------------------------- */

        gsap.set(
          [
            '.entry__brand',
            '.entry__meta',
            '.entry__footer',
            '.entry__hud',
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
            filter: 'blur(10px)',
          },
        )

        gsap.set(
          '.entry__enter',
          {
            opacity: 0,
            y: 20,
            letterSpacing: '-0.08em',
          },
        )

        gsap.set(
          '.entry__subtitle',
          {
            opacity: 0,
            y: 10,
          },
        )

        gsap.set(
          '.entry__transition-cover',
          {
            opacity: 0,
          },
        )

        /* -----------------------------
           TIMELINE
        ----------------------------- */

        const timeline =
          gsap.timeline({
            defaults: {
              ease: 'power3.out',
            },
          })

        /* Header */

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

        /* Dot Field */

        timeline.to(
          '.entry__dot-field',
          {
            opacity: 0.95,
            scale: 1,
            duration: 1.25,
            ease: 'power2.out',
          },
          0.32,
        )

        /* Crosshair */

        timeline.to(
          '.entry__pattern',
          {
            opacity: 1,
            duration: 0.9,
            ease: 'power1.out',
          },
          0.6,
        )

        /* Medallion */

        timeline.to(
          '.entry__emblem',
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',
            duration: 1.15,
            ease: 'power4.out',
          },
          0.72,
        )

        /* HUD */

        timeline.to(
          '.entry__hud',
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power2.out',
          },
          1.18,
        )

        /* ENTER */

        timeline.to(
          '.entry__enter',
          {
            opacity: 1,
            y: 0,
            letterSpacing: '-0.045em',
            duration: 0.75,
            ease: 'power3.out',
          },
          1.48,
        )

        /* Subtitle */

        timeline.to(
          '.entry__subtitle',
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          1.72,
        )

        /* Footer */

        timeline.to(
          '.entry__footer',
          {
            opacity: 1,
            y: 0,
            duration: 0.65,
          },
          1.92,
        )

        /*
         * Devuelve ENTER al control del CSS
         * para recuperar hover / active.
         */

        timeline.set(
          '.entry__enter',
          {
            clearProps:
              'transform,letterSpacing',
          },
          2.58,
        )
      },
      root,
    )

    return () => {
      context.revert()
    }
  }, [])

  /* =========================================
     ENTER CLICK TRANSITION
  ========================================= */

  const handleEnter = () => {
    const root =
      entryRef.current

    if (
      !root ||
      transitioningRef.current
    ) {
      return
    }

    transitioningRef.current = true

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (reducedMotion) {
      gsap.set(
        '.entry__transition-cover',
        {
          opacity: 1,
        },
      )

      return
    }

    const context = gsap.context(
      () => {
        /*
         * Evitamos que hover / click CSS
         * interfieran durante la salida.
         */

        gsap.killTweensOf(
          '.entry__enter',
        )

        const exitTimeline =
          gsap.timeline({
            defaults: {
              ease: 'power3.inOut',
            },
          })

        /* ----------------------------------
           HUD retracts first
        ---------------------------------- */

        exitTimeline.to(
          '.entry__hud',
          {
            opacity: 0,
            duration: 0.28,
            stagger: 0.035,
          },
          0,
        )

        /* ----------------------------------
           Header + Footer disappear
        ---------------------------------- */

        exitTimeline.to(
          [
            '.entry__brand',
            '.entry__meta',
            '.entry__footer',
          ],
          {
            opacity: 0,
            y: -6,
            duration: 0.38,
          },
          0.06,
        )

        /* ----------------------------------
           ENTER + subtitle
        ---------------------------------- */

        exitTimeline.to(
          '.entry__enter',
          {
            opacity: 0,
            y: 18,
            scale: 0.96,
            letterSpacing: '0.05em',
            duration: 0.38,
          },
          0.08,
        )

        exitTimeline.to(
          '.entry__subtitle',
          {
            opacity: 0,
            y: 10,
            duration: 0.3,
          },
          0.12,
        )

        /* ----------------------------------
           Technical system shuts down
        ---------------------------------- */

        exitTimeline.to(
          '.entry__pattern',
          {
            opacity: 0,
            duration: 0.48,
          },
          0.18,
        )

        exitTimeline.to(
          '.entry__dot-field',
          {
            opacity: 0.16,
            scale: 1.075,
            duration: 0.72,
            ease: 'power2.inOut',
          },
          0.16,
        )

        /* ----------------------------------
           Medallion becomes protagonist
        ---------------------------------- */

        exitTimeline.to(
          '.entry__emblem',
          {
            scale: 1.07,
            y: -4,
            duration: 0.42,
            ease: 'power2.out',
          },
          0.12,
        )

        /*
         * Segundo impulso.
         * Parece que el medallón empieza
         * a acercarse hacia la cámara.
         */

        exitTimeline.to(
          '.entry__emblem',
          {
            scale: 1.2,
            opacity: 0.72,
            filter: 'blur(1.5px)',
            duration: 0.58,
            ease: 'power3.in',
          },
          0.48,
        )

        /* ----------------------------------
           Black transition cover
        ---------------------------------- */

        exitTimeline.to(
          '.entry__transition-cover',
          {
            opacity: 1,
            duration: 0.48,
            ease: 'power2.inOut',
          },
          0.72,
        )
      },
      root,
    )

    /*
     * Este context NO lo revertimos todavía,
     * porque en el siguiente paso
     * Liquid Ether continuará desde aquí.
     */

    void context
  }

  return (
    <main
      ref={entryRef}
      className="entry"
    >
      {/* =====================================
          GRAIN
      ===================================== */}

      <div
        className="entry__grain"
        aria-hidden="true"
      />

      {/* =====================================
          DOT FIELD
      ===================================== */}

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

      {/* =====================================
          CIRCULAR VIGNETTE
      ===================================== */}

      <div
        className="entry__corner-fade"
        aria-hidden="true"
      />

      {/* =====================================
          TECHNICAL CROSSHAIR
      ===================================== */}

      <div
        className="entry__pattern"
        aria-hidden="true"
      />

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="entry__header">
        <div className="entry__brand">
          HELLSTAR
        </div>

        <div className="entry__meta entry__meta--right">
          <span>
            2026
          </span>

          <span>
            UNOFFICIAL CONCEPT
          </span>
        </div>
      </header>

      {/* =====================================
          MAIN CONTENT
      ===================================== */}

      <section className="entry__content">
        {/* LEFT HUD */}

        <div
          className="entry__hud entry__hud--left"
          aria-hidden="true"
        >
          <div className="entry__hud-status">
            <span className="entry__hud-dot" />

            <span>
              SYS / ONLINE
            </span>
          </div>

          <span>
            X / 042.16
          </span>

          <span>
            Y / 118.07
          </span>
        </div>

        {/* RIGHT HUD */}

        <div
          className="entry__hud entry__hud--right"
          aria-hidden="true"
        >
          <span>
            DROP / 001
          </span>

          <span>
            MODE / ENTRY
          </span>

          <span>
            SIGNAL / 98%
          </span>
        </div>

        {/* MEDALLION */}

        <div
          className="entry__emblem entry__emblem--3d"
          aria-hidden="true"
        >
          <EntryLogo3D />
        </div>

        {/* ENTER */}

        <button
          className="entry__enter"
          type="button"
          onClick={handleEnter}
        >
          ENTER
        </button>

        {/* SUBTITLE */}

        <p className="entry__subtitle">
          ANOTHER REALITY AWAITS
        </p>
      </section>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="entry__footer">
        <span>
          PEOPLE / PLACES / IDEAS / BEYOND
        </span>

        <div className="entry__footer-center">
          <span
            className="entry__status-dot"
          />

          <span>
            HS / 001
          </span>
        </div>

        <span>
          NOT FROM HERE
        </span>
      </footer>

      {/* =====================================
          TRANSITION COVER
      ===================================== */}

      <div
        className="entry__transition-cover"
        aria-hidden="true"
      />
    </main>
  )
}

export default App