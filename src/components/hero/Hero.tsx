import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import gsap from 'gsap'

import './Hero.css'
import HeroStickers from './HeroStickers'

import hoodiePathToParadise from '../../assets/products/hoodie-01-black-path-to-paradise.png'
import hoodieGreyPinkFlame from '../../assets/products/hoodie-02-grey-pink-flame.png'
import hoodieRedRecords from '../../assets/products/hoodie-03-red-records.png'

type HeroProduct = {
  id: string
  title: string
  type: string
  metaTitle: string
  category: string
  image: string
  alt: string
}

const products: HeroProduct[] = [
  {
    id: '01',
    title: 'PATH TO PARADISE',
    type: 'BLACK GRAPHIC HOODIE',
    metaTitle: 'PATH TO PARADISE',
    category: 'HOODIE',
    image: hoodiePathToParadise,
    alt: 'Black Path to Paradise graphic hoodie',
  },
  {
    id: '02',
    title: 'GREY PINK FLAME',
    type: 'GREY / PINK GRAPHIC HOODIE',
    metaTitle: 'GREY PINK FLAME',
    category: 'HOODIE',
    image: hoodieGreyPinkFlame,
    alt: 'Grey and pink flame graphic hoodie',
  },
  {
    id: '03',
    title: 'RED RECORDS',
    type: 'RED GRAPHIC HOODIE',
    metaTitle: 'RED RECORDS',
    category: 'HOODIE',
    image: hoodieRedRecords,
    alt: 'Red Records graphic hoodie',
  },
]

