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
      <article className='post'>
        <div className='post-header'>
          <div className='post-title'>{metadata.title}</div>
          <div className='post-info'>
            <span className='post-category'>{category}</span>
            <span>|</span>
            <span className='post-date'>{metadata.date}</span>
          </div>
        </div>
        <div className='post-body'>
          <PostContent content={content} />
        </div>
      </article>
    </>
  );
}
