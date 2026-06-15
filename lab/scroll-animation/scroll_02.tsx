'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// const images = [
//   'https://images.unsplash.com/photo-1756999547323-3dbb49e3dbf7?w=800',
//   'https://images.unsplash.com/photo-1752509929361-4471bdb102cf?w=800',
//   'https://plus.unsplash.com/premium_photo-1675506444720-9f2bb1cd4a07?w=800',
//   'https://images.unsplash.com/photo-1697898783638-d1e81c7ebab1?w=800',
//   'https://images.unsplash.com/photo-1714548851157-8187fda8e617?w=800',
// ];

const images = [
  '/images/lab/scroll-animation/01.jfif',
  '/images/lab/scroll-animation/02.jfif',
  '/images/lab/scroll-animation/03.jfif',
  '/images/lab/scroll-animation/04.jfif',
  '/images/lab/scroll-animation/05.jfif',
];

export default function Scroll02() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = containerRef.current!.closest(
      '.tab-content',
    ) as HTMLElement;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      wrapper: wrapper,
      content: containerRef.current!,
    });
    lenis.on('scroll', ScrollTrigger.update);

    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    const dissolveCellSize = 16;
    const dissolveColumns = Math.ceil(wrapper.clientWidth / dissolveCellSize);
    const dissolveRows = Math.ceil(wrapper.clientHeight / dissolveCellSize);
    const dissolveSpreadAbove = 0.25;
    const dissolveSpreadBelow = 0.25;
    const dissolveScatterIntensity = 0.15;
    const dissolveSolidCoreRadius = 0.025;
    const dissolveMinScatterAtCenter = 0.3;
    const dissolveVisibilityThreshold = 0.65;
    const dissolveColor = '#ff6426';
    const dissolveCharacters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYz0123456789#@$%&*+=?!<>{}[]';

    const stackedImages =
      containerRef.current!.querySelectorAll('.spotlight-img');
    const totalImages = stackedImages.length;
    const totalTransitions = totalImages - 1;
    const dissolveGrid = containerRef.current!.querySelector(
      '.dissolve-grid',
    ) as HTMLElement;
    dissolveGrid.style.setProperty('--dissolve-color', dissolveColor);

    stackedImages.forEach((img, i) => {
      (img as HTMLElement).style.zIndex = String(totalImages - i);
    });

    const dissolveFontSize = Math.round(dissolveCellSize * 0.7);

    function getRandomCharacter() {
      return dissolveCharacters[
        Math.floor(Math.random() * dissolveCharacters.length)
      ];
    }

    const dissolveCells: { row: number; col: number; normalizedY: number }[] =
      [];
    const dissolveCellElements: HTMLElement[] = [];

    for (let row = 0; row < dissolveRows; row++) {
      for (let col = 0; col < dissolveColumns; col++) {
        const cell = document.createElement('div');
        cell.className = 'dissolve-cell';
        cell.style.left = `${col * dissolveCellSize}px`;
        cell.style.top = `${row * dissolveCellSize}px`;
        cell.style.width = `${dissolveCellSize}px`;
        cell.style.height = `${dissolveCellSize}px`;
        cell.style.fontSize = `${dissolveFontSize}px`;
        cell.textContent = getRandomCharacter();
        dissolveGrid.appendChild(cell);

        dissolveCellElements.push(cell);
        dissolveCells.push({
          row,
          col,
          normalizedY: (row + 0.5) / dissolveRows,
        });
      }
    }

    function hashFromPosition(row: number, col: number, seed: number) {
      const raw = Math.sin(row * seed + col * (seed * 2.45)) * 43758.5453;
      return raw - Math.floor(raw);
    }

    const cellVisibilityRandom = dissolveCells.map((cell) =>
      hashFromPosition(cell.row, cell.col, 127.1),
    );

    const cellScatterOffset = dissolveCells.map(
      (cell) =>
        (hashFromPosition(cell.row, cell.col, 269.3) - 0.5) *
        dissolveScatterIntensity,
    );

    let activeTransitionIndex = -1;

    function onTransitionChange(newIndex: number) {
      activeTransitionIndex = newIndex;
    }

    function updateImageClipPaths(scrollProgress: number, travelRange: number) {
      for (let i = 0; i < totalTransitions; i++) {
        const segmentStart = i / totalTransitions;
        const segmentEnd = (i + 1) / totalTransitions;

        let segmentProgress =
          (scrollProgress - segmentStart) / (segmentEnd - segmentStart);
        segmentProgress = gsap.utils.clamp(0, 1, segmentProgress);

        const remappedPosition =
          -dissolveSpreadAbove + segmentProgress * travelRange;
        const clipPercent = gsap.utils.clamp(0, 100, remappedPosition * 100);

        (stackedImages[i] as HTMLElement).style.clipPath =
          `polygon(0% ${clipPercent}%, 100% ${clipPercent}%, 100% 100%, 0% 100%)`;
      }
    }

    function updateDissolveBand(bandCenterY: number) {
      for (let i = 0; i < dissolveCells.length; i++) {
        const cell = dissolveCells[i];
        const rawDistance = Math.abs(cell.normalizedY - bandCenterY);

        const scatterStrength = gsap.utils.clamp(
          dissolveMinScatterAtCenter,
          1,
          rawDistance / dissolveSolidCoreRadius,
        );

        const scatteredDistance =
          cell.normalizedY -
          bandCenterY +
          cellScatterOffset[i] * scatterStrength;

        const normalizedDistance =
          scatteredDistance >= 0
            ? scatteredDistance / dissolveSpreadBelow
            : Math.abs(scatteredDistance) / dissolveSpreadAbove;

        if (normalizedDistance >= 1) {
          dissolveCellElements[i].style.visibility = 'hidden';
          continue;
        }

        const density = (1 - normalizedDistance) * (1 - normalizedDistance);

        const isVisible =
          density > cellVisibilityRandom[i] * dissolveVisibilityThreshold;
        dissolveCellElements[i].style.visibility = isVisible
          ? 'visible'
          : 'hidden';
      }
    }

    function hideAllDissolveCells() {
      for (let i = 0; i < dissolveCellElements.length; i++) {
        dissolveCellElements[i].style.visibility = 'hidden';
      }
    }

    const totalTravelRange = 1 + dissolveSpreadAbove + dissolveSpreadBelow;

    ScrollTrigger.create({
      scroller: wrapper,
      trigger: containerRef.current!.querySelector('.spotlight'),
      start: 'top top',
      end: `+=${totalTransitions * wrapper.clientHeight}`,
      pin: true,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => {
        const scrollProgress = self.progress;

        const rawPosition = scrollProgress * totalTransitions;
        const currentTransition = Math.min(
          Math.floor(rawPosition),
          totalTransitions - 1,
        );
        const transitionProgress = gsap.utils.clamp(
          0,
          1,
          rawPosition - currentTransition,
        );

        if (currentTransition !== activeTransitionIndex) {
          onTransitionChange(currentTransition);
        }

        const bandCenterY =
          -dissolveSpreadAbove + transitionProgress * totalTravelRange;

        if (transitionProgress <= 0 || transitionProgress >= 1) {
          hideAllDissolveCells();
          updateImageClipPaths(scrollProgress, totalTravelRange);
          return;
        }

        updateImageClipPaths(scrollProgress, totalTravelRange);
        updateDissolveBand(bandCenterY);
      },
    });

    return () => {
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className='scroll02'>
      <section className='intro'>
        <p>Scroll to reveal the clip-path transition</p>
      </section>

      <section className='spotlight'>
        {images.map((src, index) => (
          <div key={index} className='spotlight-img'>
            <img src={src} alt={`image${index + 1}`} />
          </div>
        ))}
        <div className='dissolve-grid'></div>
      </section>

      <section className='outro'>
        <p>Built with GSAP ScrollTrigger & clip-path</p>
      </section>
    </div>
  );
}
