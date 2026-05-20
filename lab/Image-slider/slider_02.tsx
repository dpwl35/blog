"use client";

import { useEffect } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import gsap from "gsap";

import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import postVertexShader from "./shaders/postprocessing/vertex.glsl";
import postFragmentShader from "./shaders/postprocessing/fragment.glsl";

const contents = [
  {
    id: 1,
    category: "MATERIAL",
    title: "Form and Light",
    mainText:
      "There is a quiet conversation between form and light that happens when we stop to look closely. Shapes that seem simple at first reveal layers of depth, color, and intention. These are not accidents — they are the result of careful observation and deliberate craft.",
    subText:
      "Color does not exist in isolation. It breathes, shifts, and responds to everything around it — a dialogue between surface and source.",
    image:
      "https://cdn.cosmos.so/b8119159-58e1-4224-a09e-d0329cf3269a?format=jpeg",
    reverse: false,
  },
  {
    id: 2,
    category: "TEXTURE",
    title: "Surface Stories",
    mainText:
      "Every surface holds a memory. The way light falls across a material tells us something about how it was made, where it has been, and what it has endured. To look closely at texture is to read a language older than words.",
    subText:
      "What the eye perceives as simple is rarely so. Beneath every surface lies a history of pressure, time, and transformation.",
    image:
      "https://cdn.cosmos.so/57cb4ac4-0100-40af-ac5c-6842cd1e7a12?format=jpeg",
    reverse: true,
  },
  {
    id: 3,
    category: "VISION",
    title: "Beyond the Visible",
    mainText:
      "Art asks us to look beyond what is immediately visible — to find meaning in abstraction, emotion in geometry, and narrative in color. It does not demand understanding. It only asks for presence, curiosity, and a willingness to be moved.",
    subText:
      "The most honest images are those that resist easy explanation. They ask questions rather than provide answers.",
    image:
      "https://cdn.cosmos.so/825ab382-7ac0-4e55-8a64-af98927e6979?format=jpeg",
    reverse: false,
  },
];

