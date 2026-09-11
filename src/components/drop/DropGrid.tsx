import {
  useLayoutEffect,
  useRef,
} from 'react'

import gsap from 'gsap'

import './DropGrid.css'

import {
  products,
  type StoreProduct,
} from '../../data/products'

type DropGridProps = {
  onSelectProduct: (
    product: StoreProduct,
  ) => void
}

function DropGrid({
  onSelectProduct,
}: DropGridProps) {
  const sectionRef =
    useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section =
      sectionRef.current

    if (!section) return

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (reducedMotion) return

    const cards =
      section.querySelectorAll(
        '.drop-card',
      )

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

              const element =
                entry.target

              gsap.fromTo(
                element,
                {
                  opacity: 0,
                  y: 70,
                  scale: 0.94,
                  filter:
                    'blur(8px)',
                },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter:
                    'blur(0px)',

                  duration: 1,

                  ease:
                    'power4.out',

                  clearProps:
                    'transform,filter',
                },
              )

              observer.unobserve(
                element,
              )
            },
          )
        },
        {
          threshold: 0.14,
        },
      )

    cards.forEach(
      (card) => {
        gsap.set(
          card,
          {
            opacity: 0,
          },
        )

        observer.observe(card)
      },
    )

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="drop-001"
      className="drop"
      aria-labelledby="drop-title"
    >
      <header className="drop__header">
        <div>
          <span className="drop__eyebrow">
            COLLECTION / 001
          </span>

          <h2
            id="drop-title"
            className="drop__title"
          >
            DROP / 001
          </h2>
        </div>

        <div className="drop__header-meta">
          <span>
            11 OBJECTS
          </span>

          <span>
            FW / 2026
          </span>
        </div>
      </header>

      <div className="drop__line" />

      <div className="drop__intro">
        <p>
          OBJECTS FROM ANOTHER
          REALITY.
        </p>

        <span>
          HOODIES / TEES / SHORTS /
          CAPS
        </span>
      </div>

      <div className="drop__grid">
        {products.map(
          (product) => (
            <article
              key={product.id}
              className={`drop-card ${product.layout}`}
            >
              <button
                className="drop-card__visual"
                type="button"
                aria-label={`View ${product.name}`}
                onClick={() =>
                  onSelectProduct(
                    product,
                  )
                }
              >
                <span
                  className="drop-card__number"
                  aria-hidden="true"
                >
                  {product.id}
                </span>

                <img
                  src={product.image}
                  alt={product.name}
                  draggable="false"
                />

                <span
                  className="drop-card__view"
                  aria-hidden="true"
                >
                  VIEW OBJECT ↗
                </span>
              </button>

              <div className="drop-card__meta">
                <div>
                  <span>
                    {product.id}
                  </span>

                  <span>
                    {product.category}
                  </span>
                </div>

                <h3>
                  {product.name}
                </h3>
              </div>
            </article>
          ),
        )}
      </div>

      <footer className="drop__footer">
        <span>
          HELLSTAR — UNOFFICIAL
          CONCEPT
        </span>

        <span>
          END / DROP 001
        </span>
      </footer>
    </section>
  )
}

export default DropGrid