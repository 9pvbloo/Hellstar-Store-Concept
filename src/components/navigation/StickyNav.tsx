import {
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'

import gsap from 'gsap'

import './StickyNav.css'

type StickyNavProps = {
  visible: boolean
  cartCount: number
  onOpenCart: () => void
  onShop: () => void
  onLookbook: () => void
}

function StickyNav({
  visible,
  cartCount,
  onOpenCart,
  onShop,
  onLookbook,
}: StickyNavProps) {
  const navRef =
    useRef<HTMLElement>(null)

  const progressRef =
    useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const nav = navRef.current

    if (!nav) return

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    gsap.killTweensOf(nav)

    if (reducedMotion) {
      gsap.set(nav, {
        autoAlpha: visible ? 1 : 0,
        yPercent: visible ? 0 : -100,
      })

      return
    }

    gsap.to(nav, {
      autoAlpha: visible ? 1 : 0,
      yPercent: visible ? 0 : -100,
      duration: visible ? 0.52 : 0.36,
      ease: visible
        ? 'power3.out'
        : 'power2.in',
      overwrite: true,
    })
  }, [visible])

  useEffect(() => {
    const progress = progressRef.current

    if (!progress) return

    let frameId: number | null = null

    const updateProgress = () => {
      frameId = null

      const documentHeight =
        document.documentElement.scrollHeight -
        window.innerHeight

      const value =
        documentHeight > 0
          ? Math.min(
              1,
              Math.max(
                0,
                window.scrollY /
                  documentHeight,
              ),
            )
          : 0

      progress.style.transform =
        `scaleX(${value})`
    }

    const requestUpdate = () => {
      if (frameId !== null) return

      frameId =
        requestAnimationFrame(
          updateProgress,
        )
    }

    updateProgress()

    window.addEventListener(
      'scroll',
      requestUpdate,
      { passive: true },
    )

    window.addEventListener(
      'resize',
      requestUpdate,
    )

    return () => {
      window.removeEventListener(
        'scroll',
        requestUpdate,
      )

      window.removeEventListener(
        'resize',
        requestUpdate,
      )

      if (frameId !== null) {
        cancelAnimationFrame(frameId)
      }
    }
  }, [])

  const tabIndex = visible ? 0 : -1

  return (
    <nav
      ref={navRef}
      className={
        `sticky-nav${
          visible
            ? ' sticky-nav--visible'
            : ''
        }`
      }
      aria-label="Store navigation"
      aria-hidden={!visible}
    >
      <div className="sticky-nav__bar">
        <span className="sticky-nav__brand">
          HELLSTAR
        </span>

        <div
          className="sticky-nav__meta"
          aria-hidden="true"
        >
          <span>DROP / 001</span>
          <span className="sticky-nav__dot" />
          <span>FW / 2026</span>
        </div>

        <div className="sticky-nav__links">
          <button
            type="button"
            tabIndex={tabIndex}
            onClick={onShop}
            aria-label="Scroll to Drop 001"
          >
            SHOP
          </button>

          <button
            type="button"
            tabIndex={tabIndex}
            onClick={onLookbook}
            aria-label="Scroll to Lookbook"
          >
            LOOKBOOK
          </button>

          <button
            type="button"
            tabIndex={tabIndex}
            onClick={onOpenCart}
            aria-label={`Open cart, ${cartCount} items`}
          >
            CART /{' '}
            {String(cartCount).padStart(2, '0')}
          </button>
        </div>
      </div>

      <div
        className="sticky-nav__progress"
        aria-hidden="true"
      >
        <span ref={progressRef} />
      </div>
    </nav>
  )
}

export default StickyNav
