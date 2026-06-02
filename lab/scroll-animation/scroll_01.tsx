'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const lyrics = [
  'GSAP is a JavaScript animation library ',
  'Used by millions of developers ',
  'Animate anything JavaScript can touch ',
  'CSS properties ',
  'SVG ',
  'Canvas ',
  'WebGL ',
  'Works in every major browser ',
  '60fps animations ',
  'Timeline based sequencing ',
  'ScrollTrigger for scroll animations ',
  'Pin elements while scrolling ',
  'Scrub animations to scroll position ',
  'MotionPath for curved animations ',
  'Flip for layout animations ',
  'SplitText for text animations ',
  'Draggable for drag interactions ',
  'The standard for web animation ',
  'Used by Google Adobe and more ',
  'This page was built with GSAP ',
];

export default function Scroll01() {
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
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.defaults({
      scroller: wrapper,
    });

    const listItem = containerRef.current!.querySelectorAll('.list-item');

    // 가사 on 효과
    ScrollTrigger.create({
      trigger: containerRef.current!.querySelector('.about'),
      start: 'top 70%',
      end: 'bottom 50%',
      scrub: 1,
      onUpdate: (self) => {
        const targetIndex = Math.round(self.progress * (listItem.length - 1));
        const current = containerRef.current!.querySelector('#on');
        if (current) current.removeAttribute('id');
        if (listItem[targetIndex]) listItem[targetIndex].id = 'on';
      },
    });

    // animate-text 클립 애니메이션
    containerRef
      .current!.querySelectorAll('.animate-text')
      .forEach((textElement) => {
        const el = textElement as HTMLElement;
        el.setAttribute('data-text', el.textContent?.trim() || '');

        ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          scrub: 1,
          onUpdate: (self) => {
            const clipValue = Math.max(0, 100 - self.progress * 100);
            el.style.setProperty('--clip-value', `${clipValue}%`);
          },
        });
      });

    // services 슬라이드 인
    ScrollTrigger.create({
      trigger: containerRef.current!.querySelector('.services'),
      start: 'top bottom',
      end: 'top top',
      scrub: 1,
      onUpdate: (self) => {
        const headers =
          containerRef.current!.querySelectorAll('.services-header');
        gsap.set(headers[0], { x: `${100 - self.progress * 100}%` });
        gsap.set(headers[1], { x: `${-100 + self.progress * 100}%` });
        gsap.set(headers[2], { x: `${100 - self.progress * 100}%` });
      },
    });

    // services 핀 + Y이동 + 축소
    ScrollTrigger.create({
      trigger: containerRef.current!.querySelector('.services'),
      start: 'top top',
      end: `+=${window.innerHeight * 2}`,
      pin: true,
      scrub: 1,
      pinSpacing: false,
      onUpdate: (self) => {
        const headers =
          containerRef.current!.querySelectorAll('.services-header');

        if (self.progress <= 0.5) {
          const yProgress = self.progress / 0.5;
          gsap.set(headers[0], { y: `${yProgress * 100}%` });
          gsap.set(headers[2], { y: `${yProgress * -100}%` });
        } else {
          gsap.set(headers[0], { y: '100%' });
          gsap.set(headers[2], { y: '-100%' });

          const scaleProgress = (self.progress - 0.5) / 0.5;
          const minScale = window.innerWidth <= 1000 ? 0.3 : 0.1;
          const scale = 1 - scaleProgress * (1 - minScale);

          headers.forEach((header) => gsap.set(header, { scale }));
        }
      },
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.defaults({ scroller: window });
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className='scroll01'>
      <section className='hero'>
        <div className='hero-img'>
          <img
            src='https://cdn.cosmos.so/27003141-eef9-47ac-b150-392dcd4b4375?format=webp'
            alt='hero filler'
          />
        </div>
      </section>

      <section className='about'>
        <ul id='list-item-wrapper'>
          {lyrics.map((lyric, index) => (
            <li key={index} className='list-item'>
              {lyric}
            </li>
          ))}
        </ul>
      </section>

      <section className='services'>
        <div className='services-header'>
          <img
            src='https://cdn.cosmos.so/a31f0363-e091-4165-83ca-992f0d98113e?format=webp'
            alt='services'
          />
        </div>
        <div className='services-header'>
          <img
            src='https://cdn.cosmos.so/a31f0363-e091-4165-83ca-992f0d98113e?format=webp'
            alt='services'
          />
        </div>
        <div className='services-header'>
          <img
            src='https://cdn.cosmos.so/a31f0363-e091-4165-83ca-992f0d98113e?format=webp'
            alt='services'
          />
        </div>
      </section>

      <section className='services-copy'>
        <h1 className='animate-text'>
          Our deep understanding of interaction design drives meaningful
          engagement. Our deep understanding of interaction design drives
          meaningful engagement.
        </h1>
      </section>

      <section className='outro'>
        <div className='outro-img'>
          <img
            src='https://cdn.cosmos.so/3b55d9ed-92fb-4390-a972-fe96980638ee?format=webp'
            alt='outro filler'
          />
        </div>
      </section>
    </div>
  );
}
