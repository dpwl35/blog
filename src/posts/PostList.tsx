type PostListProps = {
  category: string;
};

export default function PostList({ category }: PostListProps) {
  return (
    <section className={category}>
      <div>현재 카테고리는 {category} 입니다</div>
    </section>
  );
}
