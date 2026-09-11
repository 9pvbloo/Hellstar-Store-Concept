import {
  memo,
  useEffect,
  useRef,
  type HTMLAttributes,
} from 'react'

import './DotField.css'

type Dot = {
  baseX: number
  baseY: number
  x: number
  y: number
  vx: number
  vy: number
}

type PointerState = {
  x: number
  y: number
  previousX: number
  previousY: number
  velocityX: number
  velocityY: number
  speed: number
  visible: boolean
}

type DotFieldProps =
  HTMLAttributes<HTMLDivElement> & {
    dotRadius?: number
    dotSpacing?: number
    cursorRadius?: number
    bulgeStrength?: number
    glowRadius?: number
    baseColor?: string
    accentColor?: string
    glowColor?: string
  }

const TWO_PI = Math.PI * 2

const DotField = memo(
  ({
    dotRadius = 1.45,
    dotSpacing = 14,
    cursorRadius = 500,
    bulgeStrength = 67,
    glowRadius = 260,

    baseColor = 'rgba(184, 184, 184, 0.20)',

    accentColor = 'rgba(181, 31, 36, 0.78)',

    glowColor = 'rgba(181, 31, 36, 0.14)',

    className = '',
    ...rest
  }: DotFieldProps) => {
    const canvasRef =
      useRef<HTMLCanvasElement>(null)

    const dotsRef =
      useRef<Dot[]>([])

    const frameRef =
      useRef<number | null>(null)

    const sizeRef = useRef({
      width: 0,
      height: 0,
      left: 0,
      top: 0,
    })

    const pointerRef =
      useRef<PointerState>({
        x: -9999,
        y: -9999,

        previousX: -9999,
        previousY: -9999,

        velocityX: 0,
        velocityY: 0,

        speed: 0,

        visible: false,
      })

    const engagementRef =
      useRef(0)

    useEffect(() => {
      const canvas =
        canvasRef.current

      const container =
        canvas?.parentElement

      if (!canvas || !container) {
        return
      }

      const context =
        canvas.getContext('2d', {
          alpha: true,
        })

      if (!context) {
        return
      }

      const reducedMotion =
        window.matchMedia(
          '(prefers-reduced-motion: reduce)',
        ).matches

      /*
       * Limitamos DPR para no matar
       * rendimiento en pantallas Retina.
       */
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        1.75,
      )

      /* =====================================
         CREATE GRID
      ===================================== */

      const buildDots = () => {
        const {
          width,
          height,
        } = sizeRef.current

        const step =
          dotSpacing +
          dotRadius * 2

        const columns =
          Math.ceil(width / step) + 3

        const rows =
          Math.ceil(height / step) + 3

        const totalWidth =
          (columns - 1) * step

        const totalHeight =
          (rows - 1) * step

        const offsetX =
          (width - totalWidth) / 2

        const offsetY =
          (height - totalHeight) / 2

        const dots: Dot[] = []

        for (
          let row = 0;
          row < rows;
          row += 1
        ) {
          for (
            let column = 0;
            column < columns;
            column += 1
          ) {
            const x =
              offsetX +
              column * step

            const y =
              offsetY +
              row * step

            dots.push({
              baseX: x,
              baseY: y,

              x,
              y,

              vx: 0,
              vy: 0,
            })
          }
        }

        dotsRef.current = dots
      }

      /* =====================================
         RESIZE
      ===================================== */

      const resize = () => {
        const rect =
          container.getBoundingClientRect()

        const width =
          Math.max(
            1,
            rect.width,
          )

        const height =
          Math.max(
            1,
            rect.height,
          )

        canvas.width =
          Math.round(
            width * dpr,
          )

        canvas.height =
          Math.round(
            height * dpr,
          )

        canvas.style.width =
          `${width}px`

        canvas.style.height =
          `${height}px`

        /*
         * Dibujamos usando coordenadas CSS,
         * no coordenadas físicas del canvas.
         */
        context.setTransform(
          dpr,
          0,
          0,
          dpr,
          0,
          0,
        )

        sizeRef.current = {
          width,
          height,
          left: rect.left,
          top: rect.top,
        }

        buildDots()
      }

      const resizeObserver =
        new ResizeObserver(
          resize,
        )

      resizeObserver.observe(
        container,
      )

      resize()

      /* =====================================
         POINTER
      ===================================== */

      const handlePointerMove = (
        event: PointerEvent,
      ) => {
        const pointer =
          pointerRef.current

        /*
         * Rect actualizado para que siga
         * funcionando incluso si cambia
         * ligeramente el layout.
         */
        const rect =
          container.getBoundingClientRect()

        sizeRef.current.left =
          rect.left

        sizeRef.current.top =
          rect.top

        const x =
          event.clientX -
          rect.left

        const y =
          event.clientY -
          rect.top

        if (
          pointer.visible
        ) {
          const deltaX =
            x -
            pointer.previousX

          const deltaY =
            y -
            pointer.previousY

          pointer.velocityX =
            deltaX

          pointer.velocityY =
            deltaY

          pointer.speed =
            Math.min(
              Math.sqrt(
                deltaX * deltaX +
                deltaY * deltaY,
              ),
              80,
            )
        }

        pointer.x = x
        pointer.y = y

        pointer.previousX = x
        pointer.previousY = y

        pointer.visible = true
      }

      const handlePointerOut = (
        event: PointerEvent,
      ) => {
        /*
         * Solo desactivamos si realmente
         * salimos de la ventana.
         */
        if (
          event.relatedTarget === null
        ) {
          pointerRef.current.visible =
            false
        }
      }

      window.addEventListener(
        'pointermove',
        handlePointerMove,
        {
          passive: true,
        },
      )

      window.addEventListener(
        'pointerout',
        handlePointerOut,
      )

      /* =====================================
         RENDER LOOP
      ===================================== */

      const render = () => {
        const {
          width,
          height,
        } = sizeRef.current

        const pointer =
          pointerRef.current

        context.clearRect(
          0,
          0,
          width,
          height,
        )

        /*
         * Mouse velocity decays gradually.
         */
        pointer.velocityX *= 0.88
        pointer.velocityY *= 0.88
        pointer.speed *= 0.88

        if (
          pointer.speed < 0.02
        ) {
          pointer.speed = 0
        }

        /*
         * Cuando mueves rápido el cursor,
         * el campo gana fuerza.
         *
         * Incluso moviéndolo lentamente
         * conserva algo de reacción.
         */
        const targetEngagement =
          pointer.visible &&
          !reducedMotion
            ? Math.min(
                0.28 +
                  pointer.speed /
                    18,
                1,
              )
            : 0

        engagementRef.current +=
          (
            targetEngagement -
            engagementRef.current
          ) *
          (
            targetEngagement >
            engagementRef.current
              ? 0.14
              : 0.055
          )

        const engagement =
          engagementRef.current


        /* ===================================
           DOT PHYSICS
        =================================== */

        const radiusSquared =
          cursorRadius *
          cursorRadius

        const accentRadius =
          cursorRadius * 0.62

        const accentRadiusSquared =
          accentRadius *
          accentRadius

        /*
         * Dos paths:
         *
         * 1. dots base
         * 2. dots que están cerca del cursor
         */
        context.beginPath()

        const accentDots: Array<{
          x: number
          y: number
          radius: number
          alpha: number
        }> = []

        for (
          const dot of dotsRef.current
        ) {
          let targetX =
            dot.baseX

          let targetY =
            dot.baseY

          const dx =
            dot.baseX -
            pointer.x

          const dy =
            dot.baseY -
            pointer.y

          const distanceSquared =
            dx * dx +
            dy * dy

          if (
            pointer.visible &&
            engagement > 0.005 &&
            distanceSquared <
              radiusSquared &&
            !reducedMotion
          ) {
            const distance =
              Math.max(
                1,
                Math.sqrt(
                  distanceSquared,
                ),
              )

            /*
             * 1 en el centro,
             * 0 en el borde.
             */
            const normalized =
              1 -
              distance /
                cursorRadius

            /*
             * Curva de influencia.
             *
             * Da esa sensación de burbuja
             * grande alrededor del cursor.
             */
            const influence =
              Math.pow(
                normalized,
                1.55,
              )

            const directionX =
              dx / distance

            const directionY =
              dy / distance

            const push =
              bulgeStrength *
              influence *
              engagement

            /*
             * Bulge principal:
             * alejamos los puntos del cursor.
             */
            targetX +=
              directionX *
              push

            targetY +=
              directionY *
              push

            /*
             * Mouse momentum / wake.
             *
             * El campo también recoge una
             * pequeña parte de la dirección
             * en la que mueves el cursor.
             */
            const wake =
              influence *
              engagement *
              0.42

            targetX +=
              pointer.velocityX *
              wake

            targetY +=
              pointer.velocityY *
              wake

            if (
              distanceSquared <
              accentRadiusSquared
            ) {
              const accentInfluence =
                1 -
                distance /
                  accentRadius

              accentDots.push({
                x: dot.x,
                y: dot.y,

                radius:
                  dotRadius *
                  (
                    0.8 +
                    accentInfluence *
                      0.75
                  ),

                alpha:
                  accentInfluence *
                  engagement,
              })
            }
          }

          /*
           * Spring suave hacia target.
           */
          const spring = 0.15
          const friction = 0.72

          dot.vx +=
            (
              targetX -
              dot.x
            ) * spring

          dot.vy +=
            (
              targetY -
              dot.y
            ) * spring

          dot.vx *= friction
          dot.vy *= friction

          dot.x += dot.vx
          dot.y += dot.vy

          context.moveTo(
            dot.x +
              dotRadius,
            dot.y,
          )

          context.arc(
            dot.x,
            dot.y,
            dotRadius,
            0,
            TWO_PI,
          )
        }

        /*
         * Base silver dots.
         */
        context.fillStyle =
          baseColor

        context.fill()

        /* ===================================
           RED ACCENT DOTS
        =================================== */

        if (
          accentDots.length > 0
        ) {
          context.save()

          for (
            const accentDot
            of accentDots
          ) {
            context.globalAlpha =
              Math.min(
                accentDot.alpha *
                  0.95,
                0.82,
              )

            context.fillStyle =
              accentColor

            context.beginPath()

            context.arc(
              accentDot.x,
              accentDot.y,
              accentDot.radius,
              0,
              TWO_PI,
            )

            context.fill()
          }

          context.restore()
        }

        /*
         * Reduced motion:
         * solo renderizamos un frame.
         */
        if (
          !reducedMotion
        ) {
          frameRef.current =
            requestAnimationFrame(
              render,
            )
        }
      }

      render()

      /* =====================================
         CLEANUP
      ===================================== */

      return () => {
        resizeObserver.disconnect()

        window.removeEventListener(
          'pointermove',
          handlePointerMove,
        )

        window.removeEventListener(
          'pointerout',
          handlePointerOut,
        )

        if (
          frameRef.current !==
          null
        ) {
          cancelAnimationFrame(
            frameRef.current,
          )
        }
      }
    }, [
      dotRadius,
      dotSpacing,
      cursorRadius,
      bulgeStrength,
      glowRadius,
      baseColor,
      accentColor,
      glowColor,
    ])

    const classes = [
      'dot-field',
      className,
    ]
      .filter(Boolean)
      .join(' ')

    return (
      <div
        className={classes}
        aria-hidden="true"
        {...rest}
      >
        <canvas
          ref={canvasRef}
          className="dot-field__canvas"
        />
      </div>
    )
  },
)

DotField.displayName =
  'DotField'

export default DotField