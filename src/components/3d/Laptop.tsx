"use client";

import { useRef, useMemo, useEffect, useCallback } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

interface LaptopProps {
  lidAngle: number; // 0 = closed, Math.PI/2 = fully open (90 degrees)
  rotationY: number; // Y-axis rotation for 360 spin
  scale?: number;
}

// Code lines for the screen texture
const CODE_LINES = [
  'import { LangChain } from "langchain";',
  'import { OpenAI } from "openai";',
  'import { Whisper } from "deepgram";',
  "",
  "async function processCall(audio: Buffer) {",
  "  const transcript = await whisper.transcribe(audio);",
  "  const analysis = await chain.invoke({",
  "    transcript,",
  '    models: ["gemini-2", "gpt-5", "deepseek-r1"],',
  "  });",
  "",
  "  const sentiment = analysis.sentiment;",
  "  const summary = analysis.summary;",
  "  const nextStep = analysis.nextStep;",
  "",
  "  return {",
  "    sentiment,",
  "    summary,",
  "    action: nextStep,",
  "    confidence: analysis.score,",
  "  };",
  "}",
  "",
  "// Processing 2,500+ calls daily",
  "const pipeline = new QCPipeline({",
  "  consensus: true,",
  "  threshold: 0.85,",
  "  models: 3,",
  "});",
  "",
  "await pipeline.start();",
];

// Syntax highlighting colors (GitHub Dark / VS Code dark theme)
const COLORS = {
  keyword: "#FF7B72",
  string: "#A5D6FF",
  function: "#D2A8FF",
  comment: "#8B949E",
  default: "#E6EDF3",
  bracket: "#FFA657",
  type: "#79C0FF",
  number: "#79C0FF",
  lineNumber: "#484F58",
  background: "#0D1117",
  cursor: "#E6EDF3",
};

const KEYWORDS = new Set([
  "import",
  "from",
  "async",
  "function",
  "await",
  "const",
  "return",
  "new",
  "true",
  "false",
]);

