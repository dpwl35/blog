"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: React.ReactNode }) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

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
          router.push("/test");
        },
      });
    }
  };

  return (
    <div ref={modalRef} className="post-section-inner">
      <button className="button-close" onClick={handleClose}>
        X
      </button>
      {children}
    </div>
  );
}
