"use client";

import { useRef } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Environment, Center } from "@react-three/drei";
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
  const targetPos = useRef(new THREE.Vector3(0, 1.5, cameraZ));

  useFrame(() => {
    targetPos.current.set(0, 2, cameraZ);
    camera.position.lerp(targetPos.current, 0.1);
    camera.lookAt(0, 0.3, 0);
  });

  return null;
}

export default function Scene({
  lidAngle,
  rotationY,
  cameraZ = 5,
}: SceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 1.5, 5], fov: 45 }}
      style={{ background: "transparent" }}
      gl={{ antialias: true, alpha: true }}
      dpr={[1, 2]}
    >
      {/* Dynamic camera */}
      <CameraController cameraZ={cameraZ} />

      {/* Lighting — brighter to make model visible */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.2}
        color="#ffffff"
      />
      <directionalLight
        position={[-3, 4, -2]}
        intensity={0.4}
        color="#6366F1"
      />
      <pointLight
        position={[0, 3, 2]}
        intensity={0.8}
        color="#ffffff"
        distance={10}
      />

      {/* Laptop — scale up, Center auto-centers */}
      <Center>
        <Laptop lidAngle={lidAngle} rotationY={rotationY} scale={0.15} />
      </Center>

      {/* Environment for reflections only — NO background */}
      <Environment preset="night" background={false} />
    </Canvas>
  );
}