export default function Laptop({
  lidAngle,
  rotationY,
  scale = 1,
}: LaptopProps) {
  const groupRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/macbook.glb");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const cursorVisibleRef = useRef(true);
  const lastBlinkRef = useRef(0);

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

  // Initialize the offscreen canvas once
  useEffect(() => {
    if (typeof document === "undefined") return;
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    canvasRef.current = canvas;

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    textureRef.current = texture;

    return () => {
      texture.dispose();
    };
  }, []);

  // Function to draw the screen with a given number of visible lines
  const drawScreen = useCallback(
    (visibleLines: number, showCursor: boolean) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Background - deep dark
      ctx.fillStyle = COLORS.background;
      ctx.fillRect(0, 0, 1024, 640);

      // Top bar (window chrome)
      ctx.fillStyle = "#161B22";
      ctx.fillRect(0, 0, 1024, 28);

      // Traffic lights
      const dotY = 14;
      const dots = [
        { x: 18, color: "#FF5F57" },
        { x: 38, color: "#FEBC2E" },
        { x: 58, color: "#28C840" },
      ];
      dots.forEach((dot) => {
        ctx.beginPath();
        ctx.arc(dot.x, dotY, 5, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
      });

      // Tab title
      ctx.font = "11px monospace";
      ctx.fillStyle = "#8B949E";
      ctx.fillText("main.ts - Portfolio", 85, 18);

      // Code area starts below the chrome bar
      const codeStartY = 46;
      const lineHeight = 15;
      ctx.font = "12px monospace";

      const linesToDraw = Math.min(visibleLines, CODE_LINES.length);

      for (let i = 0; i < linesToDraw; i++) {
        const line = CODE_LINES[i];
        const y = codeStartY + i * lineHeight;

        // Line number
        ctx.fillStyle = COLORS.lineNumber;
        ctx.fillText(`${(i + 1).toString().padStart(2, " ")}`, 10, y);

        // Syntax-highlighted code
        let x = 38;
        const words = line.split(/(\s+|[{}().,;:=<>[\]])/);
        words.forEach((word) => {
          if (KEYWORDS.has(word)) {
            ctx.fillStyle = COLORS.keyword;
          } else if (
            word.startsWith('"') ||
            word.startsWith("'") ||
            word.startsWith("`")
          ) {
            ctx.fillStyle = COLORS.string;
          } else if (word.startsWith("//")) {
            ctx.fillStyle = COLORS.comment;
          } else if (/[{}().,;:=<>[\]]/.test(word)) {
            ctx.fillStyle = COLORS.bracket;
          } else if (/^\d+/.test(word)) {
            ctx.fillStyle = COLORS.number;
          } else if (/^[A-Z]/.test(word)) {
            ctx.fillStyle = COLORS.function;
          } else {
            ctx.fillStyle = COLORS.default;
          }
          ctx.fillText(word, x, y);
          x += ctx.measureText(word).width;
        });
      }

      // Blinking cursor at end of last visible line
      if (showCursor && linesToDraw > 0) {
        const lastLine = CODE_LINES[linesToDraw - 1];
        const lastY = codeStartY + (linesToDraw - 1) * lineHeight;

        // Measure the width of the last line
        ctx.font = "12px monospace";
        const lastLineWidth = ctx.measureText(lastLine).width;
        const cursorX = 38 + lastLineWidth + 2;

        ctx.fillStyle = COLORS.cursor;
        ctx.fillRect(cursorX, lastY - 10, 7, 13);
      }

      // Mark texture for update
      if (textureRef.current) {
        textureRef.current.needsUpdate = true;
      }
    },
    []
  );

  // Enhance materials on the cloned model
  useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshStandardMaterial;
        if (!mat) return;

        // Ensure material is writable
        child.material = mat.clone();
        const m = child.material as THREE.MeshStandardMaterial;

        if (child.name === "body" || child.name === "body_1" || child.name === "body_2") {
          // Aluminum body - highly reflective brushed metal
          m.metalness = 0.95;
          m.roughness = 0.12;
          m.color = new THREE.Color("#8a8a8f");
          m.envMapIntensity = 2.0;
        }

        if (child.name === "back" || child.name === "back_1" || child.name === "back_2") {
          // Back of lid - matching aluminum
          m.metalness = 0.95;
          m.roughness = 0.12;
          m.color = new THREE.Color("#8a8a8f");
          m.envMapIntensity = 2.0;
        }

        if (child.name === "matte") {
          // Screen surface - emissive for glow effect
          // Will be overridden with texture below, but set base properties
          m.emissive = new THREE.Color("#b4d4ff");
          m.emissiveIntensity = 0.8;
          m.metalness = 0;
          m.roughness = 0.05;
          m.envMapIntensity = 0.3;
        }

        m.needsUpdate = true;
      }
    });
  }, [clonedScene]);

  // Apply screen texture and set up emissive mapping
  useEffect(() => {
    if (meshes.matte && textureRef.current) {
      const matte = meshes.matte as THREE.Mesh;
      if (matte.material) {
        const mat = matte.material as THREE.MeshStandardMaterial;
        mat.map = textureRef.current;
        mat.emissiveMap = textureRef.current;
        mat.emissive = new THREE.Color(0xffffff);
        mat.emissiveIntensity = 1.0; // Brighter for bloom pickup
        mat.metalness = 0;
        mat.roughness = 0.08;
        mat.needsUpdate = true;
      }
    }
  }, [meshes]);

  // Animate the screen/lid opening based on lidAngle prop
  useEffect(() => {
    if (meshes.screen) {
      meshes.screen.rotation.x = Math.PI - lidAngle;
    }
  }, [meshes, lidAngle]);

  // Typing animation + cursor blink driven by useFrame
  useFrame((_, delta) => {
    // Calculate how many lines should be visible based on lid angle
    // lidAngle goes from 0 (closed) to PI/2 (fully open)
    const openProgress = Math.min(lidAngle / (Math.PI / 2), 1); // 0 to 1

    // Lines start appearing after lid is ~30% open, finish at ~90% open
    const typingStart = 0.3;
    const typingEnd = 0.95;
    let typingProgress = 0;
    if (openProgress > typingStart) {
      typingProgress = Math.min(
        (openProgress - typingStart) / (typingEnd - typingStart),
        1
      );
    }

    const visibleLines = Math.floor(typingProgress * CODE_LINES.length);

    // Cursor blink every 530ms
    lastBlinkRef.current += delta;
    if (lastBlinkRef.current > 0.53) {
      cursorVisibleRef.current = !cursorVisibleRef.current;
      lastBlinkRef.current = 0;
    }

    // Only redraw if lid is at least partially open
    if (openProgress > 0.2) {
      drawScreen(visibleLines, cursorVisibleRef.current);
    } else {
      // Screen is off when lid is mostly closed
      drawScreen(0, false);
    }
  });

  return (
    <group ref={groupRef} rotation={[0, rotationY, 0]} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

useGLTF.preload("/models/macbook.glb");
