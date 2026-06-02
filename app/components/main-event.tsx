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
      {
        id: 'flip-pen',
        x: 50,
        y: 50,
        xPad: 50,
        yPad: 52,
        xPadSm: 56,
        yPadSm: 50,
        xPadXs: 56,
        yPadXs: 50,
        rotation: -16,
        scale: 1,
      },
      {
        id: 'flip-diary',
        x: 53,
        y: 52,
        xPad: 55,
        yPad: 50,
        xPadSm: 55,
        yPadSm: 50,
        xPadXs: 55,
        yPadXs: 50,
        rotation: -10,
        scale: 1,
      },
      {
        id: 'flip-phone',
        x: 85,
        y: 60,
        xPad: 95,
        yPad: 60,
        xPadSm: 85,
        yPadSm: 56,
        xPadXs: 85,
        yPadXs: 56,
        rotation: 5,
        scale: 1,
      },
      {
        id: 'flip-newspaper',
        x: 15,
        y: 28,
        xPad: 15,
        yPad: 20,
        xPadSm: 15,
        yPadSm: 15,
        xPadXs: 15,
        yPadXs: 15,
        rotation: -3,
        scale: 1,
      },
      {
        id: 'flip-cd',
        x: 12,
        y: 70,
        xPad: 12,
        yPad: 65,
        xPadSm: 17,
        yPadSm: 64,
        xPadXs: 17,
        yPadXs: 64,
        rotation: -3,
        scale: 1,
      },
      {
        id: 'flip-player',
        x: 8,
        y: 35,
        xPad: -2,
        yPad: 38,
        xPadSm: 8,
        yPadSm: 35,
        xPadXs: 11,
        yPadXs: 30,
        rotation: 0,
        scale: 1,
      },
    ],
  },
  cleanup: {
    items: [
      {
        id: 'flip-pen',
        x: 58,
        y: 15,
        xPad: 58,
        yPad: 10,
        xPadSm: 58,
        yPadSm: 8,
        xPadXs: 58,
        yPadXs: 8,
        rotation: 91,
        scale: 0.8,
      },
      {
        id: 'flip-diary',
        x: 55,
        y: 52,
        xPad: 55,
        yPad: 48,
        xPadSm: 55,
        yPadSm: 44,
        xPadXs: 55,
        yPadXs: 44,
        rotation: 1,
        scale: 0.8,
      },
      {
        id: 'flip-phone',
        x: 90,
        y: 56,
        xPad: 85,
        yPad: 52,
        xPadSm: 80,
        yPadSm: 48,
        xPadXs: 80,
        yPadXs: 48,
        rotation: 0,
        scale: 0.8,
      },
      {
        id: 'flip-newspaper',
        x: 85,
        y: 50,
        xPad: 80,
        yPad: 45,
        xPadSm: 75,
        yPadSm: 40,
        xPadXs: 75,
        yPadXs: 40,
        rotation: 0,
        scale: 1,
      },
      {
        id: 'flip-cd',
        x: 15,
        y: 60,
        xPad: 15,
        yPad: 55,
        xPadSm: 15,
        yPadSm: 50,
        xPadXs: 15,
        yPadXs: 50,
        rotation: 0,
        scale: 0.9,
      },
      {
        id: 'flip-player',
        x: 15,
        y: 28,
        xPad: 15,
        yPad: 23,
        xPadSm: 15,
        yPadSm: 18,
        xPadXs: 15,
        yPadXs: 18,
        rotation: 0,
        scale: 1,
      },
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
  const [showModes, setShowModes] = useState(false);
  const isPlayerReadyRef = useRef(false);

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

  useEffect(() => {
    const check = () => setShowModes(window.innerWidth > 767);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const togglePlay = () => {
    clickSoundRef.current?.play();

    if (!isPlayerReadyRef.current) return;

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
          immediateRender: false,
        });
      } else {
        cdAnimRef.current.resume();
      }
      return;
    }

    if (isPlaying) {
      playerRef.current?.pauseVideo();
      cdAnimRef.current?.pause();
      cdRotationRef.current = gsap.getProperty(
        cdRef.current,
        'rotation',
      ) as number;
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

    const isPad = window.innerWidth <= 1024 && window.innerWidth > 820;
    const isPadSm = window.innerWidth <= 820 && window.innerWidth > 768;
    const isPadXs = window.innerWidth <= 768;

    config.items.forEach((itemData: any) => {
      const itemEl = document.getElementById(itemData.id);
      if (!itemEl) return;

      const x = isPadXs
        ? (itemData.xPadXs ?? itemData.x)
        : isPadSm
          ? (itemData.xPadSm ?? itemData.x)
          : isPad
            ? (itemData.xPad ?? itemData.x)
            : itemData.x;
      const y = isPadXs
        ? (itemData.yPadXs ?? itemData.y)
        : isPadSm
          ? (itemData.yPadSm ?? itemData.y)
          : isPad
            ? (itemData.yPad ?? itemData.y)
            : itemData.y;
      const scale = isPadXs
        ? (itemData.scalePadXs ?? itemData.scale)
        : isPadSm
          ? (itemData.scalePadSm ?? itemData.scale)
          : isPad
            ? (itemData.scalePad ?? itemData.scale)
            : itemData.scale;

      const pixelX = (x / 100) * deskWidth - itemEl.offsetWidth / 2;
      const pixelY = (y / 100) * deskHeight - itemEl.offsetHeight / 2;

      gsap.set(itemEl, {
        left: pixelX,
        top: pixelY,
        rotation: itemData.rotation,
        scale: scale ?? 1,
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
    const desk = deskRef.current;
    if (!desk) return;

    const items = document.querySelectorAll('.main-flip-item');
    gsap.set(items, { opacity: 0 });

    const doLayout = () => {
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
    };

    // desk 안의 모든 이미지가 로드된 후 실행
    const images = Array.from(desk.querySelectorAll('img'));
    const unloaded = images.filter((img) => !img.complete);

    if (unloaded.length === 0) {
      // 이미 다 로드된 경우 (캐시)
      doLayout();
    } else {
      let loadedCount = 0;
      unloaded.forEach((img) => {
        const onLoad = () => {
          loadedCount++;
          if (loadedCount === unloaded.length) doLayout();
        };
        img.addEventListener('load', onLoad, { once: true });
        img.addEventListener('error', onLoad, { once: true }); // 실패해도 진행
      });
    }

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
          onReady: (e: any) => {
            setDuration(e.target.getDuration());
            isPlayerReadyRef.current = true;
          },
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
      {showModes && (
        <div className='main-flip-modes'>
          <button onClick={() => switchMode('notebook')}>Notebook</button>
          <button onClick={() => switchMode('cleanup')}>Cleanup</button>
        </div>
      )}
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
