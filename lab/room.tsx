"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useHelper,
  useGLTF,
  Environment,
} from "@react-three/drei";
import { Suspense, useRef } from "react";

const Scene = () => {
  const { scene } = useGLTF("/models/room.glb");
  return <primitive object={scene} />;
};
useGLTF.preload("/models/room.glb");

const Light = () => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);

  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 2, "red");

  return (
    <>
      <ambientLight intensity={2} color={0xffffff} />
      <directionalLight
        ref={directionalLightRef}
        position={[2, 10, 0]}
        color={0xffffff}
        intensity={15}
        castShadow
      />
    </>
  );
};

export default function Room({ className }: { className?: string }) {
  return (
    <Canvas camera={{ position: [20, 20, 20], fov: 40 }}>
      <color attach="background" args={["#ffffff"]} />
      <Light />
      <Scene />
      <OrbitControls
        makeDefault
        target={[-0.5, 2, 0]}
        enablePan={false}
        minPolarAngle={Math.PI / -1}
        maxPolarAngle={Math.PI / 3}
        maxDistance={15}
        minDistance={2}
      />
      {/* <OrbitControls makeDefault target={[-0.5, 2, 0]} /> */}
    </Canvas>
  );
}

/* minAzimuthAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 3} */
