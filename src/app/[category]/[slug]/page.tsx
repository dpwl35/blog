import fs from 'fs';
import path from 'path';
import { MDXProvider } from '@mdx-js/react';
import { ReactNode } from 'react';
import { getMdxFileContent } from '@/lib/post';

// 동적 경로 생성
export async function generateStaticParams() {
  const categories = ['til', 'archive'];
  const paths: { category: string; slug: string }[] = [];

  for (const category of categories) {
    const dir = path.join(process.cwd(), 'src', 'posts', category);
    const files = fs
      .readdirSync(dir)
      .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'));

    files.forEach((file) => {
      const slug = file.replace(/\.mdx?$/, '');
      paths.push({ category, slug });
    });
  }

  return paths.map(({ category, slug }) => ({
    category,
    slug,
  }));
}
// 페이지 메타데이터 생성
export async function generateMetadata({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params;
  const content = getMdxFileContent(category, slug);

  if (!content) {
    return { notFound: true };
  }

  return {
    title: `Post: ${slug}`,
    description: `Description for ${slug}`,
  };
}

// 페이지 컴포넌트
export default function PostPage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params;
  const content = getMdxFileContent(category, slug);

  if (!content) {
    // 콘텐츠가 없는 경우, 404 페이지를 반환
    return <div>404 - Not Found</div>;
  }

  return (
    <article>
      {/* MDX 콘텐츠를 HTML로 변환하여 렌더링 */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
