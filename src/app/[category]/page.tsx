import { notFound } from 'next/navigation';
import PostList from '@/posts/PostList';
import { getMdxFiles } from '@/lib/post';

type Props = {
  params: { category: string };
};

export const dynamicParams = false;

function getCategoryList() {
  return ['til', 'archive'];
}

export function generateStaticParams() {
  const categoryList = getCategoryList();
  const paramList = categoryList.map((category) => ({ category }));
  return paramList;
}

export default function CategoryPage({ params }: Props) {
  const { category } = params;

  if (!category || !getCategoryList().includes(category)) {
    notFound();
  }

  // 카테고리에 따른 .mdx 파일 목록 가져오기
  const mdxFiles = getMdxFiles(category);

  console.log('카테고리:', category);
  console.log('MDX 파일 목록:', mdxFiles); // MDX 파일 목록 확인

  return <PostList category={category} mdxFiles={mdxFiles} />;
}
