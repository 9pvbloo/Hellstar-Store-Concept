import {
  useLayoutEffect,
  useRef,
} from 'react'

import gsap from 'gsap'

import './DropGrid.css'

import hoodie01 from '../../assets/products/hoodie-01-black-path-to-paradise.png'
import hoodie02 from '../../assets/products/hoodie-02-grey-pink-flame.png'
import hoodie03 from '../../assets/products/hoodie-03-red-records.png'

import tee01 from '../../assets/products/tee-01-black-boxing.png'
import tee02 from '../../assets/products/tee-02-cream-enlightenment.png'
import tee03 from '../../assets/products/tee-03-black-skull-football.png'

import shorts01 from '../../assets/products/shorts-01-black-burning-face.png'
import shorts02 from '../../assets/products/shorts-02-black-path-to-paradise.png'
import shorts03 from '../../assets/products/shorts-03-black-records.png'

import cap01 from '../../assets/products/cap-01-red-flame.png'
import cap02 from '../../assets/products/cap-02-black-grey-flame.png'

type DropProduct = {
  id: string
  name: string
  category: string
  image: string
  layout: string
}

const products: DropProduct[] = [
  {
    id: '01',
    name: 'PATH TO PARADISE',
    category: 'HOODIE',
    image: hoodie01,
    layout: 'drop-card--hero',
  },
  {
    id: '02',
    name: 'BLACK BOXING',
    category: 'T-SHIRT',
    image: tee01,
    layout: 'drop-card--left',
  },
  {
    id: '03',
    name: 'GREY PINK FLAME',
    category: 'HOODIE',
    image: hoodie02,
    layout: 'drop-card--right',
  },
  {
    id: '04',
    name: 'BURNING FACE',
    category: 'SHORTS',
    image: shorts01,
    layout: 'drop-card--center-small',
  },
  {
    id: '05',
    name: 'RED FLAME',
    category: 'CAP',
    image: cap01,
    layout: 'drop-card--left-small',
  },
  {
    id: '06',
    name: 'ENLIGHTENMENT',
    category: 'T-SHIRT',
    image: tee02,
    layout: 'drop-card--right-large',
  },
  {
    id: '07',
    name: 'RED RECORDS',
    category: 'HOODIE',
    image: hoodie03,
    layout: 'drop-card--left-large',
  },
  {
    id: '08',
    name: 'PATH TO PARADISE',
    category: 'SHORTS',
    image: shorts02,
    layout: 'drop-card--right-small',
  },
  {
    id: '09',
    name: 'SKULL FOOTBALL',
    category: 'T-SHIRT',
    image: tee03,
    layout: 'drop-card--center',
  },
  {
    id: '10',
    name: 'BLACK GREY FLAME',
    category: 'CAP',
    image: cap02,
    layout: 'drop-card--left-small',
  },
  {
    id: '11',
    name: 'RECORDS',
    category: 'SHORTS',
    image: shorts03,
    layout: 'drop-card--right',
  },
]

function DropGrid() {
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