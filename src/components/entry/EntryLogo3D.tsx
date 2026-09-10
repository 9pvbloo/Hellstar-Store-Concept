import {
  Suspense,
  useEffect,
  useMemo,
  useRef,
} from 'react'

import {
  Canvas,
  useFrame,
  useLoader,
  useThree,
} from '@react-three/fiber'

import {
  Environment,
  Lightformer,
} from '@react-three/drei'

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
   BLACK CHROME MATERIAL
========================================= */

function ChromeMaterial({
  accent = false,
}: {
  accent?: boolean
}) {
  return (
    <meshPhysicalMaterial
      /*
       * Black chrome.
       *
       * El rostro + estrella son ligeramente
       * más claros que el aro para mantener
       * buena lectura sin dejar de ser negros.
       */
      color={
        accent
          ? '#1b1f24'
          : '#101216'
      }

      metalness={1}

      /*
       * Suficientemente pulido para reflejar
       * las franjas rojas y blancas.
       */
      roughness={
        accent
          ? 0.10
          : 0.13
      }

      clearcoat={1}
      clearcoatRoughness={0.018}

      reflectivity={1}

      /*
       * Reflejos fuertes sin convertir
       * el objeto en plata blanca.
       */
      envMapIntensity={
        accent
          ? 4.8
          : 4.4
      }

      /*
       * Sin autoiluminación.
       * El aspecto chrome viene realmente
       * de las luces y el Environment.
       */
      emissive="#000000"
      emissiveIntensity={0}
    />
  )
}

/* =========================================
   MEDALLION
========================================= */

function ChromeMedallion() {
  const group = useRef<THREE.Group>(null)

  /*
   * Pose inicial.
   *
   * Evita que al hacer F5 el medallón
   * aparezca completamente plano.
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

  const { gl } = useThree()

  const svg = useLoader(
    SVGLoader,
    emblemUrl,
  )

  /*
   * Convertimos las rutas del SVG
   * en Shapes que luego extruimos.
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
    const canvas = gl.domElement

    canvas.style.cursor = 'grab'
    canvas.style.touchAction = 'none'

    const pointerDown = (
      event: PointerEvent,
    ) => {
      dragging.current = true

      lastPointer.current.x =
        event.clientX

      lastPointer.current.y =
        event.clientY

      velocityY.current = 0

      canvas.style.cursor =
        'grabbing'

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
       * Fuerza horizontal.
       *
       * No tiene límite:
       * puede girar 360, 720, 1080...
       */
      const horizontalForce =
        deltaX * 0.012

      targetRotationY.current +=
        horizontalForce

      velocityY.current =
        horizontalForce

      /*
       * Movimiento vertical mucho
       * más controlado.
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

      canvas.style.cursor = 'grab'

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
  }, [gl])

  /* =======================================
     MOTION + INERTIA + IDLE
  ======================================= */

  useFrame(({ clock }, delta) => {
    if (!group.current) return

    if (!dragging.current) {
      /*
       * Inercia después de soltar.
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
       * Micro movimiento automático
       * cuando el usuario no interactúa.
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
       * Solo intenta regresar al idle
       * cuando la inercia prácticamente
       * terminó.
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
     * Floating extremadamente sutil.
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

          const isAccent =
            id === 'star' ||
            id === 'face-flames'

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

                <ChromeMaterial
                  accent={isAccent}
                />
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
    >
      <Suspense fallback={null}>
        {/* =================================
            BASE LIGHTING
        ================================= */}

        <ambientLight
          intensity={0.72}
          color="#ffffff"
        />

        <hemisphereLight
          intensity={1.25}
          color="#f3f5f7"
          groundColor="#08090b"
        />

        {/* Micro highlight frontal */}

        <directionalLight
          position={[0, 1.6, 6]}
          intensity={3.8}
          color="#ffffff"
        />

        {/* White upper reflection */}

        <spotLight
          position={[4, 5, 5]}
          intensity={18}
          angle={0.55}
          penumbra={1}
          color="#ffffff"
        />

        {/* Cold silver fill */}

        <spotLight
          position={[-5, 1, 4]}
          intensity={10}
          angle={0.65}
          penumbra={1}
          color="#bcc2c8"
        />

        {/* =================================
            BLOOD RED LIGHTING
        ================================= */}

        <spotLight
          position={[-3, -2, 4]}
          intensity={30}
          angle={0.56}
          penumbra={1}
          color="#8b0f19"
        />

        <pointLight
          position={[2.2, -1.2, -2]}
          intensity={14}
          color="#c1121f"
        />

        {/* =================================
            REFLECTION STUDIO
        ================================= */}

        <Environment resolution={256}>
          {/*
           * Blanco frontal controlado.
           *
           * Sirve para que el ojo entienda
           * inmediatamente que es chrome,
           * pero sin convertirlo en plata.
           */}

          <Lightformer
            form="rect"
            intensity={5.2}
            color="#ffffff"
            position={[0, 3, 5]}
            scale={[8, 1.2, 1]}
          />

          {/* Silver left reflection */}

          <Lightformer
            form="rect"
            intensity={3.4}
            color="#c9ced4"
            position={[-4, 0, 3]}
            rotation={[
              0,
              Math.PI / 2,
              0,
            ]}
            scale={[7.2, 1.1, 1]}
          />

          {/* Thin chrome streak */}

          <Lightformer
            form="rect"
            intensity={4.8}
            color="#ffffff"
            position={[4, 1, 3]}
            rotation={[
              0,
              -Math.PI / 2,
              0,
            ]}
            scale={[5, 0.45, 1]}
          />

          {/* =================================
              BLOOD RED REFLECTIONS
          ================================= */}

          {/* Lower blood reflection */}

          <Lightformer
            form="rect"
            intensity={6.5}
            color="#7a0c16"
            position={[0, -3.2, 4]}
            rotation={[
              0.35,
              0,
              0,
            ]}
            scale={[7, 0.95, 1]}
          />

          {/* Diagonal blood streak */}

          <Lightformer
            form="rect"
            intensity={5.6}
            color="#b31224"
            position={[2.6, 2.1, 4]}
            rotation={[
              0,
              -0.35,
              -0.45,
            ]}
            scale={[4.4, 0.42, 1]}
          />

          {/* Deep red opposite reflection */}

          <Lightformer
            form="rect"
            intensity={3.2}
            color="#b51f24"
            position={[-2, -3, 3]}
            rotation={[
              -0.4,
              0,
              0,
            ]}
            scale={[4, 0.45, 1]}
          />

          {/* Small white ring highlight */}

          <Lightformer
            form="ring"
            intensity={2.8}
            color="#ffffff"
            position={[0, 0, 4]}
            scale={4}
          />
        </Environment>

        <ChromeMedallion />
      </Suspense>
    </Canvas>
  )
}

export default EntryLogo3D