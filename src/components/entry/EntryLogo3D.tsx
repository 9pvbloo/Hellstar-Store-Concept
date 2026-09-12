import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import {
  Canvas,
  useFrame,
  useLoader,
} from '@react-three/fiber'

import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import * as THREE from 'three'

import emblemUrl from '../../assets/branding/hellstar-emblem.svg?url'

const SVG_WIDTH = 736
const SVG_HEIGHT = 744
const SVG_SCALE = 0.00355

type EmblemPart = {
  id: string
  shape: THREE.Shape
  key: string
}

type CanvasCursor =
  | 'grab'
  | 'grabbing'

/* =========================================
   GEOMETRY
========================================= */

const ringExtrude: THREE.ExtrudeGeometryOptions = {
  depth: 24,
  bevelEnabled: true,
  bevelThickness: 4,
  bevelSize: 4,
  bevelSegments: 8,
  curveSegments: 28,
  steps: 1,
}

const logoExtrude: THREE.ExtrudeGeometryOptions = {
  depth: 38,
  bevelEnabled: true,
  bevelThickness: 5,
  bevelSize: 4,
  bevelSegments: 8,
  curveSegments: 28,
  steps: 1,
}

/* =========================================
   FULL BLACK CHROME MATERIAL
========================================= */

function ChromeMaterial() {
  return (
    <meshPhysicalMaterial
      /*
       * Full black chrome.
       *
       * Ya no diferenciamos rostro,
       * estrella y aro por color.
       * Todo pertenece al mismo metal negro.
       */
      color="#08090b"

      metalness={1}

      /*
       * Mantiene el aspecto pulido,
       * pero evita un espejo excesivamente
       * duro que genere highlights feos.
       */
      roughness={0.16}

      clearcoat={1}
      clearcoatRoughness={0.045}

      reflectivity={1}

      /*
       * Sin Environment/Lightformers,
       * así que no necesitamos exagerar
       * reflejos artificiales.
       */
      envMapIntensity={1}

      emissive="#000000"
      emissiveIntensity={0}
    />
  )
}

/* =========================================
   MEDALLION
========================================= */

type ChromeMedallionProps = {
  canvas: HTMLCanvasElement | null
  onCursorChange: (
    cursor: CanvasCursor,
  ) => void
}

function ChromeMedallion({
  canvas,
  onCursorChange,
}: ChromeMedallionProps) {
  const group = useRef<THREE.Group>(null)

  /*
   * Pose inicial ligeramente inclinada.
   */
  const initialY = 0.42
  const initialX = -0.16

  const rotationY = useRef(initialY)
  const targetRotationY = useRef(initialY)

  const rotationX = useRef(initialX)
  const targetRotationX = useRef(initialX)

  /*
   * Inercia horizontal.
   */
  const velocityY = useRef(0)

  const dragging = useRef(false)

  const lastPointer = useRef({
    x: 0,
    y: 0,
  })

  const svg = useLoader(
    SVGLoader,
    emblemUrl,
  )

  /*
   * Convertimos las rutas SVG
   * en shapes independientes.
   */
  const parts = useMemo<EmblemPart[]>(() => {
    return svg.paths.flatMap(
      (path, pathIndex) => {
        const node =
          path.userData?.node as
            | SVGElement
            | undefined

        const id =
          node?.id ||
          `part-${pathIndex}`

        return SVGLoader
          .createShapes(path)
          .map((shape, shapeIndex) => ({
            id,
            shape,
            key: `${id}-${shapeIndex}`,
          }))
      },
    )
  }, [svg])

  /* =======================================
     DRAG 360
  ======================================= */

  useEffect(() => {
    if (!canvas) return

    const pointerDown = (
      event: PointerEvent,
    ) => {
      dragging.current = true

      lastPointer.current.x =
        event.clientX

      lastPointer.current.y =
        event.clientY

      velocityY.current = 0

      onCursorChange('grabbing')

      canvas.setPointerCapture?.(
        event.pointerId,
      )
    }

    const pointerMove = (
      event: PointerEvent,
    ) => {
      if (!dragging.current) return

      const deltaX =
        event.clientX -
        lastPointer.current.x

      const deltaY =
        event.clientY -
        lastPointer.current.y

      /*
       * Giro horizontal ilimitado.
       */
      const horizontalForce =
        deltaX * 0.012

      targetRotationY.current +=
        horizontalForce

      velocityY.current =
        horizontalForce

      /*
       * Movimiento vertical limitado.
       */
      targetRotationX.current =
        THREE.MathUtils.clamp(
          targetRotationX.current +
            deltaY * 0.0035,
          -0.34,
          0.34,
        )

      lastPointer.current.x =
        event.clientX

      lastPointer.current.y =
        event.clientY
    }

    const pointerUp = (
      event: PointerEvent,
    ) => {
      dragging.current = false

      onCursorChange('grab')

      if (
        canvas.hasPointerCapture?.(
          event.pointerId,
        )
      ) {
        canvas.releasePointerCapture(
          event.pointerId,
        )
      }
    }

    canvas.addEventListener(
      'pointerdown',
      pointerDown,
    )

    canvas.addEventListener(
      'pointermove',
      pointerMove,
    )

    canvas.addEventListener(
      'pointerup',
      pointerUp,
    )

    canvas.addEventListener(
      'pointercancel',
      pointerUp,
    )

    canvas.addEventListener(
      'pointerleave',
      pointerUp,
    )

    return () => {
      canvas.removeEventListener(
        'pointerdown',
        pointerDown,
      )

      canvas.removeEventListener(
        'pointermove',
        pointerMove,
      )

      canvas.removeEventListener(
        'pointerup',
        pointerUp,
      )

      canvas.removeEventListener(
        'pointercancel',
        pointerUp,
      )

      canvas.removeEventListener(
        'pointerleave',
        pointerUp,
      )
    }
  }, [canvas, onCursorChange])

  /* =======================================
     MOTION + INERTIA + IDLE
  ======================================= */

  useFrame(({ clock }, delta) => {
    if (!group.current) return

    if (!dragging.current) {
      /*
       * Inercia al soltar.
       */
      targetRotationY.current +=
        velocityY.current

      velocityY.current =
        THREE.MathUtils.damp(
          velocityY.current,
          0,
          3.2,
          delta,
        )

      /*
       * Movimiento idle.
       */
      const idleX =
        initialX +
        Math.sin(
          clock.elapsedTime * 0.65,
        ) * 0.025

      const idleY =
        initialY +
        Math.sin(
          clock.elapsedTime * 0.45,
        ) * 0.045

      targetRotationX.current =
        THREE.MathUtils.damp(
          targetRotationX.current,
          idleX,
          1.8,
          delta,
        )

      /*
       * Regresa lentamente a la
       * posición idle cuando termina
       * la inercia.
       */
      if (
        Math.abs(
          velocityY.current,
        ) < 0.002
      ) {
        targetRotationY.current =
          THREE.MathUtils.damp(
            targetRotationY.current,
            idleY,
            0.55,
            delta,
          )
      }
    }

    rotationY.current =
      THREE.MathUtils.damp(
        rotationY.current,
        targetRotationY.current,
        dragging.current
          ? 13
          : 7,
        delta,
      )

    rotationX.current =
      THREE.MathUtils.damp(
        rotationX.current,
        targetRotationX.current,
        7,
        delta,
      )

    group.current.rotation.y =
      rotationY.current

    group.current.rotation.x =
      rotationX.current

    /*
     * Floating muy sutil.
     */
    group.current.position.y =
      Math.sin(
        clock.elapsedTime * 0.75,
      ) * 0.028

    group.current.position.x =
      Math.sin(
        clock.elapsedTime * 0.42,
      ) * 0.008
  })

  /* =======================================
     OPENWORK GEOMETRY
  ======================================= */

  return (
    <group ref={group}>
      {parts.map(
        ({ id, shape, key }) => {
          const isRing =
            id === 'ring'

          return (
            <group
              key={key}
              position={[
                -SVG_WIDTH *
                  SVG_SCALE /
                  2,

                SVG_HEIGHT *
                  SVG_SCALE /
                  2,

                isRing
                  ? -0.055
                  : 0.02,
              ]}
              scale={[
                SVG_SCALE,
                -SVG_SCALE,
                SVG_SCALE,
              ]}
            >
              <mesh>
                <extrudeGeometry
                  args={[
                    shape,
                    isRing
                      ? ringExtrude
                      : logoExtrude,
                  ]}
                />

                <ChromeMaterial />
              </mesh>
            </group>
          )
        },
      )}
    </group>
  )
}

