import dynamic from "next/dynamic";

export default function Page({ params }: { params: { slug: string } }) {
  const Post = dynamic(() => import(`../../../lab/${params.slug}/index`), {
    ssr: false,
    loading: () => <div>loading...</div>,
  });

  return (
    <div className="wrap-lab">
      <Post />
    </div>
  );
}