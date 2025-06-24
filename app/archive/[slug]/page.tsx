import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    const Post = (await import(`../../../pages/${params.slug}`)).default;
    return (
      <section className="post-section">
        <Post />
      </section>
    );
  } catch (err) {
    notFound();
  }
}
