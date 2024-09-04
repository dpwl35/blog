import Link from 'next/link';

type PostListProps = {
  category: string;
  mdxFiles: string[];
};

export default function PostList({ category, mdxFiles }: PostListProps) {
  return (
    <section className={`post ${category}`}>
      <div className='post-label'>{category}</div>
      <ul className='post-list'>
        {mdxFiles.map((file) => (
          <li className='post-item' key={file}>
            <Link href={`/${category}/${file.replace('.mdx', '')}`}>
              {file.replace('.mdx', '')}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
