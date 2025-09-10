"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { usePathname, useRouter } from "next/navigation";

export default function MainWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname: string = usePathname() ?? "";
  const router = useRouter();
  const mainRef = useRef<HTMLElement | null>(null);

  const isArchive = pathname.startsWith("/archive/");

  let mainClass = "main";
  if (isArchive) {
    mainClass = "main main-archive";
  }

  return (
    <main ref={mainRef} className={mainClass}>
      {children}
    </main>
  );
}
