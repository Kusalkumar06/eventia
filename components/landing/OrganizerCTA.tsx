"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import EventImage from "@/components/shared/EventImage";
import { useSession } from "next-auth/react";

export default function OrganizerCTA() {
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string })?.role;

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <EventImage
          src="https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2162&auto=format&fit=crop"
          alt="Event Organizer"
          fill
          sizes="100vw"
          className="brightness-[0.2]"
          containerClassName="h-full w-full"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-black" />
      </div>

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-semibold uppercase tracking-wider">
            For Organizers
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
        >
          Host Your Event <br /> with{" "}
          <span className="text-primary">Eventia</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-zinc-300 mb-10 max-w-2xl mx-auto"
        >
          Powerful tools to manage registrations, ticketing, and analytics. Take
          your event to the next level.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          {status === "loading" ? (
            <div className="w-48 h-14 bg-white/20 animate-pulse rounded-full" />
          ) : role === "admin" || role === "organizer" ? (
            <Link
              href="/organizer"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 duration-200 shadow-lg shadow-primary/25"
            >
              Go to Organizer Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/create-event"
              className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 duration-200"
            >
              Become an Organizer
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
