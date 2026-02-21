"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <>
      <Navbar />
      <main
        className={`${isHome ? "pt-0" : "pt-20"} min-h-screen bg-background`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}
