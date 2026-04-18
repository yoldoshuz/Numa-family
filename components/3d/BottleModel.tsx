"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  useGLTF,
  Environment,
  Float,
  ContactShadows,
  Center,
  Bounds,
} from "@react-three/drei";
import type { Group } from "three";

type BottleProps = {
  src: string;
  rotate?: boolean;
};

function Model({ src, rotate = true }: BottleProps) {
  const ref = useRef<Group>(null);
  const { scene } = useGLTF(src);

  useFrame((_, delta) => {
    if (rotate && ref.current) ref.current.rotation.y += delta * 0.35;
  });

  return (
    <group ref={ref}>
      <primitive object={scene.clone()} />
    </group>
  );
}

interface BottleSceneProps {
  src: string;
  rotate?: boolean;
  className?: string;
  cameraZoom?: number;
}

export function BottleScene({
  src,
  rotate = true,
  className = "w-full h-full",
  cameraZoom = 1,
}: BottleSceneProps) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 4], fov: 35 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 5, 3]} intensity={1.2} />
        <directionalLight
          position={[-3, 2, -2]}
          intensity={0.5}
          color="#a7f3d0"
        />
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.1 / cameraZoom}>
            <Float floatIntensity={0.4} rotationIntensity={0.1} speed={1.2}>
              <Center>
                <Model src={src} rotate={rotate} />
              </Center>
            </Float>
          </Bounds>
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.3}
            scale={6}
            blur={2.4}
            far={2}
          />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}

useGLTF.preload("/3d/nutrition/Bonny.glb");
