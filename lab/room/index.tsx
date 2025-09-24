"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useHelper,
  useGLTF,
  Environment,
  Html,
} from "@react-three/drei";
import { Suspense, useEffect, useRef, useState } from "react";

import smokeVertexShader from "./shaders/vertex.glsl";
import smokeFragmentShader from "./shaders/fragment.glsl";

const glassMaterial = new THREE.MeshPhysicalMaterial({
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
const waxMaterial = new THREE.MeshPhysicalMaterial({
  color: new THREE.Color("#fff4e6"),
  roughness: 0.8,
  metalness: 0,
});

const Smoke = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textureLoader = new THREE.TextureLoader();

  // 퍼린 노이즈 텍스처 (public/shaders/perlin.png 필요)
  const perlinTexture = textureLoader.load("/shaders/perlin.png");
  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;

  // ShaderMaterial
  const smokeMaterial = new THREE.ShaderMaterial({
    vertexShader: smokeVertexShader,
    fragmentShader: smokeFragmentShader,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uPerlinTexture: new THREE.Uniform(perlinTexture),
    },
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  });

  // 지오메트리
  const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
  smokeGeometry.translate(0, 0.5, 0);
  smokeGeometry.scale(0.33, 1, 0.33);

  // uTime 업데이트
  useFrame(({ clock }) => {
    smokeMaterial.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh
      ref={meshRef}
      geometry={smokeGeometry}
      material={smokeMaterial}
      position={[-1.8, 3, -2.1]}
    />
  );
};

const Scene = () => {
  const { scene } = useGLTF("/models/room.glb");

  useEffect(() => {
    scene.traverse((child: any) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        const name = child.name.toLowerCase();

        if (name === "candle") {
          child.material = glassMaterial;
        }

        if (name.includes("candle001")) {
          child.material = waxMaterial;
        }

        // if (name.includes("floor")) {
        //   child.receiveShadow = true;
        // }
      }
    });
  }, [scene]);

  return <primitive object={scene} />;
};
useGLTF.preload("/models/room.glb");

const Light = ({ isNight }: { isNight: boolean }) => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 2, "red");
  const pointLightRef = useRef<THREE.PointLight>(null);
  useHelper(pointLightRef, THREE.PointLightHelper, 0.5, "blue");
  const spotLightRef = useRef<THREE.SpotLight>(null);
  useHelper(spotLightRef, THREE.SpotLightHelper, "red");

  return (
    <>
      {isNight ? (
        <>
          <ambientLight intensity={0.2} color={0x222244} />
          <directionalLight
            // ref={directionalLightRef}
            position={[3, 10, -5]}
            color={0x88aaff}
            intensity={0.5}
            castShadow
          />
          <pointLight
            // ref={pointLightRef}
            position={[-2.9, 3.5, -2.2]}
            intensity={10}
            distance={50}
            decay={10}
            castShadow
            color={"#ffffff"}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight
            // ref={pointLightRef}
            position={[-2.1, 5, 0.1]}
            intensity={30}
            distance={7}
            decay={2}
            castShadow
            color={"#ffffff"}
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          {/* <spotLight
            ref={spotLightRef}
            position={[-2.3, 5.5, 0.1]} // 스탠드 위치
            angle={0.5} // 조금 넓게
            penumbra={0.6} // 가장자리 부드럽게
            intensity={150} // 충분히 밝게
            distance={8} // 책상 높이에 닿도록
            decay={1.5} // 감쇠 완화
            color={"#fff5cc"} // 전구 색
            castShadow
          /> */}
        </>
      ) : (
        <>
          <ambientLight intensity={2} color={0xffffff} />
          <directionalLight
            // ref={directionalLightRef}
            position={[3, 10, -5]}
            color={0xffffff}
            intensity={15}
            castShadow
          />
        </>
      )}
    </>
  );
};

export default function Room({ className }: { className?: string }) {
  const [isNight, setIsNight] = useState(true);

  return (
    <Canvas
      shadows={{ type: THREE.PCFSoftShadowMap }}
      camera={{ position: [20, 20, 20], fov: 20 }}
      gl={{
        antialias: true, // 안티엘리어싱 활성화 (기본값)
        powerPreference: "high-performance", // GPU 사용 최적화
      }}
      onCreated={({ gl }) => {
        gl.shadowMap.enabled = true;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
      }}
    >
      <color attach="background" args={[isNight ? "#000000" : "#ffffff"]} />

      {!isNight && <Environment preset="city" />}

      <Light isNight={isNight} />
      <Scene />
      <Smoke />
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

      {/* Canvas 안에서 버튼 추가 */}
      <Html position={[-2, 8, 0]}>
        <button
          onClick={() => setIsNight((prev) => !prev)}
          style={{
            padding: "8px 12px",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          {isNight ? "☀️ 낮으로" : "🌙 밤으로"}
        </button>
      </Html>
    </Canvas>
  );
}

/* minAzimuthAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 3} */
