import type { Metadata } from 'next';
import Link from 'next/link';
import { Inter } from 'next/font/google';
import './globals.css';
import '../styles/style.scss';

import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'j-35.blog',
  description: '개인 블로그 Next.js 블로그 기록용 블로그',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' data-theme='light'>
      <head>
        <link
          rel='stylesheet'
          as='style'
          crossOrigin='anonymous'
          href='https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css'
        />
      </head>
      <body className={inter.className}>
        <div className='wrap'>
          <Header />
          <div className='category'>
            <ul className='category-area'>
              <li className='category-item active'>
                <Link href='/'>*</Link>
              </li>
              <li className='category-item'>
                <Link href='/note'>Note</Link>
              </li>
              <li className='category-item'>
                <Link href='/archive'>Archive</Link>
              </li>
            </ul>
          </div>
          <main className='main'>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
