"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Search } from "lucide-react";
import Link from "next/link";
import EventImage from "@/components/shared/EventImage";

export default function Hero() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <section
      ref={targetRef}
      className="relative h-screen w-full overflow-hidden bg-background text-foreground"
    >
      <motion.div style={{ y, opacity }} className="absolute inset-0 z-0">
        <EventImage
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop"
          alt="Event Atmosphere"
          fill
          sizes="100vw"
          priority
          containerClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-black z-10" />
      </motion.div>

      <div className="relative z-20 flex h-full flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute -inset-1 blur-2xl bg-primary/30 rounded-full opacity-50" />
          <h1 className="relative text-5xl font-black tracking-tighter sm:text-7xl md:text-9xl bg-clip-text text-transparent bg-linear-to-b from-white to-white/60">
            EVENTIA
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-6 max-w-2xl text-lg font-light text-zinc-300 sm:text-xl"
        >
          Discover the extraordinary. <br className="hidden sm:block" />
          The world&apos;s most immersive event platform.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-8 flex w-full max-w-md items-center overflow-hidden rounded-full bg-white/10 border border-white/10 backdrop-blur-md transition-all focus-within:ring-2 focus-within:ring-primary/50 focus-within:bg-white/15"
        >
          <Search className="ml-4 h-5 w-5 text-zinc-400" />
          <input
            type="text"
            placeholder="Search events, artists, or venues..."
            className="flex-1 bg-transparent px-4 py-3 text-white placeholder-zinc-400 focus:outline-none"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="mt-8 flex gap-4"
        >
          <Link
            href="/events"
            className="group relative flex items-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgb(var(--color-primary)/0.5)]"
          >
            <span>Explore Now</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2 text-zinc-500">
          <span className="text-[10px] uppercase tracking-[0.2em]">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-12 w-px bg-linear-to-b from-transparent via-zinc-500 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
