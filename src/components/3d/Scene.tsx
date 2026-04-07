"use client";

import { useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, Center, ContactShadows } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";
import Laptop from "./Laptop";

interface SceneProps {
  lidAngle: number;
  rotationY: number;
  cameraZ?: number;
}

// Inner component to dynamically update camera position
function CameraController({ cameraZ }: { cameraZ: number }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3(0, 2, cameraZ));

  useFrame(() => {
    targetPos.current.set(0, 2, cameraZ);
    camera.position.lerp(targetPos.current, 0.1);
    camera.lookAt(0, 0.3, 0);
  });

  return null;
}

// Reflective dark floor plane
function ReflectiveFloor() {
  return (
    <mesh
      rotation={[-Math.PI / 2, 0, 0]}
      position={[0, -0.52, 0]}
      receiveShadow
    >
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial
        color="#000000"
        metalness={0.95}
        roughness={0.35}
        envMapIntensity={0.4}
      />
    </mesh>
  );
}

export default function Scene({
  lidAngle,
  rotationY,
  cameraZ = 5,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2, 5], fov: 35 }}
      style={{ background: "transparent" }}
      gl={{
        antialias: true,
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
      dpr={[1, 2]}
      shadows
    >
      {/* Dynamic camera */}
      <CameraController cameraZ={cameraZ} />

      {/* === DARK ROOM LIGHTING === */}

      {/* Very dim ambient - simulates a dark room at 2AM */}
      <ambientLight intensity={0.04} color="#0a0a1a" />

      {/* Screen glow - the PRIMARY light source
          Simulates light radiating from the laptop display */}
      <pointLight
        position={[0, 0.8, 0.5]}
        intensity={2.5}
        color="#b4d4ff"
        distance={6}
        decay={2}
      />

      {/* Secondary screen bounce - softer, wider spread */}
      <pointLight
        position={[0, 0.3, 1.0]}
        intensity={0.8}
        color="#8ab4ff"
        distance={4}
        decay={2}
      />

      {/* Subtle rim light from behind - edge definition */}
      <directionalLight
        position={[0, 3, -3]}
        intensity={0.12}
        color="#ffffff"
      />

      {/* Cool fill from side - adds depth */}
      <directionalLight
        position={[3, 1, 2]}
        intensity={0.06}
        color="#4466ff"
      />

      {/* Warm accent from opposite side */}
      <directionalLight
        position={[-3, 0.5, 1]}
        intensity={0.04}
        color="#ff6644"
      />

      {/* Reflective floor */}
      <ReflectiveFloor />

      {/* Laptop model */}
      <Center>
        <Laptop lidAngle={lidAngle} rotationY={rotationY} scale={0.15} />
      </Center>

      {/* Soft contact shadows under the laptop */}
      <ContactShadows
        position={[0, -0.51, 0]}
        opacity={0.5}
        scale={10}
        blur={3}
        far={6}
        color="#000033"
      />

      {/* Night environment for reflections only */}
      <Environment preset="night" background={false} />

      {/* === POST-PROCESSING === */}
      <EffectComposer>
        {/* Bloom: makes emissive screen glow bleed into surrounding area */}
        <Bloom
          luminanceThreshold={0.5}
          luminanceSmoothing={0.9}
          intensity={0.7}
          mipmapBlur
        />
        {/* Vignette: darken edges for cinematic framing */}
        <Vignette eskil={false} offset={0.1} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
}
