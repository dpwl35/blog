'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';

gsap.registerPlugin(Flip);

const playlist = [
  { id: 'LQjGf9rN5W0', title: 'Jazz et thé vert', artist: 'Souleance' },
];

const arrangements: Record<string, any> = {
  notebook: {
    items: [
      { id: 'flip-pen', x: 50, y: 50, rotation: -16, scale: 1 },
      { id: 'flip-diary', x: 49, y: 52, rotation: -10, scale: 1 },
      { id: 'flip-phone', x: 80, y: 60, rotation: 5, scale: 1 },
      { id: 'flip-newspaper', x: 15, y: 28, rotation: -3, scale: 1 },
      { id: 'flip-cd', x: 12, y: 70, rotation: -3, scale: 1 },
    ],
  },
  cleanup: {
    items: [
      { id: 'flip-pen', x: 50, y: 10, rotation: 91, scale: 1 },
      { id: 'flip-diary', x: 40, y: 52, rotation: 1, scale: 0.9 },
      { id: 'flip-phone', x: 80, y: 50, rotation: 0, scale: 0.9 },
      { id: 'flip-newspaper', x: 85, y: 50, rotation: 0, scale: 1 },
      { id: 'flip-cd', x: 85, y: 50, rotation: 0, scale: 0.7 },
    ],
  },
};

export default function MainEvent() {
  const deskRef = useRef<HTMLDivElement>(null);
  const activeModeRef = useRef('notebook');
  const playerRef = useRef<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [now, setNow] = useState<Date | null>(null);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const togglePlay = () => {
    if (isPlaying) {
      playerRef.current?.pauseVideo();
    } else {
      playerRef.current?.playVideo();
    }
  };

  const setLayout = (mode: string) => {
    const desk = deskRef.current;
    if (!desk) return;

    const deskWidth = desk.offsetWidth;
    const deskHeight = desk.offsetHeight;
    const config = arrangements[mode];

    config.items.forEach((itemData: any) => {
      const itemEl = document.getElementById(itemData.id);
      if (!itemEl) return;

      const pixelX = (itemData.x / 100) * deskWidth - itemEl.offsetWidth / 2;
      const pixelY = (itemData.y / 100) * deskHeight - itemEl.offsetHeight / 2;

      gsap.set(itemEl, {
        left: pixelX,
        top: pixelY,
        rotation: itemData.rotation,
        scale: itemData.scale ?? 1,
      });
    });
  };

  const switchMode = (newMode: string) => {
    if (newMode === activeModeRef.current) return;

    const desk = deskRef.current;
    if (!desk) return;

    const flipTargets = Array.from(desk.querySelectorAll('.main-flip-item'));
    const state = Flip.getState(flipTargets);

    setLayout(newMode);

    Flip.from(state, {
      duration: 1.25,
      ease: 'power3.inOut',
      stagger: { from: 'center', amount: 0.2 },
      absolute: true,
      scale: true,
    });

    activeModeRef.current = newMode;
  };

  useEffect(() => {
    const items = document.querySelectorAll('.main-flip-item');
    gsap.set(items, { opacity: 0 });

    setLayout('notebook');

    requestAnimationFrame(() => {
      gsap.to(items, {
        opacity: 1,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
      });
    });

    const handleResize = () => setLayout(activeModeRef.current);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);

    (window as any).onYouTubeIframeAPIReady = () => {
      playerRef.current = new (window as any).YT.Player('yt-player', {
        videoId: playlist[0].id,
        playerVars: { controls: 0, autoplay: 0 },
        events: {
          onReady: (e: any) => setDuration(e.target.getDuration()),
          onStateChange: (e: any) => setIsPlaying(e.data === 1),
        },
      });
    };

    const timer = setInterval(() => {
      if (playerRef.current?.getCurrentTime) {
        setCurrentTime(playerRef.current.getCurrentTime());
      }
    }, 500);

    return () => clearInterval(timer);
  }, []);

  const date =
    now?.toLocaleDateString('ko-KR', {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    }) ?? '';

  const time =
    now
      ?.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
      .replace('오전 ', '')
      .replace('오후 ', '') ?? '';

  return (
    <div className='main-flip' ref={deskRef}>
      <div className='main-flip-modes'>
        <button onClick={() => switchMode('notebook')}>Notebook</button>
        <button onClick={() => switchMode('cleanup')}>Cleanup</button>
      </div>
      <div className='main-flip-item newspaper' id='flip-newspaper'>
        <img src='/images/main/newspaper.png' alt='newspaper' />
      </div>
      <div className='main-flip-item pen' id='flip-pen'>
        <img src='/images/main/pen.png' alt='pen' />
      </div>
      <div className='main-flip-item diary' id='flip-diary'>
        <img src='/images/main/diary.png' alt='diary' />
      </div>
      <div className='main-flip-item phone' id='flip-phone'>
        <div>
          <div className='phone-area'>
            <div className='phone-area-view'>
              <div className='phone-area-time'>
                <span>{date}</span>
                <span>{time}</span>
              </div>
              <ul className='phone-area-todo'>
                <li>
                  <label>
                    <input type='checkbox' />
                    <span>트렌드 리서치</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type='checkbox' />
                    <span>레퍼런스 수집</span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type='checkbox' defaultChecked />
                    <span>블로그 포스트 작성</span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
          <img src='/images/main/phone.png' alt='phone' />
        </div>
      </div>
      <div className='main-flip-item cd' id='flip-cd'>
        <img src='/images/main/cd.png' alt='cd' />
      </div>
      <div className='main-player' id='flip-player'>
        <div id='yt-player' style={{ display: 'none' }} />
        <p className='main-player-artist'>{playlist[0].artist}</p>
        <p className='main-player-title'>{playlist[0].title}</p>
        <div className='main-player-bar'>
          <div
            className='main-player-fill'
            style={{
              width: `${duration ? (currentTime / duration) * 100 : 0}%`,
            }}
          />
        </div>
        <div className='main-player-time'>
          <span>{formatTime(currentTime)}</span>/
          <span>{formatTime(duration)}</span>
        </div>
        <button className='main-player-btn' onClick={togglePlay}>
          {isPlaying ? '⏸' : '▶'}
        </button>
      </div>
    </div>
  );
}
