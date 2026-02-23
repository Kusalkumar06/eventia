"use client";

import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { lobster } from "@/utilities/fonts";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import { Menu, X } from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";
import { toast } from "sonner";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (
      status === "authenticated" &&
      sessionStorage.getItem("googleLogin") === "pending"
    ) {
      toast.success("Successfully signed in!");
      sessionStorage.removeItem("googleLogin");
    }
  }, [status]);

  interface NavLink {
    label: string;
    value: string;
  }

  const links: NavLink[] = [
    { label: "Home", value: "/" },
    { label: "Events", value: "/events" },

    ...(session
      ? [
          { label: "My Events", value: "/my-events" },
          { label: "Profile", value: "/profile" },
        ]
      : []),
    { label: "Contact Us", value: "/contact" },
  ];

  const navContainerStyles =
    "bg-background/20 dark:bg-white/10 backdrop-blur-md shadow-sm border border-zinc-200/50 dark:border-white/10 py-3";

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 px-4 pt-4 pointer-events-none"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        className={`max-w-7xl mx-auto rounded-2xl transition-all duration-500 pointer-events-auto ${navContainerStyles}`}
      >
        <div className="px-6 flex items-center justify-between">
          {/* Left Side: Logo & Search */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className={`${lobster.className} text-primary text-3xl tracking-wide shrink-0`}
            >
              Eventia
            </Link>

            {/* Search Bar - visible on desktop */}
            <div className="hidden md:block w-80">
              <GlobalSearch />
            </div>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.value}
                className={`relative text-base font-medium transition-colors hover:text-primary ${
                  pathname === link.value
                    ? "text-primary"
                    : "text-zinc-600 dark:text-zinc-300"
                }`}
              >
                {link.label}
                {pathname === link.value && (
                  <motion.span
                    layoutId="nav-tab-underline"
                    className="absolute left-0 right-0 -bottom-1 h-0.5 bg-primary"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side: Actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            {session ? (
              <>
                <Link
                  href="/create-event"
                  className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-medium transition-colors text-sm whitespace-nowrap"
                >
                  + Create Event
                </Link>
                <button
                  onClick={() => {
                    sessionStorage.setItem("authAction", "loggedOut");
                    signOut({ callbackUrl: "/signin" });
                  }}
                  className="cursor-pointer text-zinc-600 dark:text-zinc-300 hover:text-primary text-sm font-medium transition-colors whitespace-nowrap"
                >
                  Sign out
                </button>
              </>
            ) : (
              <Link
                href="/signin"
                className="bg-primary hover:bg-primary/90 text-white px-5 py-2 rounded-full font-medium transition-colors text-sm whitespace-nowrap"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            <div className="md:hidden">
              <GlobalSearch />
            </div>

            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cursor-pointer text-zinc-600 dark:text-white"
            >
              {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-6 py-6 flex flex-col space-y-4 border-t border-zinc-200/50 dark:border-zinc-800/50 mt-4">
                {links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.value}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-medium ${
                      pathname === link.value
                        ? "text-primary"
                        : "text-zinc-600 dark:text-zinc-300"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <hr className="border-zinc-200/50 dark:border-zinc-800/50" />
                {session ? (
                  <>
                    <Link
                      href="/create-event"
                      onClick={() => setMobileMenuOpen(false)}
                      className="bg-primary text-white px-5 py-3 rounded-lg text-center font-medium"
                    >
                      + Create Event
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        sessionStorage.setItem("authAction", "loggedOut");
                        signOut({ callbackUrl: "/signin" });
                      }}
                      className="text-zinc-600 dark:text-zinc-300 text-left font-medium py-2"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="bg-primary text-white px-5 py-3 rounded-lg text-center font-medium"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
};

export default Navbar;
