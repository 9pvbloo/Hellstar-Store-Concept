import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'

import gsap from 'gsap'

import './CartDrawer.css'

import type {
  CartItem,
} from '../../data/cart'

type CartDrawerProps = {
  items: CartItem[]
  onClose: () => void

  onIncrease: (
    productId: string,
    size: string,
  ) => void

  onDecrease: (
    productId: string,
    size: string,
  ) => void

  onRemove: (
    productId: string,
    size: string,
  ) => void
}

function CartDrawer({
  items,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
}: CartDrawerProps) {
  const rootRef =
    useRef<HTMLDivElement>(null)

  const closingRef =
    useRef(false)

  const subtotalPen =
    items.reduce(
      (total, item) =>
        total +
        item.product.pricePen *
          item.quantity,
      0,
    )

  const subtotalUsd =
    items.reduce(
      (total, item) =>
        total +
        item.product.priceUsd *
          item.quantity,
      0,
    )

  const totalQuantity =
    items.reduce(
      (total, item) =>
        total + item.quantity,
      0,
    )

  /* =========================================
     CLOSE
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
        '.cart-drawer__panel',
        {
          xPercent: 105,
          duration: 0.62,
          ease: 'power4.inOut',
        },
        0,
      )

      timeline.to(
        '.cart-drawer__backdrop',
        {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
        },
        0.1,
      )
    }, [onClose])

  /* =========================================
     ESC + BODY LOCK
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
            '.cart-drawer__backdrop',
            {
              opacity: 0,
            },
          )

          gsap.set(
            '.cart-drawer__panel',
            {
              xPercent: 105,
            },
          )

          gsap.set(
            [
              '.cart-drawer__header',
              '.cart-drawer__item',
              '.cart-drawer__summary',
            ],
            {
              opacity: 0,
              x: 18,
            },
          )

          const timeline =
            gsap.timeline()

          timeline.to(
            '.cart-drawer__backdrop',
            {
              opacity: 1,
              duration: 0.45,
              ease: 'power2.out',
            },
            0,
          )

          timeline.to(
            '.cart-drawer__panel',
            {
              xPercent: 0,
              duration: 0.82,
              ease: 'power4.out',
            },
            0.04,
          )

          timeline.to(
            '.cart-drawer__header',
            {
              opacity: 1,
              x: 0,
              duration: 0.45,
              ease: 'power3.out',
            },
            0.38,
          )

          timeline.to(
            '.cart-drawer__item',
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              stagger: 0.06,
              ease: 'power3.out',
            },
            0.46,
          )

          timeline.to(
            '.cart-drawer__summary',
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              ease: 'power3.out',
            },
            0.56,
          )
        },
        root,
      )

    return () => {
      context.revert()
    }
  }, [])

  return (
    <div
      ref={rootRef}
      className="cart-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping bag"
    >
      <button
        className="cart-drawer__backdrop"
        type="button"
        aria-label="Close cart"
        onClick={handleClose}
      />

      <aside className="cart-drawer__panel">
        {/* HEADER */}

        <header className="cart-drawer__header">
          <div>
            <span className="cart-drawer__eyebrow">
              GARMENT SYSTEM
            </span>

            <h2>
              BAG /{' '}
              {String(
                totalQuantity,
              ).padStart(
                2,
                '0',
              )}
            </h2>
          </div>

          <button
            className="cart-drawer__close"
            type="button"
            onClick={handleClose}
          >
            CLOSE / ESC
          </button>
        </header>

        {/* ITEMS */}

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <span>
                BAG / EMPTY
              </span>

              <p>
                NO OBJECTS ADDED TO THIS
                REALITY.
              </p>

              <button
                type="button"
                onClick={handleClose}
              >
                RETURN TO DROP ↗
              </button>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {items.map(
                (item) => {
                  const key =
                    `${item.product.id}-${item.size}`

                  return (
                    <article
                      key={key}
                      className="cart-drawer__item"
                    >
                      <div className="cart-drawer__visual">
                        <span className="cart-drawer__object-code">
                          OBJECT /{' '}
                          {item.product.id}
                        </span>

                        <img
                          src={
                            item.product.image
                          }
                          alt={
                            item.product.name
                          }
                          draggable="false"
                        />
                      </div>

                      <div className="cart-drawer__item-info">
                        <div className="cart-drawer__item-head">
                          <div>
                            <span className="cart-drawer__category">
                              {
                                item.product
                                  .category
                              }
                            </span>

                            <h3>
                              {
                                item.product
                                  .name
                              }
                            </h3>
                          </div>

                          <button
                            className="cart-drawer__remove"
                            type="button"
                            onClick={() =>
                              onRemove(
                                item.product.id,
                                item.size,
                              )
                            }
                          >
                            REMOVE
                          </button>
                        </div>

                        <div className="cart-drawer__meta">
                          <span>
                            SIZE /{' '}
                            {item.size}
                          </span>

                          <span>
                            {
                              item.product
                                .colorway
                            }
                          </span>
                        </div>

                        <div className="cart-drawer__item-bottom">
                          <div className="cart-drawer__quantity">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                onDecrease(
                                  item.product
                                    .id,
                                  item.size,
                                )
                              }
                            >
                              −
                            </button>

                            <span>
                              {String(
                                item.quantity,
                              ).padStart(
                                2,
                                '0',
                              )}
                            </span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                onIncrease(
                                  item.product
                                    .id,
                                  item.size,
                                )
                              }
                            >
                              +
                            </button>
                          </div>

                          <div className="cart-drawer__item-price">
                            <strong>
                              S/.{' '}
                              {(
                                item.product
                                  .pricePen *
                                item.quantity
                              ).toFixed(
                                2,
                              )}
                            </strong>

                            <span>
                              USD $
                              {(
                                item.product
                                  .priceUsd *
                                item.quantity
                              ).toFixed(
                                2,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </article>
                  )
                },
              )}
            </div>
          )}
        </div>

        {/* SUMMARY */}

        {items.length > 0 && (
          <footer className="cart-drawer__summary">
            <div className="cart-drawer__summary-row">
              <span>
                SUBTOTAL
              </span>

              <div>
                <strong>
                  S/.{' '}
                  {subtotalPen.toFixed(
                    2,
                  )}
                </strong>

                <span>
                  USD $
                  {subtotalUsd.toFixed(
                    2,
                  )}
                </span>
              </div>
            </div>

            <p className="cart-drawer__note">
              SHIPPING AND TAXES CALCULATED
              AT CHECKOUT.
            </p>

            <button
              className="cart-drawer__checkout"
              type="button"
            >
              <span>
                PROCEED TO CHECKOUT
              </span>

              <span>
                ↗
              </span>
            </button>

            <span className="cart-drawer__concept">
              HELLSTAR — UNOFFICIAL
              CONCEPT
            </span>
          </footer>
        )}
      </aside>
    </div>
  )
}

export default CartDrawer