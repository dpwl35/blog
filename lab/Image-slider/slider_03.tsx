import './style.scss';
import * as THREE from 'three';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { useEffect, useRef } from 'react';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D uTexCurrent;
  uniform sampler2D uTexNext;
  uniform float uProgress;
  uniform vec2 uResolution;
  uniform vec2 uImageRes;
  uniform float uWaveFreq;
  uniform float uWavePow;
  uniform float uWaveWidth;
  uniform float uFalloff;
  uniform float uBoostStrength;
  uniform float uCrossfadeWidth;
  uniform float uMobile;

  varying vec2 vUv;

  vec2 getImageUv(vec2 uv, vec2 screenRes, vec2 imgRes, vec2 boxMin, vec2 boxMax) {
    vec2 boxUv = (uv - boxMin) / (boxMax - boxMin);
    vec2 boxSize = (boxMax - boxMin) * screenRes;
    float boxAspect = boxSize.x / boxSize.y;
    float imgAspect = imgRes.x / imgRes.y;
    vec2 scale = vec2(1.0);
    if (boxAspect > imgAspect) {
      scale.y = imgAspect / boxAspect;
    } else {
      scale.x = boxAspect / imgAspect;
    }
    return (boxUv - 0.5) * scale + 0.5;
  }

  bool isInsideBox(vec2 uv, vec2 boxMin, vec2 boxMax) {
    return uv.x >= boxMin.x && uv.x <= boxMax.x && uv.y >= boxMin.y && uv.y <= boxMax.y;
  }

  void main() {
    vec2 boxMin = mix(vec2(0.25, 0.175), vec2(0.0), uMobile);
    vec2 boxMax = mix(vec2(0.75, 0.825), vec2(1.0), uMobile);
    float aspectRatio = uResolution.y / uResolution.x;
    vec2 coord = vec2(vUv.x, vUv.y * aspectRatio);
    vec2 center = vec2(0.5, 0.5 * aspectRatio);
    float dist = distance(coord, center);
    float time = uProgress;
    vec2 displaced = coord;
    float brightness = 0.0;
    float blend = 0.0;
    if (time > 0.001) {
      float trailing = dist - time;
      if (trailing < uWaveWidth && trailing < 0.0) {
        float age = -trailing;
        float decay = exp(-age * uFalloff);
        float wave = sin(age * uWaveFreq) * decay;
        vec2 direction = normalize(coord - center);
        displaced += direction * wave * uWavePow;
        brightness = abs(wave) * uBoostStrength * decay;
      }
      blend = smoothstep(0.0, uCrossfadeWidth, -trailing);
    }
    vec2 finalUv = vec2(displaced.x, displaced.y / aspectRatio);
    vec2 imageUv = getImageUv(finalUv, uResolution, uImageRes, boxMin, boxMax);
    vec4 currentColor = texture2D(uTexCurrent, imageUv);
    vec4 nextColor = texture2D(uTexNext, imageUv);
    vec4 color = mix(currentColor, nextColor, blend);
    color.rgb += color.rgb * brightness;
    if (!isInsideBox(finalUv, boxMin, boxMax)) {
      color = vec4(0.0);
    }
    gl_FragColor = color;
  }
