// app/[slug]/page.tsx (Server Component)
import dynamic from "next/dynamic";
import Modal from "../../components/modal";

export default async function Page({ params }: { params: { slug: string } }) {
  const Post = (await import(`../../../pages/${params.slug}`)).default;
  const Modal = dynamic(() => import("../../components/modal"), { ssr: false });

  return (
    <Modal>
      <Post className="modal" />
    </Modal>
  );
}
