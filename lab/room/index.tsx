"use client";

import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useGLTF,
  Environment,
  Html,
  useHelper,
  Loader
} from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import smokeVertexShader from "./shaders/vertex.glsl";
import smokeFragmentShader from "./shaders/fragment.glsl";

export { metadata } from "./metadata";

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
  // 퍼린 노이즈 텍스처 (public/shaders/perlin.png 필요)
  const perlinTexture = useMemo(() => {
    const texture = new THREE.TextureLoader().load("/shaders/perlin.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  // ShaderMaterial
  const smokeMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: smokeVertexShader,
    fragmentShader: smokeFragmentShader,
    uniforms: {
      uTime: new THREE.Uniform(0),
      uPerlinTexture: new THREE.Uniform(perlinTexture),
    },
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false,
  }), [perlinTexture]);

  // 지오메트리
  const smokeGeometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(1, 1, 16, 64);
    geo.translate(0, 0.5, 0);
    geo.scale(0.33, 1, 0.33);
    return geo;
  }, []);

  // uTime 업데이트
  useFrame(({ clock }) => {
    smokeMaterial.uniforms.uTime.value = clock.elapsedTime;
  });

  return (
    <mesh
      geometry={smokeGeometry}
      material={smokeMaterial}
      position={[-1.8, 3, -2.1]}
    />
  );
};

const Scene =  ({ isNight }: { isNight: boolean }) => {
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

        if (name.includes("lamp1") || name.includes("cylinder002")) {
          child.material = child.material.clone();
          child.material.emissive = new THREE.Color("#ffffff");
          child.material.emissiveIntensity = isNight ? 2 : 0;
        }

        if (name.includes("floor")) {
          child.receiveShadow = true;
        }
      }
    });
  }, [scene, isNight]);

  return <primitive object={scene} />;
};
useGLTF.preload("/models/room.glb");

const Light = ({ isNight }: { isNight: boolean }) => {
  // const pointLightRef = useRef<any>(null);
  // useHelper(pointLightRef, THREE.PointLightHelper, 0.5);

  return (
    <>
      {isNight ? (
        <>
          <ambientLight intensity={1} color={0x222244} />
          <directionalLight
            // ref={directionalLightRef}
            position={[3, 10, -5]}
            color={0x88aaff}
            intensity={0.5}
            castShadow
          />
          <pointLight
            //ref={pointLightRef}
            position={[-2.9, 3.5, -2.1]}
            intensity={10}
            distance={15}
            decay={1}
            castShadow
            color={"#ffffff"}
            shadow-bias={-0.005} 
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <pointLight
           //ref={pointLightRef}
            position={[-2.1, 5, 0.1]}
            intensity={30}
            distance={7}
            decay={2}
            castShadow
            color={"#ffffff"}
            shadow-bias={-0.005} 
            shadow-mapSize-width={1024}
            shadow-mapSize-height={1024}
          />
          <spotLight
            //ref={spotLightRef}
            color='#ffffff' // 조명 색상
            intensity={80} // 조명 세기
            position={[-2.3, 5.5, 0.1]}
            distance={5} // 조명이 영향을 미치는 거리 (기본값: 0, 무한한 거리)
            angle={THREE.MathUtils.degToRad(30)}
            penumbra={1} // 빛 감쇠율 (기본값: 0)
          />
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
  const [isNight, setIsNight] = useState(false);

  return (
    <>
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
        <Suspense
          fallback={
            <Html center>
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  background: "rgba(0, 0, 0, 0.45)",
                  color: "#fff",
                  fontSize: 13,
                  pointerEvents: "none",
                }}
              >
                loading room...
              </div>
            </Html>
          }
        >
          <Scene isNight={isNight} />
        </Suspense>
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
        {/* <Html position={[0, 8, 0]}>
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
        </Html> */}
      </Canvas>
      <button
        onClick={() => setIsNight((prev) => !prev)}
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "8px 12px",
          background: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          whiteSpace: "nowrap",
          zIndex: 10,
        }}
      >
      {isNight ? "☀️ 낮으로" : "🌙 밤으로"}
      </button>
      <Loader />
    </>
  );
}

/* minAzimuthAngle={-Math.PI / 2}
        maxAzimuthAngle={Math.PI / 3} */
