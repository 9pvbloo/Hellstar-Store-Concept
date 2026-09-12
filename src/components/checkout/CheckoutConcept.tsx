import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import type {
  FormEvent,
} from 'react'

import gsap from 'gsap'

import './CheckoutConcept.css'

import useDialogFocus from '../../hooks/useDialogFocus'

import type {
  CartItem,
} from '../../data/cart'

type CheckoutConceptProps = {
  items: CartItem[]
  onClose: () => void
}

type CheckoutStep =
  | 'information'
  | 'review'
  | 'complete'

function CheckoutConcept({
  items,
  onClose,
}: CheckoutConceptProps) {
  const rootRef =
    useRef<HTMLElement>(null)

  const closingRef =
    useRef(false)

  const closeButtonRef =
    useRef<HTMLButtonElement>(null)

  const informationHeadingRef =
    useRef<HTMLHeadingElement>(null)

  const reviewHeadingRef =
    useRef<HTMLHeadingElement>(null)

  const completeHeadingRef =
    useRef<HTMLHeadingElement>(null)

  const pendingStepFocusRef =
    useRef<CheckoutStep | null>(null)

  const isStepTransitioningRef =
    useRef(false)

  useDialogFocus({
    rootRef,
    initialFocusRef: closeButtonRef,
  })

  const [
    step,
    setStep,
  ] =
    useState<CheckoutStep>(
      'information',
    )

  const [
    firstName,
    setFirstName,
  ] = useState('')

  const [
    lastName,
    setLastName,
  ] = useState('')

  const [
    email,
    setEmail,
  ] = useState('')

  const [
    country,
    setCountry,
  ] = useState('')

  const [
    city,
    setCity,
  ] = useState('')

  const [
    address,
    setAddress,
  ] = useState('')

  const [
    shipping,
    setShipping,
  ] =
    useState('standard')

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

  const itemCount =
    items.reduce(
      (total, item) =>
        total +
        item.quantity,
      0,
    )

  const shippingPen =
    shipping === 'express'
      ? 49.9
      : 0

  const shippingUsd =
    shipping === 'express'
      ? 13.9
      : 0

  const totalPen =
    subtotalPen +
    shippingPen

  const totalUsd =
    subtotalUsd +
    shippingUsd

  const isInformationValid =
    firstName.trim() !== '' &&
    lastName.trim() !== '' &&
    email.trim() !== '' &&
    country.trim() !== '' &&
    city.trim() !== '' &&
    address.trim() !== ''

  const focusStepHeading =
    useCallback((
      nextStep: CheckoutStep,
    ) => {
      const heading =
        nextStep === 'information'
          ? informationHeadingRef.current
          : nextStep === 'review'
            ? reviewHeadingRef.current
            : completeHeadingRef.current

      if (heading) {
        heading.focus({
          preventScroll: true,
        })
      }
    }, [])

  useLayoutEffect(() => {
    if (
      pendingStepFocusRef.current !== step ||
      isStepTransitioningRef.current
    ) {
      return
    }

    focusStepHeading(step)
    pendingStepFocusRef.current = null
  }, [
    focusStepHeading,
    step,
  ])

  /* =========================================
     CLOSE
  ========================================= */

  const handleClose =
    useCallback(() => {
      if (
        closingRef.current
      ) {
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

      closingRef.current =
        true

      const timeline =
        gsap.timeline({
          onComplete:
            onClose,
        })

      timeline.to(
        '.checkout-concept__content',
        {
          opacity: 0,
          y: 18,

          duration: 0.35,

          ease:
            'power2.in',
        },
        0,
      )

      timeline.to(
        '.checkout-concept__cover',
        {
          scaleY: 1,

          duration: 0.65,

          ease:
            'power4.inOut',
        },
        0.08,
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
      if (
        event.key ===
        'Escape'
      ) {
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

    if (reducedMotion) {
      return
    }

    const context =
      gsap.context(
        () => {
          gsap.set(
            '.checkout-concept__cover',
            {
              scaleY: 1,
              transformOrigin:
                'bottom center',
            },
          )

          gsap.set(
            '.checkout-concept__content',
            {
              opacity: 0,
              y: 22,
            },
          )

          const timeline =
            gsap.timeline()

          timeline.to(
            '.checkout-concept__cover',
            {
              scaleY: 0,

              duration: 0.9,

              ease:
                'power4.inOut',
            },
            0,
          )

          timeline.to(
            '.checkout-concept__content',
            {
              opacity: 1,
              y: 0,

              duration: 0.7,

              ease:
                'power3.out',
            },
            0.48,
          )
        },
        root,
      )

    return () => {
      context.revert()
    }
  }, [])

  /* =========================================
     STEP TRANSITION
  ========================================= */

  const changeStep = (
    nextStep: CheckoutStep,
  ) => {
    pendingStepFocusRef.current =
      nextStep

    const root =
      rootRef.current

    if (!root) {
      setStep(nextStep)
      return
    }

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (reducedMotion) {
      setStep(nextStep)
      return
    }

    const panel =
      root.querySelector(
        '.checkout-concept__main',
      )

    if (!panel) {
      setStep(nextStep)
      return
    }

    isStepTransitioningRef.current =
      true

    gsap.to(
      panel,
      {
        opacity: 0,
        y: 12,

        duration: 0.22,

        ease:
          'power2.in',

        onComplete: () => {
          setStep(
            nextStep,
          )

          gsap.fromTo(
            panel,
            {
              opacity: 0,
              y: 14,
            },
            {
              opacity: 1,
              y: 0,

              duration: 0.45,

              ease:
                'power3.out',

              onComplete: () => {
                isStepTransitioningRef.current =
                  false

                if (
                  pendingStepFocusRef.current ===
                  nextStep
                ) {
                  focusStepHeading(nextStep)
                  pendingStepFocusRef.current =
                    null
                }
              },
            },
          )
        },
      },
    )
  }

  /* =========================================
     INFORMATION SUBMIT
  ========================================= */

  const handleInformationSubmit = (
    event: FormEvent,
  ) => {
    event.preventDefault()

    if (
      !isInformationValid
    ) {
      return
    }

    changeStep(
      'review',
    )
  }

  /* =========================================
     COMPLETE CONCEPT ORDER
  ========================================= */

  const handleCompleteOrder =
    () => {
      changeStep(
        'complete',
      )
    }

  return (
    <section
      ref={rootRef}
      className="checkout-concept"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      aria-label="Checkout concept"
    >
      <div
        className="checkout-concept__cover"
        aria-hidden="true"
      />

      <div className="checkout-concept__content">
        {/* =====================================
            HEADER
        ===================================== */}

        <header className="checkout-concept__header">
          <div className="checkout-concept__brand">
            HELLSTAR
          </div>

          <div className="checkout-concept__header-center">
            <span>
              CHECKOUT / CONCEPT
            </span>

            <span className="checkout-concept__status-dot" />

            <span>
              SYSTEM / OFFLINE
            </span>
          </div>

          <button
            className="checkout-concept__close"
            type="button"
            ref={closeButtonRef}
            onClick={
              handleClose
            }
          >
            CLOSE / ESC
          </button>
        </header>

        {/* =====================================
            STEPS
        ===================================== */}

        <nav
          className="checkout-concept__steps"
          aria-label="Checkout progress"
        >
          <div
            className={
              step ===
                'information'
                ? 'is-active'
                : 'is-complete'
            }
          >
            <span>
              01
            </span>

            <p>
              INFORMATION
            </p>
          </div>

          <div
            className={
              step ===
              'review'
                ? 'is-active'
                : step ===
                    'complete'
                  ? 'is-complete'
                  : ''
            }
          >
            <span>
              02
            </span>

            <p>
              REVIEW
            </p>
          </div>

          <div
            className={
              step ===
              'complete'
                ? 'is-active'
                : ''
            }
          >
            <span>
              03
            </span>

            <p>
              COMPLETE
            </p>
          </div>
        </nav>

        <div className="checkout-concept__layout">
          {/* =====================================
              MAIN
          ===================================== */}

          <main className="checkout-concept__main">
            {step ===
              'information' && (
              <form
                onSubmit={
                  handleInformationSubmit
                }
                className="checkout-concept__form"
              >
                <div className="checkout-concept__section-heading">
                  <span>
                    01 / CONTACT
                  </span>

                  <h1
                    ref={informationHeadingRef}
                    tabIndex={-1}
                    className="checkout-concept__information-title"
                  >
                    YOUR
                    <br />
                    INFORMATION
                  </h1>

                  <p>
                    DETAILS ARE
                    USED ONLY INSIDE
                    THIS DEMO SESSION.
                  </p>
                </div>

                <div className="checkout-concept__fields">
                  <label>
                    <span>
                      FIRST NAME
                    </span>

                    <input
                      value={
                        firstName
                      }
                      onChange={(
                        event,
                      ) =>
                        setFirstName(
                          event
                            .target
                            .value,
                        )
                      }
                      autoComplete="given-name"
                    />
                  </label>

                  <label>
                    <span>
                      LAST NAME
                    </span>

                    <input
                      value={
                        lastName
                      }
                      onChange={(
                        event,
                      ) =>
                        setLastName(
                          event
                            .target
                            .value,
                        )
                      }
                      autoComplete="family-name"
                    />
                  </label>

                  <label className="checkout-concept__field--wide">
                    <span>
                      EMAIL
                    </span>

                    <input
                      type="email"
                      value={
                        email
                      }
                      onChange={(
                        event,
                      ) =>
                        setEmail(
                          event
                            .target
                            .value,
                        )
                      }
                      autoComplete="email"
                    />
                  </label>

                  <label>
                    <span>
                      COUNTRY
                    </span>

                    <input
                      value={
                        country
                      }
                      onChange={(
                        event,
                      ) =>
                        setCountry(
                          event
                            .target
                            .value,
                        )
                      }
                      autoComplete="country-name"
                    />
                  </label>

                  <label>
                    <span>
                      CITY
                    </span>

                    <input
                      value={
                        city
                      }
                      onChange={(
                        event,
                      ) =>
                        setCity(
                          event
                            .target
                            .value,
                        )
                      }
                      autoComplete="address-level2"
                    />
                  </label>

                  <label className="checkout-concept__field--wide">
                    <span>
                      ADDRESS
                    </span>

                    <input
                      value={
                        address
                      }
                      onChange={(
                        event,
                      ) =>
                        setAddress(
                          event
                            .target
                            .value,
                        )
                      }
                      autoComplete="street-address"
                    />
                  </label>
                </div>

                <div className="checkout-concept__shipping">
                  <span className="checkout-concept__shipping-label">
                    02 / DELIVERY
                  </span>

                  <button
                    type="button"
                    aria-pressed={
                      shipping === 'standard'
                    }
                    className={
                      shipping ===
                      'standard'
                        ? 'is-selected'
                        : ''
                    }
                    onClick={() =>
                      setShipping(
                        'standard',
                      )
                    }
                  >
                    <div>
                      <strong>
                        STANDARD
                      </strong>

                      <span>
                        3–7 BUSINESS
                        DAYS
                      </span>
                    </div>

                    <p>
                      FREE
                    </p>
                  </button>

                  <button
                    type="button"
                    aria-pressed={
                      shipping === 'express'
                    }
                    className={
                      shipping ===
                      'express'
                        ? 'is-selected'
                        : ''
                    }
                    onClick={() =>
                      setShipping(
                        'express',
                      )
                    }
                  >
                    <div>
                      <strong>
                        EXPRESS
                      </strong>

                      <span>
                        1–2 BUSINESS
                        DAYS
                      </span>
                    </div>

                    <p>
                      S/. 49.90
                    </p>
                  </button>
                </div>

                <button
                  className="checkout-concept__primary-action"
                  type="submit"
                  disabled={
                    !isInformationValid
                  }
                >
                  <span>
                    REVIEW ORDER
                  </span>

                  <span>
                    ↗
                  </span>
                </button>
              </form>
            )}

            {step ===
              'review' && (
              <div className="checkout-concept__review">
                <div className="checkout-concept__section-heading">
                  <span>
                    02 / REVIEW
                  </span>

                  <h1
                    ref={reviewHeadingRef}
                    tabIndex={-1}
                  >
                    FINAL
                    <br />
                    CHECK
                  </h1>

                  <p>
                    VERIFY THE
                    INFORMATION BEFORE
                    COMPLETING THIS
                    CONCEPT ORDER.
                  </p>
                </div>

                <div className="checkout-concept__review-block">
                  <div>
                    <span>
                      CONTACT
                    </span>

                    <p>
                      {firstName}{' '}
                      {lastName}
                    </p>

                    <p>
                      {email}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      changeStep(
                        'information',
                      )
                    }
                  >
                    EDIT
                  </button>
                </div>

                <div className="checkout-concept__review-block">
                  <div>
                    <span>
                      DELIVERY
                    </span>

                    <p>
                      {address}
                    </p>

                    <p>
                      {city},{' '}
                      {country}
                    </p>

                    <p>
                      {shipping ===
                      'express'
                        ? 'EXPRESS / 1–2 DAYS'
                        : 'STANDARD / 3–7 DAYS'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      changeStep(
                        'information',
                      )
                    }
                  >
                    EDIT
                  </button>
                </div>

                <div className="checkout-concept__payment">
                  <span>
                    03 / PAYMENT
                  </span>

                  <div className="checkout-concept__payment-box">
                    <div className="checkout-concept__payment-icon">
                      ×
                    </div>

                    <div>
                      <strong>
                        TRANSACTION
                        SYSTEM OFFLINE
                      </strong>

                      <p>
                        THIS IS AN
                        UNOFFICIAL
                        PORTFOLIO
                        CONCEPT. NO
                        PAYMENT DATA IS
                        REQUESTED OR
                        PROCESSED.
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  className="checkout-concept__primary-action"
                  type="button"
                  onClick={
                    handleCompleteOrder
                  }
                >
                  <span>
                    COMPLETE CONCEPT
                    ORDER
                  </span>

                  <span>
                    ↗
                  </span>
                </button>
              </div>
            )}

            {step ===
              'complete' && (
              <div className="checkout-concept__complete">
                <span className="checkout-concept__complete-code">
                  STATUS / COMPLETE
                </span>

                <div className="checkout-concept__complete-mark">
                  ✓
                </div>

                <h1
                  ref={completeHeadingRef}
                  tabIndex={-1}
                >
                  SIGNAL
                  <br />
                  RECEIVED
                </h1>

                <p>
                  CONCEPT ORDER
                  COMPLETE.
                  <br />
                  NO TRANSACTION HAS
                  BEEN PROCESSED.
                </p>

                <div className="checkout-concept__complete-reference">
                  <span>
                    REFERENCE
                  </span>

                  <strong>
                    HS / FW26 /
                    001
                  </strong>
                </div>

                <button
                  className="checkout-concept__primary-action"
                  type="button"
                  onClick={
                    handleClose
                  }
                >
                  <span>
                    RETURN TO
                    EXPERIENCE
                  </span>

                  <span>
                    ↗
                  </span>
                </button>
              </div>
            )}
          </main>

          {/* =====================================
              SUMMARY
          ===================================== */}

          <aside className="checkout-concept__summary">
            <div className="checkout-concept__summary-head">
              <span>
                YOUR BAG
              </span>

              <span>
                {String(
                  itemCount,
                ).padStart(
                  2,
                  '0',
                )}{' '}
                OBJECTS
              </span>
            </div>

            <div className="checkout-concept__items">
              {items.map(
                (item) => (
                  <article
                    key={`${item.product.id}-${item.size}`}
                    className="checkout-concept__item"
                  >
                    <div className="checkout-concept__item-visual">
                      <span>
                        {
                          item.product
                            .id
                        }
                      </span>

                      <img
                        src={
                          item.product
                            .image
                        }
                        alt=""
                        draggable="false"
                      />
                    </div>

                    <div className="checkout-concept__item-info">
                      <span>
                        {
                          item.product
                            .category
                        }
                      </span>

                      <h2>
                        {
                          item.product
                            .name
                        }
                      </h2>

                      <p>
                        SIZE /{' '}
                        {item.size}
                      </p>

                      <p>
                        QTY /{' '}
                        {String(
                          item.quantity,
                        ).padStart(
                          2,
                          '0',
                        )}
                      </p>
                    </div>

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
                  </article>
                ),
              )}
            </div>

            <div className="checkout-concept__totals">
              <div>
                <span>
                  SUBTOTAL
                </span>

                <p>
                  S/.{' '}
                  {subtotalPen.toFixed(
                    2,
                  )}
                </p>
              </div>

              <div>
                <span>
                  SHIPPING
                </span>

                <p>
                  {shippingPen ===
                  0
                    ? 'FREE'
                    : `S/. ${shippingPen.toFixed(
                        2,
                      )}`}
                </p>
              </div>

              <div className="checkout-concept__total">
                <span>
                  TOTAL
                </span>

                <div>
                  <strong>
                    S/.{' '}
                    {totalPen.toFixed(
                      2,
                    )}
                  </strong>

                  <small>
                    USD $
                    {totalUsd.toFixed(
                      2,
                    )}
                  </small>
                </div>
              </div>
            </div>

            <div className="checkout-concept__legal">
              <span>
                HELLSTAR —
                UNOFFICIAL CONCEPT
              </span>

              <span>
                NO REAL
                TRANSACTION
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

export default CheckoutConcept
