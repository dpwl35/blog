export const metadata = {
  title: "test 페이지",
  description: "test 페이지 설명입니다.",
};

export default function Test({ className }: { className?: string }) {
  return <div className={className}> 페이지</div>;
}
