import { Metadata } from 'next';
import { getMdxFileContent } from '@/lib/post';
import PostContent from '@/components/PostContent';
import { notFound } from 'next/navigation';

interface PostPageProps {
  params: {
    category: string;
    slug: string;
  };
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { category, slug } = params;
  const { content, metadata } = await getMdxFileContent(category, slug);

  const title = metadata.title || '기본 제목';
  const description = metadata.description || '기본 설명';

  return {
    title,
    description,
  };
}

export default async function PostPage({ params }: { params: { category: string; slug: string } }) {
  const { category, slug } = params;
  const { content, metadata } = await getMdxFileContent(category, slug);

  if (!content) {
    notFound();
  }

  return (
    <>
      <article>
        <div>{metadata.date}</div>
        <PostContent content={content} />
      </article>
    </>
  );
}
