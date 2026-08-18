"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const COLS = 16;
const ROWS = 10;
const SPACING = 0.62;
const INK = new THREE.Color("#0e1a25");
const MUTED = new THREE.Color("#7eb8b0");
const ACCENT = new THREE.Color("#e0a458");

type Instance = {
  x: number;
  z: number;
  phase: number;
  speed: number;
  baseHeight: number;
  color: THREE.Color;
};

// Deterministic hash so instance generation stays a pure function of (i, j),
// no Math.random() during render.
function seededRandom(i: number, j: number) {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

function Bars() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const instances = useMemo<Instance[]>(() => {
    const list: Instance[] = [];
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        const roll = seededRandom(i, j);
        list.push({
          x: (i - COLS / 2) * SPACING,
          z: (j - ROWS / 2) * SPACING,
          phase: seededRandom(i + 1, j) * Math.PI * 2,
          speed: 0.5 + seededRandom(i, j + 1) * 0.4,
          baseHeight: 0.3 + seededRandom(i + 2, j + 2) * 0.5,
          color: roll > 0.94 ? ACCENT : roll > 0.6 ? MUTED : INK,
        });
      }
    }
    return list;
  }, []);

  useFrame(({ clock }) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = clock.getElapsedTime();

    instances.forEach((inst, i) => {
      const wave = Math.sin(t * inst.speed + inst.phase);
      const height = inst.baseHeight + wave * 0.35 + 0.55;
      dummy.position.set(inst.x, height / 2 - 1.4, inst.z);
      dummy.scale.set(1, Math.max(height, 0.08), 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, inst.color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COLS * ROWS]}>
      <boxGeometry args={[0.22, 1, 0.22]} />
      <meshStandardMaterial roughness={0.6} metalness={0.05} />
    </instancedMesh>
  );
}

function Rig() {
  const { camera, pointer } = useThree();
  const target = useRef({ x: 0, y: 0 });

  // useFrame runs on the r3f render loop, outside React's render/commit cycle,
  // so mutating the Three.js camera object here (instead of via setState) is
  // the standard, performance-critical r3f pattern, not a purity violation.
  /* eslint-disable react-hooks/immutability */
  useFrame(() => {
    target.current.x += (pointer.x * 0.6 - target.current.x) * 0.03;
    target.current.y += (pointer.y * 0.3 - target.current.y) * 0.03;
    camera.position.x = target.current.x;
    camera.position.y = 3.4 + target.current.y * 0.4;
    camera.lookAt(0, -0.4, 0);
  });
  /* eslint-enable react-hooks/immutability */

  return null;
}

export function LedgerGrid() {
  // Canvas is mounted via a dynamic (ssr:false) import, so R3F's own
  // ResizeObserver sometimes takes its first measurement before this
  // container's real layout has settled and never re-fires, leaving the
  // drawing buffer stuck at the browser's 300x150 canvas default. Nudging a
  // window resize shortly after mount forces R3F to re-measure correctly.
  useEffect(() => {
    const id = window.setTimeout(() => window.dispatchEvent(new Event("resize")), 300);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 3.4, 8.4], fov: 32 }}
      gl={{ alpha: true, antialias: true }}
      className="!absolute inset-0"
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[4, 6, 3]} intensity={1.1} />
      <directionalLight position={[-4, 2, -3]} intensity={0.3} />
      <Bars />
      <Rig />
    </Canvas>
  );
}
