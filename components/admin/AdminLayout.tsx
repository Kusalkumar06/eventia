"use client";

import { useState } from "react";
import { cn } from "@/utilities/styling";
import SideBar from "./SideBar";
import TopBar from "./TopBar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [desktopSidebar, setDesktopSidebar] = useState(true);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <SideBar
        desktopSidebar={desktopSidebar}
        setDesktopSidebar={setDesktopSidebar}
        mobileSidebar={mobileSidebar}
        setMobileSidebar={setMobileSidebar}
      />
      <TopBar
        desktopSidebar={desktopSidebar}
        setMobileSidebar={setMobileSidebar}
      />
      <main
        className={cn(
          "pt-24 px-6 pb-12 transition-all duration-300 ease-in-out min-h-screen",
          desktopSidebar ? "lg:ml-64" : "lg:ml-20",
          "ml-0",
        )}
      >
        {children}
      </main>
      {mobileSidebar && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden backdrop:blur-md transition-opacity"
          onClick={() => setMobileSidebar(false)}
        ></div>
      )}
    </div>
  );
}
