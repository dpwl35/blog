"use client";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  useHelper,
  useGLTF,
  Environment,
} from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";

const Scene = () => {
  const { scene } = useGLTF("/models/room.glb");

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        const name = child.name.toLowerCase();

        // 유리
        if (name === "candle") {
          console.log("✅ Candle Mesh 적용:", child.name);

          child.material = new THREE.MeshPhysicalMaterial({
            transmission: 0.5,
            opacity: 1,
            roughness: 0.1,
            metalness: 0,
            ior: 1.5,
            thickness: 0.02,
            specularIntensity: 1,
            envMapIntensity: 1,
            clearcoat: 1,
            clearcoatRoughness: 0,
          });
        }

        // 왁스
        if (name.includes("candle001")) {
          console.log("Wax 적용:", child.name);

          child.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#fff4e6"), // 아이보리/왁스 컬러
            roughness: 0.8,
            metalness: 0,
          });
        }
      }
    });
  }, [scene]);

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
    <Canvas camera={{ position: [20, 20, 20], fov: 20 }}>
      <color attach="background" args={["#ffffff"]} />
      <Environment preset="city" />
      <Light />
      <Scene />
      {/* <OrbitControls
        makeDefault
        target={[-0.5, 2, 0]}
        enablePan={false}
        minPolarAngle={Math.PI / -1}
        maxPolarAngle={Math.PI / 3}
        maxDistance={15}
        minDistance={2}
      /> */}
      <OrbitControls makeDefault target={[-0.5, 2, 0]} />
    </Canvas>
  );
}

/* minAzimuthAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 3} */
