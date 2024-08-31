import Link from 'next/link';

export default function Home() {
  return (
    <section>
      <div className='category'>
        <ul className='category-area'>
          <li className='category-item active'>*</li>
          <li className='category-item'>
            <Link href='til'>TIL</Link>
          </li>
          <li className='category-item'>
            <Link href='archive'>Archive</Link>
          </li>
        </ul>
      </div>
      <div className='post'>메인내용</div>
    </section>
  );
}
