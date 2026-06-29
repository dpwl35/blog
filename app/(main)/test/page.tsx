'use client';

import { useEffect } from 'react';
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type ScenerElement = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'scener-button': ScenerElement & { category?: string; variant?: string };
      'scener-badge': ScenerElement & {
        category?: string;
        status?: string;
        appearance?: string;
        size?: string;
      };
      'scener-chip': ScenerElement;
      'scener-title': ScenerElement & {
        variant?: string;
        label?: string;
        title?: string;
        description?: string;
        'action-label'?: string;
      };
      'scener-event-card': ScenerElement & {
        'image-src'?: string;
        category?: string;
        status?: string;
        'match-label'?: string;
        'content-title'?: string;
        venue?: string;
        date?: string;
      };
      'scener-event-list': ScenerElement;
      'scener-article-item': ScenerElement & {
        layout?: string;
        'image-src'?: string;
        'category-label'?: string;
        title?: string;
        author?: string;
        'read-time'?: string;
      };
    }
  }
}

export default function TestPage() {
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://cdn.jsdelivr.net/gh/dpwl35/scener-design-system@3658b26efa9c4af15371e0a7f9313275602375ab/dist/scener-design-system.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.type = 'module';
    script.src =
      'https://cdn.jsdelivr.net/gh/dpwl35/scener-design-system@3658b26efa9c4af15371e0a7f9313275602375ab/dist/scener-design-system.js';
    document.head.appendChild(script);

    script.onload = () => {
      const eventList = document.querySelector('scener-event-list') as any;
      if (eventList) {
        eventList.items = [
          {
            thumbnailSrc: '',
            category: 'performance',
            title: '실내악 시리즈 Vol.3',
            venue: '롯데콘서트홀',
            date: '06.28',
            ddayLabel: 'D-3',
          },
          {
            thumbnailSrc: '',
            category: 'film',
            title: '시네마테크 클래식 상영',
            venue: '서울아트시네마',
            date: '06.21',
            ddayLabel: 'D-DAY',
            urgent: true,
          },
        ];
      }
    };

    return () => {
      link.remove();
      script.remove();
    };
  }, []);

  return (
    <div
      style={{
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        backgroundColor: '#1c1c1c',
        margin: '0 auto',
      }}
      data-theme='dark'
    >
      <h1 style={{ color: '#fff' }}>SCENE;er Design System 테스트</h1>

      <scener-button category='primary' variant='default'>
        저장하기
      </scener-button>

      <scener-badge category='exhibition' />

      <scener-chip>아트</scener-chip>

      <scener-title
        variant='simple'
        label='FOR 민지'
        title='취향에 맞춘 추천'
      ></scener-title>

      <scener-title
        variant='withAction'
        label='TODAY'
        title='투데이 아티클'
        action-label='더보기'
      ></scener-title>

      <div style={{ width: '280px', height: '340px' }}>
        <scener-event-card
          category='exhibition'
          status='ongoing'
          match-label='96% 취향 일치'
          content-title='빛: 영원에서 영원으로'
          venue='대림미술관'
          date='~6.30'
        ></scener-event-card>
      </div>

      <scener-event-list></scener-event-list>

      <scener-article-item
        layout='card'
        category-label="EDITOR'S NOTE"
        title='요즘 성수동에서 가장 뜨거운 전시 5'
        author='에디터 윤'
        read-time='4'
      ></scener-article-item>
    </div>
  );
}
