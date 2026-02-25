"use client";

import { usePathname } from "next/navigation";

export default function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <main className={`${isHome ? "pt-0" : "pt-20"} min-h-screen bg-background`}>
      {children}
    </main>
  );
}
