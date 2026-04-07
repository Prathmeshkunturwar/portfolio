"use client";

import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

interface LaptopProps {
  lidAngle: number; // 0 = closed, Math.PI/2 = fully open (90 degrees)
  rotationY: number; // Y-axis rotation for 360 spin
  scale?: number;
}

export default function Laptop({
  lidAngle,
  rotationY,
  scale = 1,
}: LaptopProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/macbook.glb");

  // Clone the scene deeply to avoid mutating the shared useGLTF reference
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  // Build a lookup of meshes by name from the CLONE so mutations are safe
  const meshes = useMemo(() => {
    const map: Record<string, THREE.Object3D> = {};
    clonedScene.traverse((child) => {
      if (child.name) {
        map[child.name] = child;
      }
    });
    return map;
  }, [clonedScene]);

  // Code text for the screen texture
  const codeLines = useMemo(
    () => [
      'import { LangChain } from "langchain";',
      'import { OpenAI } from "openai";',
      "",
      "async function processCall(audio) {",
      "  const transcript = await whisper(audio);",
      "  const analysis = await chain.invoke({",
      "    transcript,",
      '    models: ["gemini", "gpt4", "deepseek"],',
      "  });",
      "",
      "  return {",
      "    sentiment: analysis.sentiment,",
      "    summary: analysis.summary,",
      "    action: analysis.nextStep,",
      "  };",
      "}",
      "",
      "// Processing 2,500+ calls daily",
      "const pipeline = new QCPipeline({",
      "  consensus: true,",
      "  threshold: 0.85,",
      "});",
    ],
    []
  );

  // Create code screen texture using canvas
  const screenTexture = useMemo(() => {
    if (typeof document === "undefined") return null;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext("2d")!;

    // Background - VS Code dark theme
    ctx.fillStyle = "#0D1117";
    ctx.fillRect(0, 0, 1024, 640);

    // Code text
    ctx.font = "16px monospace";
    const colors = {
      keyword: "#FF7B72",
      string: "#A5D6FF",
      function: "#D2A8FF",
      comment: "#8B949E",
      default: "#E6EDF3",
      bracket: "#FFA657",
    };

    codeLines.forEach((line, i) => {
      const y = 30 + i * 28;
      // Line number
      ctx.fillStyle = "#484F58";
      ctx.fillText(`${(i + 1).toString().padStart(2, " ")}`, 15, y);

      // Simple syntax highlighting
      let x = 50;
      const words = line.split(/(\s+|[{}().,;:=])/);
      words.forEach((word) => {
        if (
          [
            "import",
            "from",
            "async",
            "function",
            "await",
            "const",
            "return",
            "new",
            "true",
          ].includes(word)
        ) {
          ctx.fillStyle = colors.keyword;
        } else if (word.startsWith('"') || word.startsWith("'")) {
          ctx.fillStyle = colors.string;
        } else if (word.startsWith("//")) {
          ctx.fillStyle = colors.comment;
        } else if (/[{}().,;:=]/.test(word)) {
          ctx.fillStyle = colors.bracket;
        } else if (/^[A-Z]/.test(word)) {
          ctx.fillStyle = colors.function;
        } else {
          ctx.fillStyle = colors.default;
        }
        ctx.fillText(word, x, y);
        x += ctx.measureText(word).width;
      });
    });

    // Cursor blink effect
    ctx.fillStyle = "#E6EDF3";
    ctx.fillRect(50, 30 + codeLines.length * 28 - 15, 8, 18);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, [codeLines]);

  // Apply screen texture to the "matte" mesh (the display surface) and
  // update the lid rotation each render via useEffect
  useEffect(() => {
    // Apply code texture to the matte (screen display) mesh
    if (meshes.matte && screenTexture) {
      const matte = meshes.matte as THREE.Mesh;
      if (matte.material) {
        const mat = matte.material as THREE.MeshStandardMaterial;
        mat.map = screenTexture;
        mat.emissiveMap = screenTexture;
        mat.emissive = new THREE.Color(0xffffff);
        mat.emissiveIntensity = 0.5;
        mat.metalness = 0;
        mat.roughness = 1;
        mat.needsUpdate = true;
      }
    }
  }, [meshes, screenTexture]);

  // Animate the screen/lid opening based on lidAngle prop
  useEffect(() => {
    if (meshes.screen) {
      // Model: rotation.x = PI/2 = closed (screen folded onto keyboard)
      //        rotation.x = 0    = flat open (180 degrees)
      //        rotation.x ~ 0.25 = normal laptop position (~105 degrees)
      //
      // Model: rotation.x = PI/2 = open (90deg, normal viewing position)
      //        rotation.x = PI   = closed (folded onto keyboard)
      // lidAngle prop: 0 = closed, PI/2 = open
      // At lidAngle=0: want closed -> rotation.x = PI
      // At lidAngle=PI/2: want open -> rotation.x = PI/2
      meshes.screen.rotation.x = Math.PI - lidAngle;
    }
  }, [meshes, lidAngle]);

  return (
    <group ref={groupRef} rotation={[0, rotationY, 0]} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/models/macbook.glb");
