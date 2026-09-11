import {
  useLayoutEffect,
  useRef,
} from 'react'

import gsap from 'gsap'

import './Hero.css'

import hoodiePathToParadise from '../../assets/products/hoodie-01-black-path-to-paradise.png'

function Hero() {
  const heroRef =
    useRef<HTMLElement>(null)

  const productStageRef =
    useRef<HTMLDivElement>(null)

  const productFloatRef =
    useRef<HTMLDivElement>(null)

  const wordmarkRef =
    useRef<HTMLDivElement>(null)

  const haloRef =
    useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root =
      heroRef.current

    const productStage =
      productStageRef.current

    const productFloat =
      productFloatRef.current

    const wordmark =
      wordmarkRef.current

    const halo =
      haloRef.current

    if (
      !root ||
      !productStage ||
      !productFloat ||
      !wordmark ||
      !halo
    ) {
      return
    }

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (reducedMotion) {
      return
    }

    const finePointer =
      window.matchMedia(
        '(pointer: fine)',
      ).matches

    const context = gsap.context(
      () => {
        /* =====================================
           INITIAL HERO STATE
        ===================================== */

        gsap.set(
          '.hero__wordmark',
          {
            opacity: 0,
            scale: 0.94,
            y: 30,
          },
        )

        gsap.set(
          '.hero__product',
          {
            opacity: 0,
            scale: 0.82,
            y: 70,
            rotate: -2,
            filter: 'blur(10px)',
          },
        )

        gsap.set(
          [
            '.hero__meta',
            '.hero__nav',
            '.hero__footer',
          ],
          {
            opacity: 0,
            y: 10,
          },
        )

        gsap.set(
          '.hero__product-info',
          {
            opacity: 0,
            y: 20,
          },
        )

        /* =====================================
           HERO REVEAL
        ===================================== */

        const timeline =
          gsap.timeline({
            defaults: {
              ease: 'power3.out',
            },
          })

        timeline.to(
          '.hero__wordmark',
          {
            opacity: 0.18,
            scale: 1,
            y: 0,

            duration: 1.2,

            ease: 'power4.out',
          },
          0,
        )

        timeline.to(
          '.hero__product',
          {
            opacity: 1,
            scale: 1,
            y: 0,
            rotate: 0,
            filter: 'blur(0px)',

            duration: 1.35,

            ease: 'power4.out',
          },
          0.12,
        )

        timeline.to(
          '.hero__nav',
          {
            opacity: 1,
            y: 0,

            duration: 0.7,
          },
          0.32,
        )

        timeline.to(
          '.hero__meta',
          {
            opacity: 1,
            y: 0,

            duration: 0.75,

            stagger: 0.08,
          },
          0.45,
        )

        timeline.to(
          '.hero__product-info',
          {
            opacity: 1,
            y: 0,

            duration: 0.8,
          },
          0.68,
        )

        timeline.to(
          '.hero__footer',
          {
            opacity: 1,
            y: 0,

            duration: 0.7,
          },
          0.88,
        )

        /* =====================================
           IDLE FLOAT
        ===================================== */

        gsap.to(
          productFloat,
          {
            y: -9,
            rotation: 0.35,

            duration: 3.4,

            repeat: -1,
            yoyo: true,

            ease: 'sine.inOut',

            delay: 1.25,
          },
        )

        /* =====================================
           HALO BREATHING
        ===================================== */

        gsap.to(
          halo,
          {
            scale: 1.08,
            opacity: 0.72,

            duration: 4.2,

            repeat: -1,
            yoyo: true,

            ease: 'sine.inOut',

            delay: 1.1,
          },
        )
      },
      root,
    )

    /* =========================================
       POINTER PARALLAX
    ========================================= */

    if (finePointer) {
      /*
       * Product moves slightly toward pointer.
       */

      const productX =
        gsap.quickTo(
          productStage,
          'x',
          {
            duration: 0.75,
            ease: 'power3.out',
          },
        )

      const productY =
        gsap.quickTo(
          productStage,
          'y',
          {
            duration: 0.75,
            ease: 'power3.out',
          },
        )

      /*
       * Wordmark moves in opposite direction.
       */

      const wordmarkX =
        gsap.quickTo(
          wordmark,
          'x',
          {
            duration: 1,
            ease: 'power3.out',
          },
        )

      const wordmarkY =
        gsap.quickTo(
          wordmark,
          'y',
          {
            duration: 1,
            ease: 'power3.out',
          },
        )

      /*
       * Halo moves subtly with product.
       */

      const haloX =
        gsap.quickTo(
          halo,
          'x',
          {
            duration: 1.1,
            ease: 'power3.out',
          },
        )

      const haloY =
        gsap.quickTo(
          halo,
          'y',
          {
            duration: 1.1,
            ease: 'power3.out',
          },
        )

      const handlePointerMove = (
        event: PointerEvent,
      ) => {
        const bounds =
          root.getBoundingClientRect()

        const normalizedX =
          (
            (
              event.clientX -
              bounds.left
            ) /
            bounds.width -
            0.5
          ) * 2

        const normalizedY =
          (
            (
              event.clientY -
              bounds.top
            ) /
            bounds.height -
            0.5
          ) * 2

        /*
         * Product:
         * strongest depth layer.
         */

        productX(
          normalizedX * 16,
        )

        productY(
          normalizedY * 10,
        )

        /*
         * Wordmark:
         * counter-parallax.
         */

        wordmarkX(
          normalizedX * -10,
        )

        wordmarkY(
          normalizedY * -6,
        )

        /*
         * Halo:
         * slower secondary movement.
         */

        haloX(
          normalizedX * 8,
        )

        haloY(
          normalizedY * 5,
        )
      }

      const handlePointerLeave =
        () => {
          productX(0)
          productY(0)

          wordmarkX(0)
          wordmarkY(0)

          haloX(0)
          haloY(0)
        }

      root.addEventListener(
        'pointermove',
        handlePointerMove,
      )

      root.addEventListener(
        'pointerleave',
        handlePointerLeave,
      )

      return () => {
        root.removeEventListener(
          'pointermove',
          handlePointerMove,
        )

        root.removeEventListener(
          'pointerleave',
          handlePointerLeave,
        )

        context.revert()
      }
    }

    return () => {
      context.revert()
    }
  }, [])

  return (
    <section
      ref={heroRef}
      className="hero"
      aria-labelledby="hero-product-title"
    >
      {/* =====================================
          ATMOSPHERE
      ===================================== */}

      <div
        className="hero__ambient"
        aria-hidden="true"
      />

      <div
        className="hero__grid"
        aria-hidden="true"
      />

      {/* =====================================
          NAV
      ===================================== */}

      <header className="hero__nav">
        <span className="hero__brand">
          HELLSTAR
        </span>

        <div className="hero__nav-center">
          <span>
            DROP / 001
          </span>

          <span className="hero__nav-dot" />

          <span>
            FW / 2026
          </span>
        </div>

        <nav
          className="hero__nav-links"
          aria-label="Hero navigation"
        >
          <button type="button">
            SHOP
          </button>

          <button type="button">
            LOOKBOOK
          </button>

          <button type="button">
            CART / 00
          </button>
        </nav>
      </header>

      {/* =====================================
          MASSIVE WORDMARK
      ===================================== */}

      <div
        ref={wordmarkRef}
        className="hero__wordmark"
        aria-hidden="true"
      >
        HELLSTAR
      </div>

      {/* =====================================
          SIDE META
      ===================================== */}

      <div
        className="hero__meta hero__meta--left"
        aria-hidden="true"
      >
        <span>
          COLLECTION / 001
        </span>

        <span>
          PATH TO PARADISE
        </span>

        <span>
          LIMITED CONCEPT DROP
        </span>
      </div>

      <div
        className="hero__meta hero__meta--right"
        aria-hidden="true"
      >
        <span>
          ITEM / 01
        </span>

        <span>
          CATEGORY / HOODIE
        </span>

        <span>
          STATUS / AVAILABLE
        </span>
      </div>

      {/* =====================================
          PRODUCT
      ===================================== */}

      <div
        ref={productStageRef}
        className="hero__product-stage"
      >
        <div
          ref={haloRef}
          className="hero__product-halo"
          aria-hidden="true"
        />

        <div
          ref={productFloatRef}
          className="hero__product-float"
        >
          <figure className="hero__product">
            <img
              src={hoodiePathToParadise}
              alt="Black Path to Paradise graphic hoodie"
              draggable="false"
            />
          </figure>
        </div>
      </div>

      {/* =====================================
          PRODUCT INFO
      ===================================== */}

      <div className="hero__product-info">
        <div className="hero__product-index">
          <span>
            01
          </span>

          <span className="hero__product-divider">
            /
          </span>

          <span>
            03
          </span>
        </div>

        <h1
          id="hero-product-title"
          className="hero__product-title"
        >
          PATH TO PARADISE
        </h1>

        <p className="hero__product-type">
          BLACK GRAPHIC HOODIE
        </p>

        <button
          className="hero__cta"
          type="button"
        >
          <span>
            EXPLORE DROP
          </span>

          <span
            className="hero__cta-arrow"
            aria-hidden="true"
          >
            ↗
          </span>
        </button>
      </div>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="hero__footer">
        <span>
          UNOFFICIAL CONCEPT / 2026
        </span>

        <span className="hero__scroll">
          SCROLL TO EXPLORE
        </span>

        <span>
          NOT FROM HERE
        </span>
      </footer>
    </section>
  )
}

export default Hero