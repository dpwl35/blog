import Link from 'next/link';

interface Metadata {
  title?: string;
  description?: string;
  date?: string;
}

type PostListProps = {
  category: string;
  filesWithMetadata: {
    slug: string;
    year: string;
    metadata?: Metadata;
  }[];
};

export default function PostList({ category, filesWithMetadata }: PostListProps) {
  return (
    <section className={`post-section ${category}`}>
      <div className='post-label'>{category}</div>
      <ul className='post-list'>
        {filesWithMetadata.length > 0 ? (
          filesWithMetadata.map(({ slug, year, metadata }) => (
            <li className='post-item' key={slug}>
              <Link className='post-item_link' href={`/${category}/${year}/${slug}`}>
                {metadata?.title || slug}
              </Link>
            </li>
          ))
        ) : (
          <li className='post-item'>게시물이 없습니다.</li>
        )}
      </ul>
    </section>
  );
}
