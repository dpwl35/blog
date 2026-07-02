'use client';

import './animationDemos.scss';
import { useState, useEffect, useRef } from 'react';
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

export function ScrollAnimationDemo() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const handleScroll = () => {
      const items = wrapper.querySelectorAll('.scroll-anim-item');
      const scaleList = wrapper.querySelector('.scroll-anim-scale');
      const wrapperBottom = wrapper.getBoundingClientRect().bottom;

      items.forEach((item) => {
        const itemTop = item.getBoundingClientRect().top;
        item.classList.toggle('on', wrapperBottom > itemTop + 50);
      });

      if (scaleList) {
        const scaleTop = scaleList.getBoundingClientRect().top;
        scaleList.classList.toggle('on', wrapperBottom > scaleTop + 50);
      }
    };

    wrapper.addEventListener('scroll', handleScroll);
    return () => wrapper.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className='scroll-anim-wrapper' ref={wrapperRef}>
      <div className='scroll-anim-hint'>⬇ 스크롤해보세요</div>
      <div className='scroll-anim-content'>
        <div className='scroll-anim-item scroll-right'>Right →</div>
        <div className='scroll-anim-item scroll-left'>← Left</div>
        <div className='scroll-anim-item scroll-up'>↑ Up</div>
        <div className='scroll-anim-item scroll-down'>↓ Down</div>
        <div className='scroll-anim-scale'>
          <span className='scale-item' style={{ animationDelay: '0s' }}>
            1
          </span>
          <span className='scale-item' style={{ animationDelay: '0.3s' }}>
            2
          </span>
          <span className='scale-item' style={{ animationDelay: '0.6s' }}>
            3
          </span>
        </div>
      </div>
    </div>
  );
}

export function HeightAnimationDemo() {
  const [openAuto, setOpenAuto] = useState(false);
  const [openGrid, setOpenGrid] = useState(false);

  return (
    <div className='demo-wrapper'>
      <div className='demo-row'>
        <div className='demo-item'>
          <span className='demo-label'>height: auto</span>
          <div className='height-card'>
            <p className='height-card-title'>Brand Refresh Request</p>
            <p className='height-card-sub'>Planning next steps...</p>
            <div
              className='height-body no-grid'
              style={{ height: openAuto ? 'auto' : 0 }}
            >
              <p>
                1. Review the current website structure
                <br />
                2. Suggest a cleaner page flow
                <br />
                3. Improve homepage sections
              </p>
            </div>
          </div>
          <button className='ctrl-btn' onClick={() => setOpenAuto((v) => !v)}>
            toggle
          </button>
        </div>

        <div className='demo-item'>
          <span className='demo-label'>grid-template-rows: 0fr → 1fr</span>
          <div className='height-card'>
            <p className='height-card-title'>Brand Refresh Request</p>
            <p className='height-card-sub'>Planning next steps...</p>
            <div
              className='height-body with-grid'
              style={{ gridTemplateRows: openGrid ? '1fr' : '0fr' }}
            >
              <div className='height-body-inner'>
                <p>
                  1. Review the current website structure
                  <br />
                  2. Suggest a cleaner page flow
                  <br />
                  3. Improve homepage sections
                </p>
              </div>
            </div>
          </div>
          <button className='ctrl-btn' onClick={() => setOpenGrid((v) => !v)}>
            toggle
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================
// 7. Proximity Scale Demo
// ===========================

export function ProximityScaleDemo() {
  const proximityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dock = proximityRef.current;
    if (!dock) return;

    const BASE = 48;
    const MAX_GROW = 24;

    const handlePointerMove = (e: PointerEvent) => {
      const items = dock.querySelectorAll<HTMLElement>('.dock-item');
      items.forEach((el) => {
        const r = el.getBoundingClientRect();
        const t = Math.max(
          0,
          1 - Math.abs(e.clientX - r.x - r.width / 2) / 120,
        );
        const size = BASE + t * MAX_GROW;
        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.opacity = `${1 - t * 0.4}`;
      });
    };

    const handlePointerLeave = () => {
      const items = dock.querySelectorAll<HTMLElement>('.dock-item');
      items.forEach((el) => {
        el.style.width = `${BASE}px`;
        el.style.height = `${BASE}px`;
        el.style.opacity = '1';
      });
    };

    dock.addEventListener('pointermove', handlePointerMove);
    dock.addEventListener('pointerleave', handlePointerLeave);
    return () => {
      dock.removeEventListener('pointermove', handlePointerMove);
      dock.removeEventListener('pointerleave', handlePointerLeave);
    };
  }, []);

  return (
    <div className='demo-wrapper'>
      <div className='demo-row'>
        <div className='demo-item'>
          <span className='demo-label'>Using proximity</span>
          <div className='dock-outer'>
            <div className='dock-outer-inner'>
              <div className='dock' ref={proximityRef}>
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className='dock-item' />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <br />
      <div className='demo-row'>
        <div className='demo-item'>
          <span className='demo-label'>Direct scaling</span>
          <div className='dock-outer'>
            <div className='dock-outer-inner'>
              <div className='dock'>
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className='dock-item'
                    onPointerEnter={(e) => {
                      const el = e.currentTarget;
                      el.style.width = '72px';
                      el.style.height = '72px';
                    }}
                    onPointerLeave={(e) => {
                      const el = e.currentTarget;
                      el.style.width = '48px';
                      el.style.height = '48px';
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================
// 8. Number Pop-in Demo
// ===========================
export function NumberPopInDemo({ value = '123' }: { value?: string }) {
  const [playing, setPlaying] = useState(true);

  const replay = () => {
    setPlaying(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setPlaying(true)));
  };

  return (
    <div className='demo-wrapper'>
      <div className='demo-row'>
        <div className='demo-item'>
          <span className={'num-pop-group' + (playing ? ' playing' : '')}>
            {value.split('').map((ch, i) => (
              <span
                key={i}
                className='num-pop-digit'
                data-stagger={i > 0 ? i : undefined}
              >
                {ch}
              </span>
            ))}
          </span>
          <button type='button' className='ctrl-btn' onClick={replay}>
            ▶ 재생
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================
// 9. Text Reveal Demo
// ===========================
export function TextRevealDemo({
  primary = '새로운 업데이트',
  secondary = '더 빨라진 반응 속도',
}: {
  primary?: string;
  secondary?: string;
}) {
  const [shown, setShown] = useState(false);
  const [hiding, setHiding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onAnimate = () => {
    if (shown) {
      setShown(false);
      setHiding(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setHiding(false), 200);
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      setHiding(false);
      requestAnimationFrame(() => setShown(true));
    }
  };

  const cls =
    'text-reveal-wrap' + (shown ? ' shown' : '') + (hiding ? ' hiding' : '');

  return (
    <div className='demo-wrapper'>
      <div className='demo-row'>
        <div className='demo-item'>
          <div className={cls}>
            <strong className='text-reveal-line text-reveal-line-1'>
              {primary}
            </strong>
            <span className='text-reveal-line text-reveal-line-2'>
              {secondary}
            </span>
          </div>
          <button type='button' className='ctrl-btn' onClick={onAnimate}>
            ▶ 재생
          </button>
        </div>
      </div>
    </div>
  );
}
