"use client";

import PageTransition from "@/components/PageTransition";
import { usePathname } from "next/navigation";

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return <PageTransition key={pathname}>{children}</PageTransition>;
}
