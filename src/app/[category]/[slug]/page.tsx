import { getMdxFileContent, getMdxFilesWithMetadata } from '@/lib/post';
import PostContent from '@/app/components/PostContent';
import { notFound } from 'next/navigation';

// 페이지 컴포넌트
export default async function PostPage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params;

  const { content, metadata } = await getMdxFileContent(category, slug);

  if (!content) {
    notFound();
  }

  return (
    <article className='post'>
      <div className='post-header'>
        <div className='post-title'>
          <h2 className='post-title_text'>{metadata.title}</h2>
        </div>
        <div className='post-info'>
          <span className='post-category'>{category}</span>
          <span>|</span>
          <span className='post-date'>{metadata.date}</span>
        </div>
      </div>
      <div className='post-body'>
        <PostContent content={content} /> {/* 콘텐츠를 서버 사이드에서 렌더링 */}
      </div>
    </article>
  );
}

// 정적 경로 생성을 위한 `generateStaticParams`
export async function generateStaticParams() {
  const categories = ['note']; // 모든 카테고리 정의
  let paths: { category: string; slug: string }[] = [];

  for (const category of categories) {
    const files = await getMdxFilesWithMetadata(category);
    paths = paths.concat(
      files.map((file) => ({
        category,
        slug: file.slug,
      })),
    );
  }

  return paths;
}

// 페이지 메타데이터를 처리하는 `generateMetadata`
export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params;

  const { metadata } = await getMdxFileContent(category, slug);

  const title = metadata.title || 'j-35.blog';
  const description = metadata.description || '개인 블로그 Next.js 블로그 기록용 블로그';

  return {
    title,
    description,
  };
}
