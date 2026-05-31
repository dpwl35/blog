'use client';

import { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

type Heading = {
  depth: number;
  text: string;
  id: string;
};

type TocProps = {
  headings: Heading[];
  title: string;
};

export function Toc({ headings, title }: TocProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [progress, setProgress] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const isOpenRef = useRef(true);
  const isVisibleRef = useRef(false);

  const toggle = () => {
    const list = listRef.current;
    if (!list) return;

    gsap.to(navRef.current, {
      scale: 0.98,
      duration: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(navRef.current, {
          scale: 1,
          duration: 0.1,
          ease: 'power2.out',
        });
      },
    });

    if (isOpenRef.current) {
      gsap.to(list, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
      gsap.to(arrowRef.current, {
        rotate: 180,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    } else {
      gsap.to(list, {
        height: 'auto',
        opacity: 1,
        duration: 0.3,
        ease: 'power2.inOut',
      });
      gsap.to(arrowRef.current, {
        rotate: 0,
        duration: 0.3,
        ease: 'power2.inOut',
      });
    }

    isOpenRef.current = !isOpenRef.current;
    setIsOpen(!isOpen);
  };

  // 스크롤 진행도
  useEffect(() => {
    gsap.set(navRef.current, { opacity: 0, y: -20 });

    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(p);
      if (scrollTop <= 200) {
        if (isVisibleRef.current) {
          isVisibleRef.current = false;

          if (isOpenRef.current) {
            gsap.to(listRef.current, {
              height: 0,
              opacity: 0,
              duration: 0.3,
              ease: 'power2.inOut',
            });
            gsap.to(arrowRef.current, {
              rotate: 180,
              duration: 0.3,
              ease: 'power2.inOut',
            });
            isOpenRef.current = false;
            setIsOpen(false);

            gsap.to(navRef.current, {
              opacity: 0,
              y: -20,
              duration: 0.3,
              ease: 'power2.inOut',
              delay: 0.4,
            });
          } else {
            gsap.to(navRef.current, {
              opacity: 0,
              y: -20,
              duration: 0.3,
              delay: 0.2,
              ease: 'power2.inOut',
            });
          }
        }
      } else if (scrollTop > 200) {
        if (!isVisibleRef.current) {
          isVisibleRef.current = true;

          gsap.set(listRef.current, { height: 0, opacity: 0 });
          gsap.set(arrowRef.current, { rotate: 180 });
          isOpenRef.current = false;
          setIsOpen(false);

          gsap.to(navRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
          });
        }
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const circumference = 2 * Math.PI * 8;

  return (
    <nav ref={navRef} className='toc' style={{ opacity: 0 }}>
      <div className='toc-wrap'>
        <div className='toc-title' onClick={toggle}>
          <div className='toc-title-icon'>
            <svg
              width='20'
              height='20'
              viewBox='0 0 20 20'
              style={{ transform: 'rotate(-90deg)' }}
            >
              <circle
                className='toc-background-circle'
                cx='10'
                cy='10'
                r='8'
                strokeWidth='2'
                stroke='blue'
                fill='none'
                strokeLinecap='round'
              />
              <circle
                className='toc-progress-circle'
                cx='10'
                cy='10'
                r='8'
                strokeWidth='2'
                fill='none'
                strokeLinecap='round'
                strokeDasharray={`${progress * circumference} ${circumference}`}
              />
            </svg>
          </div>
          <p className='toc-title-text'>{title}</p>
          <div className='toc-title-icon'>
            <svg
              ref={arrowRef}
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              style={{ marginLeft: 'auto', flexShrink: 0 }}
            >
              <path d='M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9' />
            </svg>
          </div>
        </div>
        <div ref={listRef} className='toc-container'>
          <ul className='toc-container-area'>
            {headings.map(({ depth, text, id }) => (
              <li key={id} className='toc-list'>
                <a href={`#${id}`} className='toc-link' data-depth={depth}>
                  {text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
