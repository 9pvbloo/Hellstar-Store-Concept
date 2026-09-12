import {
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react'

import gsap from 'gsap'

import './Lookbook.css'

import {
  products,
} from '../../data/products'

import type {
  StoreProduct,
} from '../../data/products'

type LookbookProps = {
  onSelectProduct: (
    product: StoreProduct,
  ) => void
}

type LookbookScene = {
  id: string
  index: string
  eyebrow: string
  title: string
  copy: string
  primary: StoreProduct
  secondary?: StoreProduct
  align:
    | 'left'
    | 'right'
    | 'center'
}

const getProduct = (
  id: string,
) => {
  const product =
    products.find(
      (item) =>
        item.id === id,
    )

  if (!product) {
    throw new Error(
      `Lookbook product ${id} not found`,
    )
  }

  return product
}

const scenes: LookbookScene[] = [
  {
    id: 'look-01',
    index: '01',
    eyebrow:
      'REALITY / HEAVEN CAN WAIT',
    title:
      'ANOTHER REALITY\nIN MOTION',
    copy:
      'OBJECTS BUILT BETWEEN HEAVEN, NOISE AND THE UNKNOWN.',
    primary:
      getProduct('01'),
    secondary:
      getProduct('05'),
    align: 'left',
  },

  {
    id: 'look-02',
    index: '02',
    eyebrow:
      'SIGNAL / AFTER DARK',
    title:
      'OUTSIDE THE\nKNOWN SYSTEM',
    copy:
      'GARMENTS AS SIGNALS. MOVEMENT AS LANGUAGE. NOTHING STAYS STILL.',
    primary:
      getProduct('06'),
    secondary:
      getProduct('03'),
    align: 'right',
  },

  {
    id: 'look-03',
    index: '03',
    eyebrow:
      'ORIGIN / UNKNOWN',
    title:
      'NOT FROM\nHERE',
    copy:
      'FW26 / AN UNOFFICIAL STUDY OF FORM, SCALE AND STREET CULTURE.',
    primary:
      getProduct('04'),
    secondary:
      getProduct('10'),
    align: 'center',
  },
]

function Lookbook({
  onSelectProduct,
}: LookbookProps) {
  const rootRef =
    useRef<HTMLElement>(null)

  /* =========================================
     INTRO REVEAL
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
            [
              '.lookbook__intro-kicker',
              '.lookbook__intro-title',
              '.lookbook__intro-copy',
              '.lookbook__intro-meta',
            ],
            {
              opacity: 0,
              y: 28,
            },
          )

          gsap.set(
            '.lookbook__intro-line',
            {
              scaleX: 0,
              transformOrigin:
                'left center',
            },
          )

          const intro =
            root.querySelector(
              '.lookbook__intro',
            )

          if (!intro) {
            return
          }

          const observer =
            new IntersectionObserver(
              ([entry]) => {
                if (
                  !entry.isIntersecting
                ) {
                  return
                }

                const timeline =
                  gsap.timeline()

                timeline.to(
                  '.lookbook__intro-line',
                  {
                    scaleX: 1,

                    duration: 0.9,

                    ease:
                      'power4.inOut',
                  },
                  0,
                )

                timeline.to(
                  '.lookbook__intro-kicker',
                  {
                    opacity: 1,
                    y: 0,

                    duration: 0.55,

                    ease:
                      'power3.out',
                  },
                  0.15,
                )

                timeline.to(
                  '.lookbook__intro-title',
                  {
                    opacity: 1,
                    y: 0,

                    duration: 0.85,

                    ease:
                      'power4.out',
                  },
                  0.22,
                )

                timeline.to(
                  [
                    '.lookbook__intro-copy',
                    '.lookbook__intro-meta',
                  ],
                  {
                    opacity: 1,
                    y: 0,

                    duration: 0.6,

                    stagger: 0.08,

                    ease:
                      'power3.out',
                  },
                  0.42,
                )

                observer.disconnect()
              },
              {
                threshold: 0.28,
              },
            )

          observer.observe(intro)

          return () => {
            observer.disconnect()
          }
        },
        root,
      )

    return () => {
      context.revert()
    }
  }, [])

  /* =========================================
     SCENE REVEALS
  ========================================= */

  useEffect(() => {
    const root =
      rootRef.current

    if (!root) return

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    const sceneElements =
      Array.from(
        root.querySelectorAll(
          '.lookbook-scene',
        ),
      )

    if (reducedMotion) {
      sceneElements.forEach(
        (scene) => {
          scene.classList.add(
            'is-visible',
          )
        },
      )

      return
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          entries.forEach(
            (entry) => {
              if (
                !entry.isIntersecting
              ) {
                return
              }

              entry.target.classList.add(
                'is-visible',
              )

              observer.unobserve(
                entry.target,
              )
            },
          )
        },
        {
          threshold: 0.2,

          rootMargin:
            '0px 0px -8% 0px',
        },
      )

    sceneElements.forEach(
      (scene) => {
        observer.observe(scene)
      },
    )

    return () => {
      observer.disconnect()
    }
  }, [])

  /* =========================================
     SOFT SCROLL PARALLAX
  ========================================= */

  useEffect(() => {
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

    let frame = 0

    const updateParallax = () => {
      frame = 0

      const viewportHeight =
        window.innerHeight

      const scenes =
        root.querySelectorAll<HTMLElement>(
          '.lookbook-scene',
        )

      scenes.forEach(
        (scene) => {
          const bounds =
            scene.getBoundingClientRect()

          const center =
            bounds.top +
            bounds.height / 2

          const viewportCenter =
            viewportHeight / 2

          const distance =
            center -
            viewportCenter

          const progress =
            Math.max(
              -1,
              Math.min(
                1,
                distance /
                  viewportHeight,
              ),
            )

          const primary =
            scene.querySelector<HTMLElement>(
              '.lookbook-scene__primary',
            )

          const secondary =
            scene.querySelector<HTMLElement>(
              '.lookbook-scene__secondary',
            )

          const number =
            scene.querySelector<HTMLElement>(
              '.lookbook-scene__number',
            )

          if (primary) {
            primary.style.transform =
              `translate3d(0, ${
                progress * -24
              }px, 0)`
          }

          if (secondary) {
            secondary.style.transform =
              `translate3d(0, ${
                progress * 34
              }px, 0)`
          }

          if (number) {
            number.style.transform =
              `translate3d(0, ${
                progress * 18
              }px, 0)`
          }
        },
      )
    }

    const handleScroll = () => {
      if (frame) {
        return
      }

      frame =
        window.requestAnimationFrame(
          updateParallax,
        )
    }

    updateParallax()

    window.addEventListener(
      'scroll',
      handleScroll,
      {
        passive: true,
      },
    )

    window.addEventListener(
      'resize',
      handleScroll,
    )

    return () => {
      window.removeEventListener(
        'scroll',
        handleScroll,
      )

      window.removeEventListener(
        'resize',
        handleScroll,
      )

      if (frame) {
        window.cancelAnimationFrame(
          frame,
        )
      }
    }
  }, [])

  return (
    <section
      ref={rootRef}
      id="lookbook"
      className="lookbook"
      aria-labelledby="lookbook-title"
    >
      {/* =====================================
          INTRO
      ===================================== */}

      <header className="lookbook__intro">
        <div
          className="lookbook__intro-line"
          aria-hidden="true"
        />

        <div className="lookbook__intro-top">
          <span className="lookbook__intro-kicker">
            LOOKBOOK / FW26
          </span>

          <div className="lookbook__intro-meta">
            <span>
              VISUAL STUDY / 001
            </span>

            <span>
              SIGNAL / ACTIVE
            </span>
          </div>
        </div>

        <div className="lookbook__intro-main">
          <h2
            id="lookbook-title"
            className="lookbook__intro-title"
          >
            ANOTHER
            <br />
            REALITY
          </h2>

          <div className="lookbook__intro-side">
            <p className="lookbook__intro-copy">
              A VISUAL STUDY OF
              GARMENTS, SCALE AND
              MOVEMENT BEYOND THE
              EXPECTED.
            </p>

            <span>
              HELLSTAR —
              UNOFFICIAL CONCEPT
            </span>
          </div>
        </div>

        <div
          className="lookbook__intro-cross"
          aria-hidden="true"
        >
          <span />
          <span />
        </div>
      </header>

      {/* =====================================
          SCENES
      ===================================== */}

      <div className="lookbook__scenes">
        {scenes.map(
          (scene) => (
            <article
              key={scene.id}
              id={scene.id}
              className={`lookbook-scene lookbook-scene--${scene.align}`}
            >
              <div
                className="lookbook-scene__grid"
                aria-hidden="true"
              />

              <span
                className="lookbook-scene__number"
                aria-hidden="true"
              >
                {scene.index}
              </span>

              <div className="lookbook-scene__copy">
                <span className="lookbook-scene__eyebrow">
                  {scene.eyebrow}
                </span>

                <h3>
                  {scene.title
                    .split('\n')
                    .map(
                      (
                        line,
                        index,
                      ) => (
                        <span
                          key={
                            `${scene.id}-${index}`
                          }
                        >
                          {line}
                        </span>
                      ),
                    )}
                </h3>

                <p>
                  {scene.copy}
                </p>
              </div>

              {/* PRIMARY */}

              <button
                className="lookbook-scene__product lookbook-scene__primary"
                type="button"
                onClick={() =>
                  onSelectProduct(
                    scene.primary,
                  )
                }
                aria-label={`View ${scene.primary.name}`}
              >
                <span className="lookbook-scene__product-code">
                  OBJECT /{' '}
                  {scene.primary.id}
                </span>

                <div className="lookbook-scene__halo" />

                <img
                  src={
                    scene.primary
                      .image
                  }
                  alt={
                    scene.primary
                      .name
                  }
                  draggable="false"
                />

                <div className="lookbook-scene__product-meta">
                  <span>
                    {
                      scene.primary
                        .category
                    }
                  </span>

                  <span>
                    {
                      scene.primary
                        .colorway
                    }
                  </span>
                </div>
              </button>

              {/* SECONDARY */}

              {scene.secondary && (
                <button
                  className="lookbook-scene__product lookbook-scene__secondary"
                  type="button"
                  onClick={() =>
                    onSelectProduct(
                      scene.secondary!,
                    )
                  }
                  aria-label={`View ${scene.secondary.name}`}
                >
                  <span className="lookbook-scene__product-code">
                    OBJECT /{' '}
                    {
                      scene.secondary
                        .id
                    }
                  </span>

                  <div className="lookbook-scene__halo" />

                  <img
                    src={
                      scene.secondary
                        .image
                    }
                    alt={
                      scene.secondary
                        .name
                    }
                    draggable="false"
                  />

                  <div className="lookbook-scene__product-meta">
                    <span>
                      {
                        scene.secondary
                          .category
                      }
                    </span>

                    <span>
                      {
                        scene.secondary
                          .colorway
                      }
                    </span>
                  </div>
                </button>
              )}

              {/* TECHNICAL */}

              <div
                className="lookbook-scene__technical"
                aria-hidden="true"
              >
                <span>
                  FRAME /{' '}
                  {scene.index}
                </span>

                <span>
                  X / 042.16
                </span>

                <span>
                  Y / 118.07
                </span>

                <span>
                  FW / 2026
                </span>
              </div>

              <div
                className="lookbook-scene__cross"
                aria-hidden="true"
              >
                <span />
                <span />
              </div>
            </article>
          ),
        )}
      </div>

      {/* =====================================
          OUTRO
      ===================================== */}

      <footer className="lookbook__outro">
        <div>
          <span>
            END / VISUAL STUDY
          </span>

          <span>
            FW26 / 001
          </span>
        </div>

        <p>
          NOT FROM HERE
        </p>

        <div>
          <span>
            PEOPLE / PLACES /
            IDEAS
          </span>

          <span>
            BEYOND / REALITY
          </span>
        </div>
      </footer>
    </section>
  )
}

export default Lookbook