export default function Slider02() {
  useEffect(() => {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    const composer = new EffectComposer(renderer);

    const canvasSize = { width: window.innerWidth, height: window.innerHeight };
    const raycaster = new THREE.Raycaster();
    const clock = new THREE.Clock();
    const textureLoader = new THREE.TextureLoader();
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasSize.width / canvasSize.height,
      0.1,
      100,
    );
    camera.position.set(0, 0, 50);
    camera.fov = Math.atan(canvasSize.height / 2 / 50) * (180 / Math.PI) * 2;

    let imageRepository: { img: HTMLImageElement; mesh: THREE.Mesh }[] = [];
    let animationId = 0;
    let targetScrollY = 0;
    let currentScrollY = 0;

    const loadImages = async () => {
      const images = Array.from(
        document.querySelectorAll<HTMLImageElement>(".slider02-content img"),
      );
      const fetchImages = images.map(
        (image) =>
          new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.src = image.src;
            img.onload = () => resolve(image);
            img.onerror = reject;
          }),
      );
      return await Promise.all(fetchImages);
    };

    const createImages = (images: HTMLImageElement[]) => {
      const material = new THREE.ShaderMaterial({
        uniforms: {
          uTexture: { value: null },
          uTime: { value: 0 },
          uHover: { value: 0 },
          uHoverX: { value: 0.5 },
          uHoverY: { value: 0.5 },
        },
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
      });

      return images.map((image) => {
        const { width, height } = image.getBoundingClientRect();
        const clonedMaterial = material.clone();
        clonedMaterial.uniforms.uTexture.value = textureLoader.load(image.src);
        const geometry = new THREE.PlaneGeometry(width, height, 16, 16);
        const mesh = new THREE.Mesh(geometry, clonedMaterial);
        imageRepository.push({ img: image, mesh });
        return mesh;
      });
    };

    const create = async () => {
      const loadedImages = await loadImages();
      const images = createImages(loadedImages);
      scene.add(...images);
    };

    const resize = () => {
      canvasSize.width = window.innerWidth;
      canvasSize.height = window.innerHeight;
      camera.aspect = canvasSize.width / canvasSize.height;
      camera.fov = Math.atan(canvasSize.height / 2 / 50) * (180 / Math.PI) * 2;
      camera.updateProjectionMatrix();
      composer.setSize(canvasSize.width, canvasSize.height);
      renderer.setSize(canvasSize.width, canvasSize.height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    const retransform = () => {
      imageRepository.forEach(({ img, mesh }) => {
        const { width, height, top, left } = img.getBoundingClientRect();
        const { width: originWidth } = (mesh.geometry as THREE.PlaneGeometry)
          .parameters;
        const scale = width / originWidth;
        mesh.scale.x = scale;
        mesh.scale.y = scale;
        mesh.position.y = canvasSize.height / 2 - height / 2 - top;
        mesh.position.x = -canvasSize.width / 2 + width / 2 + left;
      });
    };

    const addPostEffects = () => {
      const renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      const customShader = new THREE.ShaderMaterial({
        uniforms: {
          tDiffuse: { value: null },
          uTime: { value: 0 },
          uScrolling: { value: 0 },
        },
        vertexShader: postVertexShader,
        fragmentShader: postFragmentShader,
      });

      const customPass = new ShaderPass(customShader);
      composer.addPass(customPass);
      return { customShader };
    };

    const addEvent = (effects: { customShader: THREE.ShaderMaterial }) => {
      const { customShader } = effects;

      document.body.addEventListener("scroll", () => {
        targetScrollY = document.body.scrollTop;
      });

      window.addEventListener("mousemove", (e: MouseEvent) => {
        const pointer = new THREE.Vector2(
          (e.clientX / canvasSize.width) * 2 - 1,
          -(e.clientY / canvasSize.height) * 2 + 1,
        );
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0) {
          const mesh = intersects[0].object as THREE.Mesh;
          const mat = mesh.material as THREE.ShaderMaterial;
          mat.uniforms.uHoverX.value = intersects[0].uv!.x - 0.5;
          mat.uniforms.uHoverY.value = intersects[0].uv!.y - 0.5;
        }
      });

      window.addEventListener("resize", () => {
        resize();
        retransform();
      });

      imageRepository.forEach(({ img, mesh }) => {
        const mat = mesh.material as THREE.ShaderMaterial;
        img.addEventListener("mouseenter", () => {
          gsap.to(mat.uniforms.uHover, {
            value: 1,
            duration: 0.4,
            ease: "power1.inOut",
          });
        });
        img.addEventListener("mouseout", () => {
          gsap.to(mat.uniforms.uHover, {
            value: 0,
            duration: 0.4,
            ease: "power1.inOut",
          });
        });
      });
    };

    const draw = (effects: { customShader: THREE.ShaderMaterial }) => {
      const { customShader } = effects;

      // 매 프레임 currentScrollY가 targetScrollY를 따라감
      currentScrollY += (targetScrollY - currentScrollY) * 0.1;
      const speed = Math.abs(targetScrollY - currentScrollY);

      if (speed > 1) {
        gsap.to(customShader.uniforms.uScrolling, { value: 1, duration: 0.5 });
      } else {
        gsap.to(customShader.uniforms.uScrolling, { value: 0, duration: 0.5 });
      }

      composer.render();
      retransform();

      const elapsed = clock.getElapsedTime();
      customShader.uniforms.uTime.value = elapsed;
      imageRepository.forEach(({ mesh }) => {
        (mesh.material as THREE.ShaderMaterial).uniforms.uTime.value = elapsed;
      });

      animationId = requestAnimationFrame(() => draw(effects));
    };

    const initialize = async () => {
      const container = document.querySelector("#slider02-container");
      if (!container) return;
      container.appendChild(renderer.domElement);
      await create();
      const effects = addPostEffects();
      addEvent(effects);
      resize();
      draw(effects);
    };

    initialize();

    return () => {
      window.cancelAnimationFrame(animationId);
      renderer.dispose();
      const container = document.querySelector("#slider02-container");
      if (container) container.innerHTML = "";
    };
  }, []);

  return (
    <div id="swup" className="transition-fade">
      <div>
        <div className="slider02">
          <div className="slider02-wrap">
            <div className="slider02-hero">
              <p>SCROLL DOWN</p>
              <p>
                Built with Three.js, GLSL shaders, scroll interaction and image
                hover distortion.
              </p>
            </div>

            {contents.map((item) => (
              <section key={item.id} className="slider02-content">
                {!item.reverse && (
                  <div className="slider02-content-img">
                    <img src={item.image} alt={item.title} />
                  </div>
                )}
                <div className="slider02-description">
                  <p>{item.category}</p>
                  <h2>{item.title}</h2>
                  <p className="main-text">{item.mainText}</p>
                  <p className="sub-text">{item.subText}</p>
                </div>
                {item.reverse && (
                  <div className="slider02-content-img">
                    <img src={item.image} alt={item.title} />
                  </div>
                )}
              </section>
            ))}
          </div>

          <footer className="slider02-footer">
            <p>Fancy Gallery is creative and interactive Gallery</p>
          </footer>
        </div>
      </div>
      <div id="slider02-container"></div>
    </div>
  );
}
