type PostListProps = {
  category: string;
  mdxFiles: string[]; // mdxFiles 속성 추가
};

export default function PostList({ category, mdxFiles }: PostListProps) {
  return (
    <section className={`post ${category}`}>
      <div className='post-label'>{category}</div>
      <ul className='post-list'>
        {mdxFiles.map((file) => (
          <li className='post-item' key={file}>
            {file.replace('.mdx', '')}
          </li>
        ))}
      </ul>
    </section>
  );
}
