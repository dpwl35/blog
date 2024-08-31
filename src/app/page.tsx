import Image from 'next/image';
import '../styles/style.scss';

export default function Home() {
  return (
    <main className="main">
      <div className="description">
        <p>Home</p>
        <div>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=appdir-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{'j35'}
            <Image
              src="/images/favicon.svg"
              alt="blog Logo"
              width={24}
              height={24}
              priority
            />
          </a>
        </div>
      </div>
      <div className="layout">블로그 만들기</div>
      {/* <div className={styles.center}></div> */}
    </main>
  );
}
