import { getMdxFileContent } from '@/lib/post';
import { GetServerSideProps } from 'next';

export default function PostPage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params;

  console.log(`Loading content for category: ${category}, slug: ${slug}`);

  const content = getMdxFileContent(category, slug);

  if (!content) {
    console.error(`Content not found for category: ${category}, slug: ${slug}`);
    return <div>404 - Not Found</div>;
  }

  return (
    <article>
      {/* MDX 콘텐츠를 HTML로 변환하여 렌더링 */}
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}
