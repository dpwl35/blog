import { getMdxFileContent, getMdxFilesWithMetadata } from '@/lib/post';
import PostContent from '@/app/components/PostContent';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';

// 페이지 컴포넌트
export default async function PostPage({
  params,
}: {
  params: { category: string; year: string; slug: string };
}) {
  const { category, year, slug } = params;

  const { content, metadata } = await getMdxFileContent(category, year, slug);

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

export async function generateMetadata({
  params,
}: {
  params: { category: string; slug: string; year: string };
}) {
  const { category, slug, year } = params;

  // 매개변수 순서를 올바르게 수정: category, year, slug
  const { metadata } = await getMdxFileContent(category, year, slug);

  const title = metadata.title || '기본 타이틀';
  const description = metadata.description || '기본 설명';

  return {
    title,
    description,
  };
}
