// app/archive/[slug]/page.tsx
import dynamic from "next/dynamic";
import type { Metadata } from "next";

// [1] slug별 메타데이터 가져오기
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const mod = await import(`../../../lab/${params.slug}`);
  // lab/slug.tsx 안에 export const metadata = { title, description ... } 붙여두면 됨
  return mod.metadata ?? { title: "Archive", description: "기본 설명" };
}

// [2] 페이지 컴포넌트
export default async function Page({ params }: { params: { slug: string } }) {
  const mod = await import(`../../../lab/${params.slug}`);
  const Post = mod.default;

  // Modal은 클라이언트 컴포넌트니까 dynamic import
  const Modal = dynamic(() => import("../../components/modal"), { ssr: false });

  return (
    <Modal>
      <Post className="modal" />
    </Modal>
  );
}
