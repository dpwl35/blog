// app/archive/[slug]/page.tsx
import dynamic from "next/dynamic";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const mod =
    params.slug === "room"
      ? await import("../../../../lab/room/metadata")
      : await import(`../../../lab/${params.slug}`);

  return mod.metadata ?? { title: "Archive", description: "기본 설명" };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug;

  // [1] Modal은 클라이언트 전용
  const Modal = dynamic(() => import("../../../components/modal"), { ssr: false });

  // [2] R3F 페이지일 경우 dynamic import + ssr:false
  if (slug === "room") {
    const Post = dynamic(() => import(`../../../../lab/room/index`), {
      ssr: false,
      loading: () => (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
          }}
        >
          loading...
        </div>
      ),
    });
    return (
      <Modal>
        <Post className="modal" />
      </Modal>
    );
  }

  // [3] 그 외에는 그냥 SSR import
  const mod = await import(`../../../lab/${slug}`);
  const Post = mod.default;
  return (
    <Modal>
      <Post className="modal" />
    </Modal>
  );
}