function Hero() {
  const heroRef =
    useRef<HTMLElement>(null)

  const productStageRef =
    useRef<HTMLDivElement>(null)

  const productFloatRef =
    useRef<HTMLDivElement>(null)

  const productRef =
    useRef<HTMLElement>(null)

  const productCopyRef =
    useRef<HTMLDivElement>(null)

  const leftMetaRef =
    useRef<HTMLDivElement>(null)

  const rightMetaRef =
    useRef<HTMLDivElement>(null)

  const wordmarkRef =
    useRef<HTMLDivElement>(null)

  const haloRef =
    useRef<HTMLDivElement>(null)

  const switchingRef =
    useRef(false)

  const introReadyRef =
    useRef(false)

  const firstProductRenderRef =
    useRef(true)

  const switchDirectionRef =
    useRef(1)

  const [
    activeProductIndex,
    setActiveProductIndex,
  ] =
    useState(0)

  const activeProduct =
    products[activeProductIndex]

  /* =========================================
     PRELOAD PRODUCTS
  ========================================= */

  useEffect(() => {
    products.forEach(
      (product) => {
        const image =
          new Image()

        image.src =
          product.image
      },
    )
  }, [])

  /* =========================================
     INITIAL HERO + IDLE MOTION
  ========================================= */

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
      introReadyRef.current = true
      return
    }

    const finePointer =
      window.matchMedia(
        '(pointer: fine)',
      ).matches

    const context =
      gsap.context(
        () => {
          /* =============================
             INITIAL STATE
          ============================= */

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
              filter:
                'blur(10px)',
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

          /* =============================
             HERO REVEAL
          ============================= */

          const timeline =
            gsap.timeline({
              defaults: {
                ease:
                  'power3.out',
              },
            })

          timeline.to(
            '.hero__wordmark',
            {
              opacity: 0.18,
              scale: 1,
              y: 0,

              duration: 1.2,

              ease:
                'power4.out',
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

              filter:
                'blur(0px)',

              duration: 1.35,

              ease:
                'power4.out',
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

          /*
           * Libera el transform del producto
           * para que su hover CSS siga
           * funcionando después del intro.
           */

          timeline.set(
            '.hero__product',
            {
              clearProps:
                'transform,filter,opacity',
            },
            1.5,
          )

          timeline.call(
            () => {
              introReadyRef.current =
                true
            },
            [],
            1.55,
          )

          /* =============================
             IDLE FLOAT
          ============================= */

          gsap.to(
            productFloat,
            {
              y: -9,

              rotation: 0.35,

              duration: 3.4,

              repeat: -1,
              yoyo: true,

              ease:
                'sine.inOut',

              delay: 1.25,
            },
          )

          /* =============================
             HALO BREATHING
          ============================= */

          gsap.to(
            halo,
            {
              scale: 1.08,

              opacity: 0.72,

              duration: 4.2,

              repeat: -1,
              yoyo: true,

              ease:
                'sine.inOut',

              delay: 1.1,
            },
          )
        },
        root,
      )

    /* =====================================
       POINTER PARALLAX
    ===================================== */

    if (finePointer) {
      const productX =
        gsap.quickTo(
          productStage,
          'x',
          {
            duration: 0.75,
            ease:
              'power3.out',
          },
        )

      const productY =
        gsap.quickTo(
          productStage,
          'y',
          {
            duration: 0.75,
            ease:
              'power3.out',
          },
        )

      const wordmarkX =
        gsap.quickTo(
          wordmark,
          'x',
          {
            duration: 1,
            ease:
              'power3.out',
          },
        )

      const wordmarkY =
        gsap.quickTo(
          wordmark,
          'y',
          {
            duration: 1,
            ease:
              'power3.out',
          },
        )

      const haloX =
        gsap.quickTo(
          halo,
          'x',
          {
            duration: 1.1,
            ease:
              'power3.out',
          },
        )

      const haloY =
        gsap.quickTo(
          halo,
          'y',
          {
            duration: 1.1,
            ease:
              'power3.out',
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

        /* Product layer */

        productX(
          normalizedX * 16,
        )

        productY(
          normalizedY * 10,
        )

        /* Counter-parallax */

        wordmarkX(
          normalizedX * -10,
        )

        wordmarkY(
          normalizedY * -6,
        )

        /* Halo */

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

        introReadyRef.current =
          false

        context.revert()
      }
    }

    return () => {
      introReadyRef.current =
        false

      context.revert()
    }
  }, [])

  /* =========================================
     PRODUCT ENTER ANIMATION
  ========================================= */

  useLayoutEffect(() => {
    /*
     * Ignore initial render because
     * initial Hero timeline already handles it.
     */

    if (
      firstProductRenderRef.current
    ) {
      firstProductRenderRef.current =
        false

      return
    }

    const product =
      productRef.current

    const productCopy =
      productCopyRef.current

    const leftMeta =
      leftMetaRef.current

    const rightMeta =
      rightMetaRef.current

    if (
      !product ||
      !productCopy ||
      !leftMeta ||
      !rightMeta
    ) {
      switchingRef.current = false
      return
    }

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (reducedMotion) {
      switchingRef.current = false
      return
    }

    const direction =
      switchDirectionRef.current

    gsap.killTweensOf(
      [
        product,
        productCopy,
        leftMeta,
        rightMeta,
      ],
    )

    gsap.set(
      product,
      {
        opacity: 0,

        x:
          direction * -36,

        y: 14,

        scale: 0.94,

        filter:
          'blur(10px)',
      },
    )

    gsap.set(
      [
        productCopy,
        leftMeta,
        rightMeta,
      ],
      {
        opacity: 0,
        y: 12,
      },
    )

    const timeline =
      gsap.timeline({
        onComplete: () => {
          gsap.set(
            product,
            {
              clearProps:
                'transform,filter,opacity',
            },
          )

          switchingRef.current =
            false
        },
      })

    timeline.to(
      product,
      {
        opacity: 1,

        x: 0,
        y: 0,

        scale: 1,

        filter:
          'blur(0px)',

        duration: 0.62,

        ease:
          'power4.out',
      },
      0,
    )

    timeline.to(
      [
        leftMeta,
        rightMeta,
      ],
      {
        opacity: 1,

        y: 0,

        duration: 0.42,

        stagger: 0.04,

        ease:
          'power3.out',
      },
      0.12,
    )

    timeline.to(
      productCopy,
      {
        opacity: 1,

        y: 0,

        duration: 0.48,

        ease:
          'power3.out',
      },
      0.18,
    )

    return () => {
      timeline.kill()
    }
  }, [activeProductIndex])

  /* =========================================
     CHANGE PRODUCT
  ========================================= */

  const handleSelectProduct = (
    nextIndex: number,
  ) => {
    if (
      nextIndex ===
        activeProductIndex ||
      switchingRef.current ||
      !introReadyRef.current
    ) {
      return
    }

    const product =
      productRef.current

    const productCopy =
      productCopyRef.current

    const leftMeta =
      leftMetaRef.current

    const rightMeta =
      rightMetaRef.current

    if (
      !product ||
      !productCopy ||
      !leftMeta ||
      !rightMeta
    ) {
      return
    }

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    switchDirectionRef.current =
      nextIndex >
      activeProductIndex
        ? 1
        : -1

    if (reducedMotion) {
      setActiveProductIndex(
        nextIndex,
      )

      return
    }

    switchingRef.current = true

    const direction =
      switchDirectionRef.current

    gsap.killTweensOf(
      [
        product,
        productCopy,
        leftMeta,
        rightMeta,
      ],
    )

    gsap.to(
      [
        leftMeta,
        rightMeta,
        productCopy,
      ],
      {
        opacity: 0,

        y: -8,

        duration: 0.22,

        ease:
          'power2.in',
      },
    )

    gsap.to(
      product,
      {
        opacity: 0,

        x:
          direction * 34,

        y: -10,

        scale: 0.95,

        filter:
          'blur(8px)',

        duration: 0.34,

        ease:
          'power3.in',

        onComplete: () => {
          setActiveProductIndex(
            nextIndex,
          )
        },
      },
    )
  }

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
        ref={leftMetaRef}
        className="hero__meta hero__meta--left"
        aria-hidden="true"
      >
        <span>
          COLLECTION / 001
        </span>

        <span>
          {activeProduct.metaTitle}
        </span>

        <span>
          LIMITED CONCEPT DROP
        </span>
      </div>

      <div
        ref={rightMetaRef}
        className="hero__meta hero__meta--right"
        aria-hidden="true"
      >
        <span>
          ITEM / {activeProduct.id}
        </span>

        <span>
          CATEGORY / {activeProduct.category}
        </span>

        <span>
          STATUS / AVAILABLE
        </span>
      </div>

      {/* =====================================
          STICKER SYSTEM
      ===================================== */}

      <HeroStickers />

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
          <figure
            ref={productRef}
            className="hero__product"
          >
            <img
              src={activeProduct.image}
              alt={activeProduct.alt}
              draggable="false"
            />
          </figure>
        </div>
      </div>

      {/* =====================================
          PRODUCT INFO
      ===================================== */}

      <div className="hero__product-info">
        {/* PRODUCT SELECTOR */}

        <div
          className="hero__product-switcher"
          aria-label="Select featured product"
        >
          {products.map(
            (
              product,
              index,
            ) => {
              const active =
                index ===
                activeProductIndex

              return (
                <button
                  key={product.id}
                  className={`hero__product-switch ${
                    active
                      ? 'hero__product-switch--active'
                      : ''
                  }`}
                  type="button"
                  aria-label={`Show ${product.title}`}
                  aria-pressed={
                    active
                  }
                  onClick={() =>
                    handleSelectProduct(
                      index,
                    )
                  }
                >
                  {product.id}
                </button>
              )
            },
          )}
        </div>

        {/* DYNAMIC PRODUCT COPY */}

        <div
          ref={productCopyRef}
          className="hero__product-copy"
        >
          <h1
            id="hero-product-title"
            className="hero__product-title"
          >
            {activeProduct.title}
          </h1>

          <p className="hero__product-type">
            {activeProduct.type}
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