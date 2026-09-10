import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { SVGLoader } from 'three/examples/jsm/loaders/SVGLoader.js'
import * as THREE from 'three'

import emblemUrl from '../../assets/branding/hellstar-emblem.svg?url'

const SVG_WIDTH = 736
const SVG_HEIGHT = 744
const SVG_SCALE = 0.0035

const extrudeSettings: THREE.ExtrudeGeometryOptions = {
  depth: 22,
  bevelEnabled: true,
  bevelThickness: 3.5,
  bevelSize: 3.5,
  bevelSegments: 4,
  curveSegments: 12,
  steps: 1,
}

function ChromeMedallion() {
  const medallion = useRef<THREE.Group>(null)

  const pointerTarget = useRef({
    x: 0,
    y: 0,
  })

  const svg = useLoader(SVGLoader, emblemUrl)

  const shapes = useMemo(() => {
    return svg.paths.flatMap((path, pathIndex) =>
      SVGLoader.createShapes(path).map((shape, shapeIndex) => ({
        shape,
        key: `${pathIndex}-${shapeIndex}`,
      })),
    )
  }, [svg])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      pointerTarget.current.x =
        (event.clientX / window.innerWidth) * 2 - 1

      pointerTarget.current.y =
        (event.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('pointermove', handlePointerMove)

    return () => {
      window.removeEventListener(
        'pointermove',
        handlePointerMove,
      )
    }
  }, [])

  useFrame(({ clock }, delta) => {
    if (!medallion.current) return

    const targetRotationX =
      -pointerTarget.current.y * 0.28

    const targetRotationY =
      pointerTarget.current.x * 0.42

    medallion.current.rotation.x =
      THREE.MathUtils.damp(
        medallion.current.rotation.x,
        targetRotationX,
        5.5,
        delta,
      )

    medallion.current.rotation.y =
      THREE.MathUtils.damp(
        medallion.current.rotation.y,
        targetRotationY,
        5.5,
        delta,
      )

    medallion.current.rotation.z =
      THREE.MathUtils.damp(
        medallion.current.rotation.z,
        pointerTarget.current.x * 0.025,
        5,
        delta,
      )

    medallion.current.position.y =
      Math.sin(clock.elapsedTime * 0.8) * 0.035
  })

  return (
    <group ref={medallion}>
      {/* Disco principal */}

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry
          args={[1.45, 1.45, 0.24, 96]}
        />

        <meshPhysicalMaterial
          color="#111214"
          metalness={1}
          roughness={0.16}
          clearcoat={1}
          clearcoatRoughness={0.08}
          envMapIntensity={1.8}
        />
      </mesh>

      {/* Borde metálico */}

      <mesh position={[0, 0, 0.135]}>
        <torusGeometry
          args={[1.32, 0.045, 20, 128]}
        />

        <meshPhysicalMaterial
          color="#e3e5e7"
          metalness={1}
          roughness={0.08}
          clearcoat={1}
          clearcoatRoughness={0.04}
          envMapIntensity={2.8}
        />
      </mesh>

      {/* Relieve proveniente de nuestro SVG */}

      <group
        position={[0, 0, 0.135]}
        scale={[
          SVG_SCALE,
          -SVG_SCALE,
          SVG_SCALE,
        ]}
      >
        <group
          position={[
            -SVG_WIDTH / 2,
            -SVG_HEIGHT / 2,
            0,
          ]}
        >
          {shapes.map(({ shape, key }) => (
            <mesh key={key}>
              <extrudeGeometry
                args={[shape, extrudeSettings]}
              />

              <meshPhysicalMaterial
                color="#d8dadd"
                metalness={1}
                roughness={0.075}
                clearcoat={1}
                clearcoatRoughness={0.035}
                envMapIntensity={3}
              />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  )
}

function EntryLogo3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      camera={{
        position: [0, 0, 5.2],
        fov: 34,
        near: 0.1,
        far: 50,
      }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.12} />

        <spotLight
          position={[3.5, 4, 5]}
          intensity={45}
          angle={0.42}
          penumbra={1}
          color="#ffffff"
        />

        <spotLight
          position={[-4, -1, 3]}
          intensity={18}
          angle={0.5}
          penumbra={1}
          color="#b51f24"
        />

        <Environment resolution={256}>
          <Lightformer
            form="rect"
            intensity={5}
            color="#ffffff"
            position={[0, 4, 4]}
            scale={[6, 1, 1]}
          />

          <Lightformer
            form="rect"
            intensity={3}
            color="#d7dce2"
            position={[-4, 0, 3]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[7, 1, 1]}
          />

          <Lightformer
            form="ring"
            intensity={2}
            color="#ffffff"
            position={[4, 1, 4]}
            scale={3}
          />
        </Environment>

        <ChromeMedallion />
      </Suspense>
    </Canvas>
  )
}

export default EntryLogo3D