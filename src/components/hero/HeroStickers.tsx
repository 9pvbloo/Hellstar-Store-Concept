import {
  useLayoutEffect,
  useRef,
} from 'react'

import gsap from 'gsap'

import stickerWide from '../../assets/stickers/sticker-hellstar-wide.webp'
import stickerRacing from '../../assets/stickers/sticker-hellstar-racing.webp'
import stickerEmblem from '../../assets/stickers/sticker-hellstar-emblem-circle.webp'
import stickerFlameRed from '../../assets/stickers/sticker-hellstar-flame-red.webp'

function HeroStickers() {
  const stickersRef =
    useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root =
      stickersRef.current

    if (!root) return

    const reducedMotion =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches

    if (reducedMotion) {
      return
    }

    const context = gsap.context(
      () => {
        const visuals =
          gsap.utils.toArray<HTMLElement>(
            '.hero__sticker-visual',
          )

        const floats =
          gsap.utils.toArray<HTMLElement>(
            '.hero__sticker-float',
          )

        /* ------------------------------
           Entrance
        ------------------------------ */

        gsap.set(
          visuals,
          {
            opacity: 0,
            scale: 0.76,
            y: 18,
            filter: 'blur(6px)',
          },
        )

        gsap.to(
          visuals,
          {
            opacity: 1,
            scale: 1,
            y: 0,
            filter: 'blur(0px)',

            duration: 0.9,

            stagger: 0.1,

            ease: 'power4.out',

            delay: 0.55,
          },
        )

        /* ------------------------------
           Individual floating
        ------------------------------ */

        floats.forEach(
          (
            element,
            index,
          ) => {
            gsap.to(
              element,
              {
                y:
                  index % 2 === 0
                    ? -6
                    : 6,

                x:
                  index % 2 === 0
                    ? 3
                    : -3,

                rotation:
                  index % 2 === 0
                    ? 1.2
                    : -1.2,

                duration:
                  3.8 +
                  index * 0.35,

                repeat: -1,

                yoyo: true,

                ease: 'sine.inOut',

                delay:
                  1 +
                  index * 0.16,
              },
            )
          },
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
      ref={stickersRef}
      className="hero__stickers"
      aria-hidden="true"
    >
      {/* RED FLAME */}

      <div className="hero__sticker hero__sticker--flame">
        <div className="hero__sticker-float">
          <div className="hero__sticker-visual">
            <img
              src={stickerFlameRed}
              alt=""
              draggable="false"
            />
          </div>
        </div>
      </div>

      {/* RACING */}

      <div className="hero__sticker hero__sticker--racing">
        <div className="hero__sticker-float">
          <div className="hero__sticker-visual hero__sticker-visual--mono">
            <img
              src={stickerRacing}
              alt=""
              draggable="false"
            />
          </div>
        </div>
      </div>

      {/* CIRCLE EMBLEM */}

      <div className="hero__sticker hero__sticker--emblem">
        <div className="hero__sticker-float">
          <div className="hero__sticker-visual hero__sticker-visual--mono">
            <img
              src={stickerEmblem}
              alt=""
              draggable="false"
            />
          </div>
        </div>
      </div>

      {/* WIDE HELLSTAR */}

      <div className="hero__sticker hero__sticker--wide">
        <div className="hero__sticker-float">
          <div className="hero__sticker-visual hero__sticker-visual--mono">
            <img
              src={stickerWide}
              alt=""
              draggable="false"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeroStickers
