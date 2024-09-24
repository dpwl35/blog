import Link from 'next/link';

interface Metadata {
  title?: string;
}

type PostListProps = {
  category: string;
  filesWithMetadata: {
    slug: string;
    metadata: Metadata;
  }[];
};

export default function PostList({ category, filesWithMetadata }: PostListProps) {
  return (
    <section className={`${category}`}>
      <div className='post-label'>{category}</div>
      <ul className='post-list'>
        {filesWithMetadata.map(({ slug, metadata }) => (
          <li className='post-item' key={slug}>
            <Link className='post-item_link' href={`/${category}/${slug}`}>
              {metadata.title || slug.replace('.mdx', '')}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
