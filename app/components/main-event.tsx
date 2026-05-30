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
      { id: 'flip-diary', x: 55, y: 52, rotation: -10, scale: 1 },
      { id: 'flip-phone', x: 85, y: 60, rotation: 5, scale: 1 },
      { id: 'flip-newspaper', x: 15, y: 28, rotation: -3, scale: 1 },
      { id: 'flip-cd', x: 12, y: 70, rotation: -3, scale: 1 },
      { id: 'flip-player', x: 8, y: 35, rotation: 0, scale: 1 },
    ],
  },
  cleanup: {
    items: [
      { id: 'flip-pen', x: 58, y: 15, rotation: 91, scale: 1 },
      { id: 'flip-diary', x: 55, y: 52, rotation: 1, scale: 0.8 },
      { id: 'flip-phone', x: 90, y: 56, rotation: 0, scale: 0.8 },
      { id: 'flip-newspaper', x: 85, y: 50, rotation: 0, scale: 1 },
      { id: 'flip-cd', x: 15, y: 60, rotation: 0, scale: 0.9 },
      { id: 'flip-player', x: 15, y: 28, rotation: 0, scale: 1 },
    ],
  },
};

export default function MainEvent() {
  const deskRef = useRef<HTMLDivElement>(null);
  const activeModeRef = useRef('notebook');
  const playerRef = useRef<any>(null);
  const cdRef = useRef<HTMLDivElement>(null);
  const cdRotationRef = useRef(0);
  const cdAnimRef = useRef<gsap.core.Tween | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [now, setNow] = useState<Date | null>(null);
  const [playerVisible, setPlayerVisible] = useState(false);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);
  const [phoneOn, setPhoneOn] = useState(false);
  const phoneSoundRef = useRef<HTMLAudioElement | null>(null);

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    clickSoundRef.current = new Audio('/images/main/click.mp3');
  }, []);

  useEffect(() => {
    phoneSoundRef.current = new Audio('/images/main/lock-unlock.mp3');
  }, []);

  const togglePlay = () => {
    clickSoundRef.current?.play();

    if (!playerVisible) {
      setPlayerVisible(true);
      gsap.fromTo(
        '#flip-player',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' },
      );
      playerRef.current?.playVideo();
      if (!cdAnimRef.current) {
        cdAnimRef.current = gsap.to(cdRef.current, {
          rotation: '+=360',
          duration: 4,
          ease: 'none',
          repeat: -1,
        });
      } else {
        cdAnimRef.current.resume();
      }
      return;
    }

    if (isPlaying) {
      playerRef.current?.pauseVideo();
      cdAnimRef.current?.pause();
      gsap.to('#flip-player', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.in',
      });
      setTimeout(() => setPlayerVisible(false), 300);
    } else {
      playerRef.current?.playVideo();
      cdAnimRef.current?.resume();
      gsap.to('#flip-player', { opacity: 1, duration: 0.5 });
    }
  };

  const setLayout = (mode: string) => {
    const desk = deskRef.current;
    if (!desk) return;

    const deskWidth = desk.offsetWidth;
    const deskHeight = desk.offsetHeight;
    const config = arrangements[mode];
    if (!config) return;

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
      const nonPlayerItems = document.querySelectorAll(
        '.main-flip-item:not(#flip-player)',
      );
      gsap.to(nonPlayerItems, {
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
          onStateChange: (e: any) => {
            const playing = e.data === 1;
            setIsPlaying(playing);
            if (playing) {
              cdAnimRef.current?.resume();
            } else {
              cdAnimRef.current?.pause();
            }
          },
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
      <div className='main-flip-item pen' id='flip-pen'>
        <img src='/images/main/pen.png' alt='pen' />
      </div>
      <div className='main-flip-item diary' id='flip-diary'>
        <img src='/images/main/diary.png' alt='diary' />
      </div>
      <div
        className='main-flip-item phone'
        id='flip-phone'
        onClick={() => {
          phoneSoundRef.current?.play();
          setPhoneOn((prev) => !prev);
        }}
      >
        <div>
          <div className='phone-area'>
            <div className={`phone-area-view ${phoneOn ? 'on' : ''}`}>
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
      <div
        className='main-flip-item cd'
        id='flip-cd'
        ref={cdRef}
        onClick={togglePlay}
      >
        <img src='/images/main/cd.png' alt='cd' />
      </div>
      <div
        className='main-flip-item main-player'
        id='flip-player'
        style={{
          opacity: playerVisible ? 1 : 0,
          pointerEvents: playerVisible ? 'auto' : 'none',
        }}
      >
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
        <div className={`main-player-wave ${isPlaying ? 'playing' : ''}`}>
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  );
}
