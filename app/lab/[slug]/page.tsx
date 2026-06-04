import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import Loading from 'app/components/loading';

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const mod = await import(`../../../lab/${params.slug}/metadata`);
  return mod.metadata ?? { title: params.slug };
}

export default function Page({ params }: { params: { slug: string } }) {
  const Post = dynamic(() => import(`../../../lab/${params.slug}/index`), {
    ssr: false,
    loading: () => null,
  });

  return (
    <div className='wrap-lab'>
      <Post />
    </div>
  );
}
