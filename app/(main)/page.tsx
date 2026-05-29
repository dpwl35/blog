import { getBlogPosts, formatDate } from 'app/(main)/blog/utils';
import { getLabItems } from '../lab/utils';
import Link from 'next/link';
import MainEvent from 'app/components/main-event';

export default async function MainPage() {
  const posts = getBlogPosts()
    .sort(
      (a, b) =>
        new Date(b.metadata.publishedAt).getTime() -
        new Date(a.metadata.publishedAt).getTime(),
    )
    .slice(0, 3);

  const labItems = await getLabItems();

  return (
    <div className='main-content'>
      <MainEvent />
      <div className='main-feed'>
        <div className='main-feed-area'>
          <p className='main-feed-title'>BLOG : 기록 보관소</p>
          <ul className='main-feed-iist'>
            {posts.map((post) => (
              <li key={post.slug} className='main-feed-item'>
                <Link href={`/blog/${post.slug}`} className='main-feed-link'>
                  {post.metadata.title}
                </Link>
                <span className='main-feed-date'>
                  {formatDate(post.metadata.publishedAt)}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className='main-feed-area'>
          <p className='main-feed-title'>AECHIVE : 작업물 모음</p>
          <ul className='main-feed-iist'>
            {labItems.map((item) => (
              <li key={item.slug} className='main-feed-item'>
                <Link
                  href={`/lab/${item.slug}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='main-feed-link'
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className='main-feed-area'>
          <p className='main-feed-title'>NOTES : 학습 기록장</p>
        </div>
      </div>
    </div>
  );
}
