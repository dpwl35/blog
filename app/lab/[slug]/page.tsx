import dynamic from 'next/dynamic';
import Loading from 'app/components/loading';

export default async function Page({ params }: { params: { slug: string } }) {
  const mod = await import(`../../../lab/${params.slug}/metadata`);
  const hasInternalLoader = mod.metadata?.hasInternalLoader ?? false;

  const Post = dynamic(() => import(`../../../lab/${params.slug}/index`), {
    ssr: false,
    loading: hasInternalLoader ? () => null : () => <Loading />,
  });

  return (
    <div className='wrap-lab'>
      <Post />
    </div>
  );
}
