import { notFound } from 'next/navigation';
import PostList from '@/posts/PostList';
import { getMdxFilesWithMetadata } from '@/lib/post';

type Props = {
  params: { category: string };
};

export const dynamicParams = false;

function getCategoryList() {
  return ['note', 'archive'];
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

  const filesWithMetadata = await getMdxFilesWithMetadata(category);

  if (category === 'note') {
    return <PostList category={category} filesWithMetadata={filesWithMetadata} />;
  }

  if (category === 'archive') {
    return <div>....</div>;
  }

  return null;
}
