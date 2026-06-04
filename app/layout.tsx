import '@styles/style.scss';
import type { Metadata } from 'next';
import { baseUrl } from './sitemap';
import Script from 'next/script';
import { themeEffect } from '@utils/themeEffect';

export const metadata: Metadata = {
  icons: {
    icon: '/favicon.png',
  },
  metadataBase: new URL(baseUrl),
  title: {
    default: '웹퍼블리셔 포트폴리오: dpwl35.blog',
    template: '%s | dpwl35.blog',
  },
  description:
    '웹 퍼블리셔 dpwl35의 포트폴리오 블로그입니다. HTML, CSS, JavaScript, React를 활용한 인터랙션 구현 작업물을 기록합니다.',
  keywords: [
    '웹 퍼블리셔',
    '웹 퍼블리셔 포트폴리오',
    'UI 개발',
    'HTML',
    'CSS',
    'React',
    '인터랙션',
  ],
  alternates: {
    canonical: 'https://dpwl35.com',
  },
  openGraph: {
    title: 'dpwl35 | 웹 퍼블리셔 포트폴리오',
    description:
      '웹 퍼블리셔 dpwl35의 포트폴리오 블로그입니다. HTML, CSS, JavaScript, React를 활용한 인터랙션 구현 작업물을 기록합니다.',
    url: 'https://dpwl35.com',
    siteName: 'dpwl35.blog',
    locale: 'ko_KR',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' data-theme='light'>
      <head>
        <Script
          id='theme-init'
          strategy='beforeInteractive'
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})()`,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
