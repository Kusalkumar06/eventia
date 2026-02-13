"use client";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";
import React from "react";
import Link from "next/link";
import { lobster } from "@/app/lib/fonts";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  interface NavLink {
    label: string;
    value: string;
  }

  const links: NavLink[] = [
    { label: "Home", value: "/" },
    { label: "Events", value: "/events" },
    { label: "My Events", value: "/my-events" },
    { label: "Profile", value: "/profile" },
  ];
  const pathname = usePathname();
  return (
    <div className="">
      <nav className="px-20 py-3 flex justify-between top-0 z-50">
        <div>
          <Link
            href="/"
            className={`${lobster.className} text-[#DB2525] text-[30px] text`}
          >
            Eventia
          </Link>
        </div>
        <div className="flex space-x-9 items-center justify-center font">
          {links.map((link: NavLink) => (
            <Link
              key={link.label}
              href={link.value}
              className={`relative transition text-[18px] flex items-center gap-3 ${pathname === link.value && "text-[#DB2525]"}`}
            >
              {link.label}
              {pathname === link.value && (
                <motion.span
                  layoutId="nav-tab-underline"
                  className="absolute left-0 right-0 bottom-0 h-[3px] bg-red-600"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </Link>
          ))}
          <button className="bg-[#DB2525] rounded-[5px] text-center px-5 py-1 text-white">
            <Link href="/create-event">+ Create Event</Link>
          </button>
          <button onClick={() => signOut({ callbackUrl: "/signin" })} className="border border-[#DB2525] rounded-[5px] text-center px-5 py-1 text-[#DB2525] hover:bg-[#DB2525] hover:text-white">
            Sign out
          </button>
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
