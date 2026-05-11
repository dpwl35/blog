import dynamic from "next/dynamic";

const Room = dynamic(() => import("lab/room"), {
  ssr: false,
  loading: () => <div>loading...</div>,
});

export default function Page() {
  return (
    <section className="main-content">
      <div className="main-content-area">
        <Room transparent />
        <p>{`안녕하세요.`}</p>
      </div>
    </section>
  );
}