`;

const slides = [
  {
    title: '@pam_ebola',
    description:
      'Scattered blueprints and tangled wire sketches rest inside a worn red folder, quietly documenting the slow process of turning raw nature into sculptural form.',
    image:
      'https://cdn.cosmos.so/f0082070-a77f-4512-8df4-55cf9e6939d6?format=jpeg',
  },
  {
    title: '@desescribir',
    description:
      'Six zines spread across grey, each speaking a different visual language.',
    image:
      'https://cdn.cosmos.so/eb5f87be-704b-4608-b048-9220dd696443?format=jpeg',
  },
  {
    title: '@revuefaire',
    description:
      'A densely layered editorial spread pairs black and white exhibition photographs with typeset text, while a signed letter from Julien Tavelli rests quietly on the opposing page.',
    image:
      'https://cdn.cosmos.so/6c784b55-ba3c-45fa-99e8-5552f631ee43?format=jpeg',
  },
  {
    title: 'studiofeixen',
    description:
      'Scattered thumbnail photographs fill both pages — everyday objects on the left, dark skies and empty garages on the right.',
    image:
      'https://cdn.cosmos.so/479284a3-7b26-4f7c-8b5d-32d9592d3942?format=jpeg',
  },
  {
    title: 'URL signature expired',
    description:
      'A dense Dutch editorial spread layers columns of text with geometric grid patterns and a deep blue footer, holding the quiet complexity of an independent art journal.',
    image:
      'https://cdn.cosmos.so/9bdeaccd-16c7-4d58-9889-9102b120bf2f?format=jpeg',
  },
];

const rippleConfig = {
  waveFreq: 25.0,
  wavePow: 0.035,
  waveWidth: 0.5,
  falloff: 10.0,
  boostStrength: 0.5,
  crossfadeWidth: 0.05,
  duration: 3.0,
  endValue: 1.0,
  ease: 'power2.out',
};

function initThree(slider: HTMLElement, textures: THREE.Texture[]) {
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.01, 10);
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  slider.prepend(renderer.domElement);

  const uniforms = {
    uTexCurrent: { value: textures[0] },
    uTexNext: { value: textures[1] },
    uProgress: { value: 0.0 },
    uResolution: { value: new THREE.Vector2() },
    uImageRes: { value: new THREE.Vector2(1920, 1280) },
    uWaveFreq: { value: rippleConfig.waveFreq },
    uWavePow: { value: rippleConfig.wavePow },
    uWaveWidth: { value: rippleConfig.waveWidth },
    uFalloff: { value: rippleConfig.falloff },
    uBoostStrength: { value: rippleConfig.boostStrength },
    uCrossfadeWidth: { value: rippleConfig.crossfadeWidth },
    uMobile: { value: window.innerWidth <= 1000 ? 1.0 : 0.0 },
  };

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
  });
  const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
  scene.add(plane);

  return { scene, camera, renderer, uniforms };
}

async function loadTextures(slideList: { image: string }[]) {
  const loader = new THREE.TextureLoader();

  const textures = await Promise.all(
    slideList.map(
      (slide) =>
        new Promise<THREE.Texture>((resolve) =>
          loader.load(slide.image, resolve),
        ),
    ),
  );

  textures.forEach((texture) => {
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  });

  return textures;
}

function splitTitle(container: Element) {
  const el = container.querySelector('.slider03-title p');
  if (!el) return null;
  return SplitText.create(el, {
    type: 'words, chars',
    mask: 'chars',
    wordsClass: 'word',
    charsClass: 'char',
  });
}

function splitDescription(container: Element) {
  const paragraphs = container.querySelectorAll('.slider03-description p');
  const allLines: Element[] = [];
  paragraphs.forEach((p) => {
    const split = SplitText.create(p, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'line',
    });
    allLines.push(...split.lines);
  });
  return allLines;
}

function buildSlideContent(slide: (typeof slides)[0]) {
  const el = document.createElement('div');
  el.className = 'slider03-content';
  el.style.opacity = '0';
  el.innerHTML = `
    <div class="slider03-title"><p>${slide.title}</p></div>
    <div class="slider03-description"><p>${slide.description}</p></div>
  `;
  return el;
}

function animateTextOut(container: Element) {
  const titleSplit = splitTitle(container);
  const lines = splitDescription(container);
  const tl = gsap.timeline();
  if (titleSplit) {
    tl.to(titleSplit.chars, {
      y: '-100%',
      duration: 0.6,
      stagger: 0.02,
      ease: 'power2.inOut',
    });
  }
  tl.to(
    lines,
    { y: '-100%', duration: 0.6, stagger: 0.02, ease: 'power2.inOut' },
    0.1,
  );
  return tl;
}

function animateTextIn(container: Element) {
  const titleSplit = splitTitle(container);
  const lines = splitDescription(container);
  const chars = titleSplit ? titleSplit.chars : [];
  gsap.set([chars, lines], { y: '100%' });
  gsap.set(container, { opacity: 1 });
  return gsap
    .timeline()
    .to(chars, { y: '0%', duration: 0.5, stagger: 0.02, ease: 'power2.inOut' })
    .to(
      lines,
      { y: '0%', duration: 0.5, stagger: 0.05, ease: 'power2.out' },
      0.1,
    );
}

export default function Slider03() {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(SplitText);
    const slider = sliderRef.current;
    if (!slider) return;

    let currentIndex = 0;
    let isTransitioning = false;
    let rippleTween: gsap.core.Tween | null = null;

    async function init() {
      const textures = await loadTextures(slides);
      const { scene, camera, renderer, uniforms } = initThree(
        slider!,
        textures,
      );

      function getMaxCornerDist() {
        const ratio = window.innerHeight / window.innerWidth;
        return Math.sqrt(0.25 + 0.25 * ratio * ratio);
      }

      function handleResize() {
        const width = slider!.clientWidth;
        const height = slider!.clientHeight;
        renderer.setSize(width, height);
        uniforms.uResolution.value.set(width, height);
        uniforms.uMobile.value = window.innerWidth <= 1000 ? 1.0 : 0.0;
        rippleConfig.endValue = getMaxCornerDist() + rippleConfig.waveWidth;
        rippleConfig.duration = window.innerWidth <= 1000 ? 1.5 : 3.0;
      }

      window.addEventListener('resize', handleResize);
      handleResize();

      const initialSlide = slider!.querySelector('.slider03-content');
      if (initialSlide) {
        const initialTitle = splitTitle(initialSlide);
        const initialLines = splitDescription(initialSlide);
        if (initialTitle) {
          gsap.fromTo(
            initialTitle.chars,
            { y: '100%' },
            { y: '0%', duration: 0.8, stagger: 0.025, ease: 'power2.out' },
          );
        }
        gsap.fromTo(
          initialLines,
          { y: '100%' },
          {
            y: '0%',
            duration: 0.8,
            stagger: 0.025,
            ease: 'power2.out',
            delay: 0.2,
          },
        );
      }

      function transition() {
        if (isTransitioning) return;
        isTransitioning = true;

        if (rippleTween) {
          rippleTween.kill();
          uniforms.uProgress.value = 0.0;
          rippleTween = null;
        }

        const nextIndex = (currentIndex + 1) % slides.length;
        const currentSlide = slider!.querySelector('.slider03-content');
        if (!currentSlide) return;

        uniforms.uTexCurrent.value = textures[currentIndex];
        uniforms.uTexNext.value = textures[nextIndex];
        uniforms.uProgress.value = 0.0;

        let clickUnlocked = false;

        rippleTween = gsap.to(uniforms.uProgress, {
          value: rippleConfig.endValue,
          duration: rippleConfig.duration,
          ease: rippleConfig.ease,
          delay: 0.3,
          onUpdate() {
            if (!clickUnlocked && uniforms.uProgress.value > 0.7) {
              clickUnlocked = true;
              currentIndex = nextIndex;
              isTransitioning = false;
            }
          },
          onComplete() {
            uniforms.uTexCurrent.value = textures[currentIndex];
            uniforms.uProgress.value = 0.0;
            rippleTween = null;
            if (!clickUnlocked) {
              currentIndex = nextIndex;
              isTransitioning = false;
            }
          },
        });

        const exitTimeline = animateTextOut(currentSlide);
        exitTimeline.eventCallback('onComplete', () => {
          slider!
            .querySelectorAll('.slider03-content')
            .forEach((el) => el.remove());
          const nextSlide = buildSlideContent(slides[nextIndex]);
          slider!.appendChild(nextSlide);
          requestAnimationFrame(() => animateTextIn(nextSlide));
        });
      }

      slider!.addEventListener('click', transition);

      function render() {
        renderer.render(scene, camera);
        requestAnimationFrame(render);
      }
      render();

      return () => {
        window.removeEventListener('resize', handleResize);
        slider!.removeEventListener('click', transition);
        renderer.dispose();
      };
    }

    init();
  }, []);

  return (
    <div className='slider03' ref={sliderRef}>
      <div className='slider03-content'>
        <div className='slider03-title'>
          <p>Blackwater '91</p>
        </div>
        <div className='slider03-description'>
          <p>
            A densely layered editorial spread pairs black and white exhibition
            photographs with typeset text, while a signed letter from Julien
            Tavelli rests quietly on the opposing page.
          </p>
        </div>
      </div>
    </div>
  );
}
