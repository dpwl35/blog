import { notFound } from 'next/navigation';
import PostList from '@/posts/PostList';

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

  return <PostList category={category} />;
}
