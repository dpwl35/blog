type PostListProps = {
  category: string;
  mdxFiles: string[]; // mdxFiles 속성 추가
};

export default function PostList({ category, mdxFiles }: PostListProps) {
  return (
    <section className={category}>
      <div>현재 카테고리는 {category} 입니다</div>
      <ul className='post'>
        {mdxFiles.map((file) => (
          <li className='post-list' key={file}>
            {file.replace('.mdx', '')}
          </li>
        ))}
      </ul>
    </section>
  );
}
