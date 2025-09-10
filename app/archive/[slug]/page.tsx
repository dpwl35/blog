"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter, notFound } from "next/navigation";

export default async function Page({ params }: { params: { slug: string } }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // 모달 진입 애니메이션
  useEffect(() => {
    if (modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
      );
    }
  }, []);

  const handleClose = () => {
    if (modalRef.current) {
      gsap.to(modalRef.current, {
        yPercent: 100,
        opacity: 0,
        duration: 0.6,
        ease: "power3.in",
        onComplete: () => {
          router.push("/archive");
        },
      });
    }
  };

  try {
    const Post = (await import(`../../../pages/${params.slug}`)).default;
    return (
      <div ref={modalRef} className="post-section-inner">
        <button className="button-close" onClick={handleClose}>
          X
        </button>
        <Post />
      </div>
    );
  } catch (err) {
    notFound();
  }
}
