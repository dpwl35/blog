"use client";

import "./style.scss";
import { useEffect } from "react";
import * as THREE from "three";

export default function Slider01() {
  useEffect(() => {
    const slides = [
      {
        name: "Barozzi Veiga",
        image:
          "https://cdn.cosmos.so/ca15a9de-9592-4e8d-9989-f7af1dc0da43?format=jpeg",
      },
      {
        name: "Inge Schuster",
        image:
          "https://cdn.cosmos.so/7ab8df08-145a-4a39-b846-b7762e3de3a1?format=jpeg",
      },
      {
        name: "Stephen Lenthall",
        image:
          "https://cdn.cosmos.so/7434ef34-e8fb-4456-9a46-21f63f12ee3a?format=jpeg",
      },
      {
        name: "Nicholas Alan Cope",
        image:
          "https://cdn.cosmos.so/48c9717f-0100-4e9d-8e6b-a993a1debc57?format=jpeg",
      },
      {
        name: "Source unknown",
        image:
          "https://cdn.cosmos.so/af860a51-e7bd-4fd1-a7b5-246b2b932b0e?format=jpeg",
      },
    ];

    //슬라이드 제어판
    const config = {
      minHeight: 1.5,
      maxHeight: 2,
      aspectRatio: 1.5,
      gap: 0.05,
      smoothing: 0.05,
      distortionStrength: 2.5,
      distortionSmoothing: 0.1,
      momentumFriction: 0.95,
      momentumThreshold: 0.001,
      wheelSpeed: 0.01,
      wheelMax: 150,
      dragSpeed: 0.01,
      dragMomentum: 0.01,
      touchSpeed: 0.01,
      touchMomentum: 0.1,
    };

    //캔버스 설정 + GPU 제한
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    const titleElement = document.getElementById("slider01-title")!;
    const counterElement = document.getElementById("slider01-count")!;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141414);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.z = 5;

    //무한루프
    const wrap = (value: number, range: number) =>
      ((value % range) + range) % range;

    //슬라이드 번호 표시
    const zeroPad = (n: number) => String(n).padStart(2, "0");

    //슬라이드 크기 제어
    const totalSlides = slides.length;
    const slideHeights = Array.from(
      { length: totalSlides },
      () =>
        config.minHeight +
        Math.random() * (config.maxHeight - config.minHeight),
    );

    // canvas내의 슬라이드 위치값 계산(초기Y축)
    const slideOffsets: number[] = [];
    let stackPosition = 0;

    for (let i = 0; i < totalSlides; i++) {
      if (i === 0) {
        slideOffsets.push(0);
        stackPosition = slideHeights[0] / 2;
      } else {
        stackPosition += config.gap + slideHeights[i] / 2;
        slideOffsets.push(stackPosition);
        stackPosition += slideHeights[i] / 2;
        /* 슬라이드 높이의 1/2 값 : mesh 위치는 중심점 기준이기 때문에 */
      }
    }

    // 시작과 끝 루프 위치 맞추기 + 카메라 범위로 슬라이드 유지
    const loopLength = stackPosition + config.gap + slideHeights[0] / 2;
    const halfLoop = loopLength / 2;

    // mesh 저장 배열
    const meshes: THREE.Mesh[] = [];
    const textureLoader = new THREE.TextureLoader();

    for (let i = 0; i < totalSlides; i++) {
      const height = slideHeights[i];
      const width = height * config.aspectRatio; //종횡비 유지

      // mesh 설정
      const geometry = new THREE.PlaneGeometry(width, height, 32, 16);
      const material = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        color: 0x999999,
      });
      const mesh = new THREE.Mesh(geometry, material);

      // mesh 정보 (각 슬라이드 정보)
      mesh.userData = {
        originalVertices: Array.from(geometry.attributes.position.array),
        offset: slideOffsets[i],
        name: slides[i].name,
        index: i,
      };

      // 이미지 로드 + 비율 유지
      textureLoader.load(slides[i].image, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        (material as THREE.MeshBasicMaterial).map = texture;
        material.color.set(0xffffff);
        material.needsUpdate = true;

        const imageAspect = texture.image.width / texture.image.height;
        const planeAspect = width / height;
        const ratio = imageAspect / planeAspect;

        if (ratio > 1) mesh.scale.y = 1 / ratio;
        else mesh.scale.x = ratio;
      });

      scene.add(mesh);
      meshes.push(mesh);
    }

    // mesh 왜곡
    function applyDistortion(
      mesh: THREE.Mesh,
      positionY: number,
      strength: number,
    ) {
      const positions = mesh.geometry.attributes.position;
      const original = mesh.userData.originalVertices;

      for (let i = 0; i < positions.count; i++) {
        const x = original[i * 3];
        const y = original[i * 3 + 1];
        const distance = Math.sqrt(x * x + (positionY + y) ** 2);
        const falloff = Math.max(0, 1 - distance / 2);
        const bend = Math.pow(Math.sin((falloff * Math.PI) / 2), 1.5);
        positions.setZ(i, bend * strength);
      }

      positions.needsUpdate = true;
      mesh.geometry.computeVertexNormals();
    }

    //스크롤 관련 변수
    let scrollPosition = 0;
    let scrollTarget = 0;
    let scrollMomentum = 0;
    let isScrolling = false;
    let lastFrameTime = 0;

    let distortionAmount = 0;
    let distortionTarget = 0;
    let velocityPeak = 0;
    let scrollDirection = 0;
    let directionTarget = 0;
    const velocityHistory = [0, 0, 0, 0, 0];

    let isDragging = false;
    let dragStartY = 0;
    let dragDelta = 0;
    let touchStartY = 0;
    let touchLastY = 0;
    let activeSlideIndex = -1;
    let animationId: number;

    const addDistortionBurst = (amount: number) => {
      distortionTarget = Math.min(1, distortionTarget + amount);
    };

    //스크롤 이동 제한 + 왜곡 & 스크롤 적용 + 150ms 후 스크롤 종료
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const clampedDelta =
        Math.sign(e.deltaY) * Math.min(Math.abs(e.deltaY), config.wheelMax);
      addDistortionBurst(Math.abs(clampedDelta) * 0.001);
      scrollTarget += clampedDelta * config.wheelSpeed;
      isScrolling = true;
      clearTimeout((window as any)._scrollTimeout);
      (window as any)._scrollTimeout = setTimeout(
        () => (isScrolling = false),
        150,
      );
    };

    const onTouchStart = (e: TouchEvent) => {
      touchStartY = touchLastY = e.touches[0].clientY;
      isScrolling = false;
      scrollMomentum = 0;
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const deltaY = e.touches[0].clientY - touchLastY;
      touchLastY = e.touches[0].clientY;
      addDistortionBurst(Math.abs(deltaY) * 0.02);
      scrollTarget -= deltaY * config.touchSpeed;
      isScrolling = true;
    };

    const onTouchEnd = () => {
      const swipeVelocity = (touchLastY - touchStartY) * 0.005;
      if (Math.abs(swipeVelocity) > 0.5) {
        scrollMomentum = -swipeVelocity * config.touchMomentum;
        addDistortionBurst(Math.abs(swipeVelocity) * 0.45);
        isScrolling = true;
        setTimeout(() => (isScrolling = false), 800);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      dragStartY = e.clientY;
      dragDelta = 0;
      scrollMomentum = 0;
      canvas.style.cursor = "grabbing";
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaY = e.clientY - dragStartY;
      dragStartY = e.clientY;
      dragDelta = deltaY;
      addDistortionBurst(Math.abs(deltaY) * 0.02);
      scrollTarget -= deltaY * config.dragSpeed;
      isScrolling = true;
    };

    const onMouseUp = () => {
      if (!isDragging) return;
      isDragging = false;
      canvas.style.cursor = "grab";
      if (Math.abs(dragDelta) > 2) {
        scrollMomentum = -dragDelta * config.dragMomentum;
        addDistortionBurst(Math.abs(dragDelta) * 0.005);
        isScrolling = true;
        setTimeout(() => (isScrolling = false), 800);
      }
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("resize", onResize);

    canvas.style.cursor = "grab";

    function animate(time: number) {
      animationId = requestAnimationFrame(animate);

      const deltaTime = lastFrameTime ? (time - lastFrameTime) / 1000 : 0.016;
      lastFrameTime = time;

      const previousScroll = scrollPosition;

      if (isScrolling) {
        scrollTarget += scrollMomentum;
        scrollMomentum *= config.momentumFriction;
        if (Math.abs(scrollMomentum) < config.momentumThreshold)
          scrollMomentum = 0;
      }

      scrollPosition += (scrollTarget - scrollPosition) * config.smoothing;

      const frameDelta = scrollPosition - previousScroll;

      if (Math.abs(frameDelta) > 0.00001) {
        directionTarget = frameDelta > 0 ? 1 : -1;
      }
      scrollDirection += (directionTarget - scrollDirection) * 0.08;

      const velocity = Math.abs(frameDelta) / deltaTime;

      velocityHistory.push(velocity);
      velocityHistory.shift();
      const averageVelocity =
        velocityHistory.reduce((a, b) => a + b) / velocityHistory.length;

      if (averageVelocity > velocityPeak) velocityPeak = averageVelocity;

      const isDecelerating =
        averageVelocity / (velocityPeak + 0.001) < 0.7 && velocityPeak > 0.5;
      velocityPeak *= 0.99;

      if (velocity > 0.05)
        distortionTarget = Math.max(
          distortionTarget,
          Math.min(1, velocity * 1),
        );
      if (isDecelerating || averageVelocity < 0.2)
        distortionTarget *= isDecelerating ? 0.95 : 0.855;

      distortionAmount +=
        (distortionTarget - distortionAmount) * config.distortionSmoothing;

      const signedDistortion = distortionAmount * scrollDirection;

      let closestDistance = Infinity;
      let closestIndex = 0;

      meshes.forEach((mesh) => {
        const { offset } = mesh.userData;
        let y = -(offset - wrap(scrollPosition, loopLength));
        y = wrap(y + halfLoop, loopLength) - halfLoop;
        mesh.position.y = y;

        if (Math.abs(y) < closestDistance) {
          closestDistance = Math.abs(y);
          closestIndex = mesh.userData.index;
        }

        if (Math.abs(y) < halfLoop + config.maxHeight) {
          applyDistortion(
            mesh,
            y,
            config.distortionStrength * signedDistortion,
          );
        }
      });

      if (closestIndex !== activeSlideIndex) {
        activeSlideIndex = closestIndex;
        titleElement.textContent = slides[activeSlideIndex].name;
        counterElement.textContent = zeroPad(activeSlideIndex + 1);
      }

      renderer.render(scene, camera);
    }

    animate(0);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="slider01">
      <div className="slider01-info">
        <p id="slider01-title">Slide Name</p>
        <p id="slider01-count">00</p>
      </div>
      <canvas id="canvas" className="slider01-canvas"></canvas>
    </div>
  );
}
