import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import gsap from 'gsap'

import './ProductDetail.css'

import type {
  StoreProduct,
} from '../../data/products'

type ProductDetailProps = {
  product: StoreProduct
  onClose: () => void
}

function ProductDetail({
  product,
  onClose,
}: ProductDetailProps) {
  const rootRef =
    useRef<HTMLElement>(null)

  const closingRef =
    useRef(false)

  const [
    selectedSize,
    setSelectedSize,
  ] = useState(
    product.sizes.length === 1
      ? product.sizes[0]
      : '',
  )

  const isOnSale =
    product.compareAtPen !==
    undefined

  /* =========================================
     RESET SIZE
  ========================================= */

  useEffect(() => {
    setSelectedSize(
      product.sizes.length === 1
        ? product.sizes[0]
        : '',
    )
  }, [product])

  /* =========================================
     CLOSE CINEMATIC
  ========================================= */

  const handleClose =
    useCallback(() => {
      if (closingRef.current) {
        return
      }

      const root =
        rootRef.current

      if (!root) {
        onClose()
        return
      }

      const reducedMotion =
        window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches

      if (reducedMotion) {
        onClose()
        return
      }

      closingRef.current = true

      const timeline =
        gsap.timeline({
          onComplete: onClose,
        })

      timeline.to(
        [
          '.product-detail__nav',
          '.product-detail__left',
          '.product-detail__right',
          '.product-detail__bottom',
          '.product-detail__technical',
        ],
        {
          opacity: 0,
          y: 12,

          duration: 0.28,

          stagger: 0.025,

          ease: 'power2.in',
        },
        0,
      )

      timeline.to(
        '.product-detail__image',
        {
          opacity: 0,

          scale: 0.88,

          y: 34,

          filter:
            'blur(10px)',

          duration: 0.48,

          ease: 'power3.in',
        },
        0.05,
      )

      timeline.to(
        '.product-detail__wordmark',
        {
          opacity: 0,

          scale: 0.97,

          duration: 0.28,

          ease: 'power2.in',
        },
        0.08,
      )

      timeline.to(
        '.product-detail__band',
        {
          clipPath:
            'inset(0 50% 0 50%)',

          duration: 0.48,

          ease: 'power3.inOut',
        },
        0.16,
      )

      timeline.to(
        '.product-detail__backdrop',
        {
          opacity: 0,

          duration: 0.3,

          ease: 'power2.inOut',
        },
        0.34,
      )
    }, [onClose])

  /* =========================================
     BODY LOCK + ESC
  ========================================= */

  useEffect(() => {
    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      'hidden'

    const handleKeyDown = (
      event: KeyboardEvent,
    ) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener(
      'keydown',
      handleKeyDown,
    )

    return () => {
      document.body.style.overflow =
        previousOverflow

      window.removeEventListener(
        'keydown',
        handleKeyDown,
      )
    }
  }, [handleClose])

  /* =========================================
     ENTER CINEMATIC
  ========================================= */

  useLayoutEffect(() => {
    const root =
      rootRef.current

    if (!root) return

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (reducedMotion) return

    const context =
      gsap.context(
        () => {
          gsap.set(
            '.product-detail__backdrop',
            {
              opacity: 0,
            },
          )

          gsap.set(
            '.product-detail__band',
            {
              clipPath:
                'inset(0 50% 0 50%)',
            },
          )

          gsap.set(
            '.product-detail__wordmark',
            {
              opacity: 0,
              scale: 1.055,
            },
          )

          gsap.set(
            '.product-detail__image',
            {
              opacity: 0,

              scale: 0.84,

              y: 58,

              rotate: -1.5,

              filter:
                'blur(14px)',
            },
          )

          gsap.set(
            [
              '.product-detail__nav',
              '.product-detail__left',
              '.product-detail__right',
              '.product-detail__bottom',
              '.product-detail__technical',
            ],
            {
              opacity: 0,
              y: 18,
            },
          )

          const timeline =
            gsap.timeline()

          timeline.to(
            '.product-detail__backdrop',
            {
              opacity: 1,

              duration: 0.42,

              ease: 'power2.out',
            },
            0,
          )

          timeline.to(
            '.product-detail__band',
            {
              clipPath:
                'inset(0 0% 0 0%)',

              duration: 0.9,

              ease: 'power4.inOut',
            },
            0.06,
          )

          timeline.to(
            '.product-detail__wordmark',
            {
              opacity: 1,

              scale: 1,

              duration: 0.9,

              ease: 'power4.out',
            },
            0.28,
          )

          timeline.to(
            '.product-detail__image',
            {
              opacity: 1,

              scale: 1,

              y: 0,

              rotate: 0,

              filter:
                'blur(0px)',

              duration: 1.08,

              ease: 'power4.out',
            },
            0.24,
          )

          timeline.to(
            '.product-detail__nav',
            {
              opacity: 1,
              y: 0,

              duration: 0.5,

              ease: 'power3.out',
            },
            0.4,
          )

          timeline.to(
            [
              '.product-detail__left',
              '.product-detail__right',
              '.product-detail__technical',
              '.product-detail__bottom',
            ],
            {
              opacity: 1,
              y: 0,

              duration: 0.64,

              stagger: 0.065,

              ease: 'power3.out',
            },
            0.48,
          )
        },
        root,
      )

    return () => {
      context.revert()
    }
  }, [product.id])

  return (
    <section
      ref={rootRef}
      className="product-detail"
      data-category={product.category}
      aria-labelledby="product-detail-title"
    >
      {/* =====================================
          BLACK WORLD
      ===================================== */}

      <div
        className="product-detail__backdrop"
        aria-hidden="true"
      />

      {/* =====================================
          EDITORIAL BONE BAND
      ===================================== */}

      <div
        className="product-detail__band"
        aria-hidden="true"
      >
        <div className="product-detail__wordmark">
          HELLSTAR
        </div>

        <span className="product-detail__band-code product-detail__band-code--left">
          REALITY / 001
        </span>

        <span className="product-detail__band-code product-detail__band-code--right">
          FW / 2026
        </span>
      </div>

      {/* =====================================
          TECHNICAL RAILS
      ===================================== */}

      <div
        className="product-detail__rail product-detail__rail--left"
        aria-hidden="true"
      />

      <div
        className="product-detail__rail product-detail__rail--right"
        aria-hidden="true"
      />

      {/* =====================================
          NAV
      ===================================== */}

      <header className="product-detail__nav">
        <span className="product-detail__brand">
          HELLSTAR
        </span>

        <span className="product-detail__nav-center">
          DROP / 001

          <span>
            /
          </span>

          OBJECT / {product.id}
        </span>

        <button
          className="product-detail__close"
          type="button"
          onClick={handleClose}
        >
          CLOSE / ESC
        </button>
      </header>

      {/* =====================================
          LEFT EDITORIAL COPY
      ===================================== */}

      <div className="product-detail__left">
        <span className="product-detail__eyebrow">
          DROP / 001
        </span>

        <h2
          id="product-detail-title"
          className="product-detail__title"
        >
          {product.name}
        </h2>

        <div className="product-detail__availability">
          <span
            className="product-detail__status-dot"
            aria-hidden="true"
          />

          <span>
            STATUS / AVAILABLE
          </span>
        </div>
      </div>

      {/* =====================================
          CENTRAL GARMENT
      ===================================== */}

      <div className="product-detail__stage">
        <div
          className="product-detail__halo"
          aria-hidden="true"
        />

        <span
          className="product-detail__coordinate product-detail__coordinate--top"
          aria-hidden="true"
        >
          GARMENT / OBJECT {product.id}
        </span>

        <span
          className="product-detail__coordinate product-detail__coordinate--bottom"
          aria-hidden="true"
        >
          HS / FW26 / 001
        </span>

        <img
          className="product-detail__image"
          src={product.image}
          alt={product.name}
          draggable="false"
        />
      </div>

      {/* =====================================
          COMMERCE PANEL
      ===================================== */}

      <aside className="product-detail__right">
        <div className="product-detail__meta">
          <div>
            <span>
              OBJECT
            </span>

            <strong>
              {product.id}
            </strong>
          </div>

          <div>
            <span>
              CATEGORY
            </span>

            <strong>
              {product.category}
            </strong>
          </div>

          <div>
            <span>
              COLOR
            </span>

            <strong>
              {product.colorway}
            </strong>
          </div>

          <div>
            <span>
              COLLECTION
            </span>

            <strong>
              FW / 2026
            </strong>
          </div>
        </div>

        {/* PRICE */}

        <div className="product-detail__price">
          <span className="product-detail__label">
            PRICE
          </span>

          {isOnSale && (
            <div className="product-detail__price-old">
              <span>
                S/.{' '}
                {product.compareAtPen?.toFixed(
                  2,
                )}
              </span>

              <span className="product-detail__sale">
                OFERTA
              </span>
            </div>
          )}

          <div className="product-detail__price-current">
            S/.{' '}
            {product.pricePen.toFixed(
              2,
            )}
          </div>

          <div className="product-detail__price-usd">
            {isOnSale &&
              product.compareAtUsd !==
                undefined && (
                <span className="product-detail__usd-old">
                  USD $
                  {product.compareAtUsd.toFixed(
                    2,
                  )}
                </span>
              )}

            <span>
              USD $
              {product.priceUsd.toFixed(
                2,
              )}
            </span>
          </div>
        </div>

        {/* SIZE */}

        <div className="product-detail__sizes">
          <div className="product-detail__size-header">
            <span className="product-detail__label">
              SELECT SIZE
            </span>

            {selectedSize && (
              <span className="product-detail__selected-size">
                / {selectedSize}
              </span>
            )}
          </div>

          <div className="product-detail__size-list">
            {product.sizes.map(
              (size) => (
                <button
                  key={size}
                  type="button"
                  className={
                    selectedSize === size
                      ? 'is-active'
                      : ''
                  }
                  aria-pressed={
                    selectedSize === size
                  }
                  onClick={() =>
                    setSelectedSize(
                      size,
                    )
                  }
                >
                  {size}
                </button>
              ),
            )}
          </div>
        </div>

        {/* BAG */}

        <button
          className="product-detail__bag"
          type="button"
          disabled={!selectedSize}
        >
          <span>
            {selectedSize
              ? 'ADD TO BAG'
              : 'SELECT A SIZE'}
          </span>

          <span
            className="product-detail__bag-arrow"
            aria-hidden="true"
          >
            ↗
          </span>
        </button>
      </aside>

      {/* =====================================
          MICRO TECH
      ===================================== */}

      <div
        className="product-detail__technical"
        aria-hidden="true"
      >
        <span>
          GARMENT SYSTEM
        </span>

        <span>
          SIGNAL / 100%
        </span>

        <span>
          READY / 001
        </span>
      </div>

      {/* =====================================
          FOOTER
      ===================================== */}

      <footer className="product-detail__bottom">
        <span>
          HELLSTAR — UNOFFICIAL CONCEPT
        </span>

        <span>
          OBJECT SYSTEM / {product.id}
        </span>

        <span>
          {product.category} / FW 2026
        </span>
      </footer>
    </section>
  )
}

export default ProductDetail