/* =========================================
   SCENE
========================================= */

function EntryLogo3D() {
  const [
    canvas,
    setCanvas,
  ] = useState<HTMLCanvasElement | null>(
    null,
  )

  const [
    cursor,
    setCursor,
  ] = useState<CanvasCursor>('grab')

  return (
    <Canvas
      dpr={[1.25, 2]}
      camera={{
        position: [0, 0, 5],
        fov: 31,
        near: 0.1,
        far: 50,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference:
          'high-performance',
      }}
      onCreated={({ gl }) => {
        setCanvas(gl.domElement)
      }}
      style={{
        cursor,
        touchAction: 'none',
      }}
    >
      <Suspense fallback={null}>
        {/* =================================
            SOFT BLACK CHROME LIGHTING
        ================================= */}

        {/*
         * Muy poca luz ambiente:
         * queremos conservar el negro.
         */}

        <ambientLight
          intensity={0.18}
          color="#ffffff"
        />

        {/*
         * Fill general muy tenue.
         */}

        <hemisphereLight
          intensity={0.35}
          color="#d8dce2"
          groundColor="#000000"
        />

        {/*
         * Highlight blanco amplio.
         *
         * Es luz real, NO Lightformer,
         * así que no genera rectángulos
         * ni líneas artificiales.
         */}

        <spotLight
          position={[4.5, 5, 6]}
          intensity={7}
          angle={0.9}
          penumbra={1}
          color="#ffffff"
        />

        {/*
         * Segundo fill extremadamente
         * suave desde el lado contrario.
         */}

        <spotLight
          position={[-5, 2, 5]}
          intensity={3.5}
          angle={1}
          penumbra={1}
          color="#aeb4bc"
        />

        {/* =================================
            BLOOD RED GLOW
        ================================= */}

        {/*
         * Este es el glow rojo fino
         * que sí queremos conservar.
         */}

        <spotLight
        position={[-3, -2, 4]}
        intensity={8}
        angle={0.62}
        penumbra={1}
        color="#eef2f5"
        />

        <pointLight
        position={[2.2, -1.2, -2]}
        intensity={5.5}
        color="#ffffff"
        />

        {/*
         * IMPORTANTE:
         *
         * No hay Environment.
         * No hay Lightformer rect.
         * No hay Lightformer ring.
         *
         * Por tanto desaparecen esas
         * líneas blancas/reflejos duros.
         */}

        <ChromeMedallion
          canvas={canvas}
          onCursorChange={setCursor}
        />
      </Suspense>
    </Canvas>
  )
}

export default EntryLogo3D
