'use client';

import { useState } from 'react';
import './animationDemos.scss';

// ===========================
// 1. Button Scale Demo
// ===========================
export function ButtonScaleDemo() {
  return (
    <div className='demo-wrapper'>
      <div className='demo-row'>
        <div className='demo-item'>
          <button className='demo-btn no-scale'>Paste</button>
          <span className='demo-label'>scale 없음</span>
        </div>
        <div className='demo-item'>
          <button className='demo-btn with-scale'>Paste</button>
          <span className='demo-label'>scale 있음</span>
        </div>
      </div>
    </div>
  );
}

// ===========================
// 2. Easing Demo
// ===========================
const EASINGS = [
  { label: 'CSS ease-in-out' },
  {
    label: '커스텀 ease-in-out',
  },
];

export function EasingDemo() {
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [key, setKey] = useState(0);

  const current = EASINGS[index];

  const play = () => {
    if (playing) return;
    setKey((k) => k + 1);
    setPlaying(true);
    setTimeout(() => {
      setPlaying(false);
      setIndex((i) => (i + 1) % EASINGS.length);
    }, 2000);
  };
  return (
    <div className='easing-wrapper'>
      <div className='easing-track'>
        {playing && (
          <div
            key={key}
            className={`easing-square playing ${index === 0 ? 'default' : 'custom'}`}
          />
        )}
        {!playing && <div className='easing-square' />}
      </div>
      <div className='easing-info'>
        <span className='easing-type'>{current.label}</span>
      </div>
      <div className='easing-controls'>
        <button className='ctrl-btn' onClick={play} disabled={playing}>
          {playing ? '재생 중...' : '▶ 재생'}
        </button>
      </div>
    </div>
  );
}

// ===========================
// 3. Speed Demo (6번)
// ===========================
export function SpeedDemo() {
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);

  const options = ['Ethereum', 'Bitcoin', 'Solana', 'Arbitrum'];

  return (
    <div className='speed-wrapper'>
      <div className='speed-row'>
        <div className='speed-item'>
          <span className='speed-label'>400ms</span>
          <div className='dropdown-trigger' onClick={() => setOpen1(!open1)}>
            Ethereum ▾
          </div>
          {open1 && (
            <div className='dropdown-menu slow'>
              {options.map((o) => (
                <div
                  key={o}
                  className='dropdown-option'
                  onClick={() => setOpen1(false)}
                >
                  {o}
                </div>
              ))}
            </div>
          )}
        </div>
        <div className='speed-item'>
          <span className='speed-label'>180ms</span>
          <div className='dropdown-trigger' onClick={() => setOpen2(!open2)}>
            Ethereum ▾
          </div>
          {open2 && (
            <div className='dropdown-menu fast'>
              {options.map((o) => (
                <div
                  key={o}
                  className='dropdown-option'
                  onClick={() => setOpen2(false)}
                >
                  {o}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ===========================
// 4. Blur Demo (7번)
// ===========================
export function BlurDemo() {
  const [state1, setState1] = useState(false);
  const [state2, setState2] = useState(false);
  const [key1, setKey1] = useState(0);
  const [key2, setKey2] = useState(0);

  return (
    <div className='blur-wrapper'>
      <div className='blur-row'>
        <div className='blur-item'>
          <button
            className='blur-btn'
            onClick={() => {
              setState1(!state1);
              setKey1((k) => k + 1);
            }}
          >
            <span
              key={key1}
              className={`blur-icon no-blur ${state1 ? 'filled' : 'outline'}`}
            />
          </button>
          <span className='blur-label'>blur 없음</span>
        </div>
        <div className='blur-item'>
          <button
            className='blur-btn scale-btn'
            onClick={() => {
              setState2(!state2);
              setKey2((k) => k + 1);
            }}
          >
            <span
              key={key2}
              className={`blur-icon with-blur ${state2 ? 'filled' : 'outline'}`}
            />
          </button>
          <span className='blur-label'>blur 있음</span>
        </div>
      </div>
    </div>
  );
}
// ===========================
// 5. List Hover Demo (자주 쓰는 것일수록)
// ===========================
const listItems = [
  'Linear',
  'ChatGPT',
  'Cursor',
  'Figma',
  'Obsidian',
  'Raycast',
];

export function ListHoverDemo() {
  return (
    <div className='list-wrapper'>
      <div className='list-row'>
        <div className='list-col'>
          <div className='list-label'>애니메이션 있음</div>
          <ul className='list-wrap'>
            {listItems.map((item) => (
              <li key={item} className='list-item with-anim'>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className='list-col'>
          <div className='list-label'>애니메이션 없음</div>
          <ul className='list-wrap'>
            {listItems.map((item) => (
              <li key={item} className='list-item no-anim'>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className='list-icons'>
        <div className='list-icon'>✕</div>
        <div className='list-icon'>✓</div>
      </div>
    </div>
  );
}
