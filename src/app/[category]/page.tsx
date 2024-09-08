import { notFound } from 'next/navigation';
import PostList from '@/posts/PostList';
import { getMdxFilesWithMetadata } from '@/lib/post';

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

export default async function CategoryPage({ params }: Props) {
  const { category } = params;

  if (!category || !getCategoryList().includes(category)) {
    notFound();
  }

  // 카테고리에 따른 .mdx 파일 목록과 메타데이터 가져오기
  const filesWithMetadata = await getMdxFilesWithMetadata(category);

  // console.log('카테고리:', category);
  // console.log('파일 목록과 메타데이터:', filesWithMetadata);

  return <PostList category={category} filesWithMetadata={filesWithMetadata} />;
}
