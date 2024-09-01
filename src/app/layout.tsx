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
  description: 'j-35.blog',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' data-theme='light'>
      <body className={inter.className}>
        <div className='wrap'>
          <Header />
          <div className='category'>
            <ul className='category-area'>
              <li className='category-item active'>
                <Link href='/'>*</Link>
              </li>
              <li className='category-item'>
                <Link href='til'>TIL</Link>
              </li>
              <li className='category-item'>
                <Link href='archive'>Archive</Link>
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
