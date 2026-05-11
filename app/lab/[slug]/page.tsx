import dynamic from "next/dynamic";

export default function Page({ params }: { params: { slug: string } }) {
  const Post = dynamic(() => import(`../../../lab/${params.slug}/index`), {
    ssr: false,
    loading: () => <div>loading...</div>,
  });

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Post />
    </div>
  );
}