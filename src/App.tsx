import {
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import gsap from 'gsap'

import './App.css'

import EntryLogo3D from './components/entry/EntryLogo3D'
import DotField from './components/backgrounds/DotField/DotField'
import Hero from './components/hero/Hero'
import DropGrid from './components/drop/DropGrid'
import ProductDetail from './components/product/ProductDetail'
import CartDrawer from './components/cart/CartDrawer'
import Lookbook from './components/lookbook/Lookbook'
import CheckoutConcept from './components/checkout/CheckoutConcept'

import type {
  StoreProduct,
} from './data/products'

import type {
  CartItem,
} from './data/cart'

function App() {
  const entryRef =
    useRef<HTMLElement>(null)

  const transitioningRef =
    useRef(false)

  const [
    transitioning,
    setTransitioning,
  ] = useState(false)

  const [
    heroVisible,
    setHeroVisible,
  ] = useState(false)

  const [
    selectedProduct,
    setSelectedProduct,
  ] =
    useState<StoreProduct | null>(
      null,
    )

  const [
    cartItems,
    setCartItems,
  ] =
    useState<CartItem[]>([])

  const [
    cartOpen,
    setCartOpen,
  ] =
    useState(false)

  const [
    checkoutOpen,
    setCheckoutOpen,
  ] =
    useState(false)

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

    const context =
      gsap.context(
        () => {
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

          gsap.set(
            '.entry__transition-cover',
            {
              opacity: 0,
            },
          )

          const timeline =
            gsap.timeline({
              defaults: {
                ease:
                  'power3.out',
              },
            })

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

          timeline.to(
            '.entry__hud',
            {
              opacity: 1,

              y: 0,

              duration: 0.65,

              stagger: 0.08,

              ease:
                'power2.out',
            },
            1.18,
          )

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

          timeline.to(
            '.entry__subtitle',
            {
              opacity: 1,

              y: 0,

              duration: 0.65,
            },
            1.72,
          )

          timeline.to(
            '.entry__footer',
            {
              opacity: 1,

              y: 0,

              duration: 0.65,
            },
            1.92,
          )

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
     ENTER → BLACKOUT → HERO
  ========================================= */

  useLayoutEffect(() => {
    if (!transitioning) {
      return
    }

    const root =
      entryRef.current

    if (!root) return

    const context =
      gsap.context(
        () => {
          gsap.killTweensOf(
            '.entry__enter',
          )

          const timeline =
            gsap.timeline({
              defaults: {
                ease:
                  'power3.inOut',
              },
            })

          timeline.to(
            '.entry__hud',
            {
              opacity: 0,

              duration: 0.28,

              stagger: 0.035,
            },
            0,
          )

          timeline.to(
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

          timeline.to(
            '.entry__enter',
            {
              opacity: 0,

              y: 18,

              scale: 0.96,

              letterSpacing:
                '0.05em',

              duration: 0.38,
            },
            0.08,
          )

          timeline.to(
            '.entry__subtitle',
            {
              opacity: 0,

              y: 10,

              duration: 0.3,
            },
            0.12,
          )

          timeline.to(
            '.entry__pattern',
            {
              opacity: 0,

              duration: 0.48,
            },
            0.18,
          )

          timeline.to(
            '.entry__dot-field',
            {
              opacity: 0.12,

              scale: 1.08,

              duration: 0.72,

              ease:
                'power2.inOut',
            },
            0.16,
          )

          timeline.to(
            '.entry__emblem',
            {
              scale: 1.07,

              y: -4,

              duration: 0.42,

              ease:
                'power2.out',
            },
            0.12,
          )

          timeline.to(
            '.entry__emblem',
            {
              scale: 1.2,

              opacity: 0.7,

              filter:
                'blur(1.5px)',

              duration: 0.58,

              ease:
                'power3.in',
            },
            0.48,
          )

          timeline.to(
            '.entry__transition-cover',
            {
              opacity: 1,

              duration: 0.42,

              ease:
                'power2.inOut',
            },
            0.7,
          )

          timeline.call(
            () => {
              setHeroVisible(true)
            },
            [],
            0.96,
          )

          timeline.to(
            '.entry__transition-cover',
            {
              opacity: 0,

              duration: 0.58,

              ease:
                'power2.inOut',
            },
            1.02,
          )
        },
        root,
      )

    return () => {
      context.revert()
    }
  }, [transitioning])

  /* =========================================
     ENTER CLICK
  ========================================= */

  const handleEnter = () => {
    if (
      transitioningRef.current
    ) {
      return
    }

    transitioningRef.current =
      true

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (reducedMotion) {
      setHeroVisible(true)
      return
    }

    setTransitioning(true)
  }

  /* =========================================
     ADD TO CART
  ========================================= */

  const handleAddToCart = (
    product: StoreProduct,
    size: string,
  ) => {
    setCartItems(
      (currentItems) => {
        const existingIndex =
          currentItems.findIndex(
            (item) =>
              item.product.id ===
                product.id &&
              item.size === size,
          )

        if (
          existingIndex === -1
        ) {
          return [
            ...currentItems,
            {
              product,
              size,
              quantity: 1,
            },
          ]
        }

        return currentItems.map(
          (item, index) =>
            index ===
            existingIndex
              ? {
                  ...item,

                  quantity:
                    item.quantity +
                    1,
                }
              : item,
        )
      },
    )
  }

  /* =========================================
     CART QUANTITY +
  ========================================= */

  const handleIncreaseCartItem = (
    productId: string,
    size: string,
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.map(
          (item) =>
            item.product.id ===
                productId &&
            item.size === size
              ? {
                  ...item,

                  quantity:
                    item.quantity +
                    1,
                }
              : item,
        ),
    )
  }

  /* =========================================
     CART QUANTITY -
  ========================================= */

  const handleDecreaseCartItem = (
    productId: string,
    size: string,
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.flatMap(
          (item) => {
            const matches =
              item.product.id ===
                productId &&
              item.size === size

            if (!matches) {
              return [item]
            }

            if (
              item.quantity <= 1
            ) {
              return []
            }

            return [
              {
                ...item,

                quantity:
                  item.quantity -
                  1,
              },
            ]
          },
        ),
    )
  }

  /* =========================================
     REMOVE CART ITEM
  ========================================= */

  const handleRemoveCartItem = (
    productId: string,
    size: string,
  ) => {
    setCartItems(
      (currentItems) =>
        currentItems.filter(
          (item) =>
            !(
              item.product.id ===
                productId &&
              item.size === size
            ),
        ),
    )
  }

  /* =========================================
     OPEN CHECKOUT
  ========================================= */

  const handleOpenCheckout =
    () => {
      setCartOpen(false)
      setCheckoutOpen(true)
    }

  /* =========================================
     CART COUNT
  ========================================= */

  const cartCount =
    cartItems.reduce(
      (total, item) =>
        total +
        item.quantity,
      0,
    )

  return (
    <>
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
          <div
            className="entry__hud entry__hud--left"
            aria-hidden="true"
          >
            <div className="entry__hud-status">
              <span
                className="entry__hud-dot"
              />

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

          <div
            className="entry__emblem entry__emblem--3d"
            aria-hidden="true"
          >
            <EntryLogo3D />
          </div>

          <button
            className="entry__enter"
            type="button"
            onClick={handleEnter}
          >
            ENTER
          </button>

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
            HERO
        ===================================== */}

        {heroVisible && (
          <Hero
            cartCount={
              cartCount
            }
            onOpenCart={() =>
              setCartOpen(true)
            }
          />
        )}

        {/* =====================================
            BLACK TRANSITION COVER
        ===================================== */}

        <div
          className="entry__transition-cover"
          aria-hidden="true"
        />
      </main>

      {/* =====================================
          DROP GRID
      ===================================== */}

      {heroVisible && (
        <DropGrid
          onSelectProduct={
            setSelectedProduct
          }
        />
      )}

      {/* =====================================
          LOOKBOOK
      ===================================== */}

      {heroVisible && (
        <Lookbook
          onSelectProduct={
            setSelectedProduct
          }
        />
      )}

      {/* =====================================
          PRODUCT DETAIL
      ===================================== */}

      {selectedProduct && (
        <ProductDetail
          key={selectedProduct.id}
          product={
            selectedProduct
          }
          onAddToCart={
            handleAddToCart
          }
          onClose={() =>
            setSelectedProduct(
              null,
            )
          }
        />
      )}

      {/* =====================================
          CART DRAWER
      ===================================== */}

      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() =>
            setCartOpen(false)
          }
          onCheckout={
            handleOpenCheckout
          }
          onIncrease={
            handleIncreaseCartItem
          }
          onDecrease={
            handleDecreaseCartItem
          }
          onRemove={
            handleRemoveCartItem
          }
        />
      )}

      {/* =====================================
          CHECKOUT CONCEPT
      ===================================== */}

      {checkoutOpen && (
        <CheckoutConcept
          items={cartItems}
          onClose={() =>
            setCheckoutOpen(
              false,
            )
          }
        />
      )}
    </>
  )
}

export default App
