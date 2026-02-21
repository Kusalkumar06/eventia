"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import Image from "next/image";

const events = [
  {
    id: 1,
    title: "Neon Cyberpunk Night",
    date: "Mar 15, 2026",
    location: "Neo-Tokyo Arena",
    image:
      "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=2070&auto=format&fit=crop",
    category: "Music",
  },
  {
    id: 2,
    title: "Abstract Art Expo",
    date: "Mar 22, 2026",
    location: "Modern Gallery",
    image:
      "https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=2070&auto=format&fit=crop",
    category: "Art",
  },
  {
    id: 3,
    title: "Tech Innovators Summit",
    date: "Apr 05, 2026",
    location: "Silicon Hall",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop",
    category: "Tech",
  },
  {
    id: 4,
    title: "Midnight Jazz Club",
    date: "Apr 12, 2026",
    location: "Basement 42",
    image:
      "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=2032&auto=format&fit=crop",
    category: "Music",
  },
  {
    id: 5,
    title: "Future Fashion Week",
    date: "May 01, 2026",
    location: "Grand runway",
    image:
      "https://images.unsplash.com/photo-1526045612212-70caf35c14df?q=80&w=2070&auto=format&fit=crop",
    category: "Fashion",
  },
];

interface Event {
  id: number;
  title: string;
  date: string;
  location: string;
  image: string;
  category: string;
}

const EventCard = ({ event }: { event: Event }) => (
  <div className="group relative w-[300px] sm:w-[350px] shrink-0 overflow-hidden rounded-xl bg-card border border-border transition-colors duration-300">
    <div className="relative h-48 w-full overflow-hidden">
      <Image
        src={event.image}
        alt={event.title}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute top-3 left-3 bg-background/60 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-foreground dark:text-white uppercase tracking-wider border border-border dark:border-white/10">
        {event.category}
      </div>
    </div>
    <div className="p-4 relative">
      <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
        {event.title}
      </h3>
      <div className="flex items-center gap-4 text-sm text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-4 w-4 text-zinc-500" />
          <span>{event.date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
          <span>{event.location}</span>
        </div>
      </div>
    </div>
  </div>
);

export default function LiveEvents() {
  return (
    <section className="py-24 bg-background transition-colors duration-300 overflow-hidden">
      <div className="px-6 mb-12 flex items-end justify-between max-w-7xl mx-auto w-full">
        <div>
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold text-foreground"
          >
            Trending <span className="text-primary">Now</span>
          </motion.h2>
        </div>
        <div className="hidden md:block">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        </div>
      </div>

      <div className="relative flex w-full">
        <motion.div
          className="flex gap-6 px-6"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 30,
          }}
          whileHover={{ animationPlayState: "paused" }}
          style={{ width: "fit-content" }}
        >
          {[...events, ...events, ...events].map((event, idx) => (
            <EventCard key={`${event.id}-${idx}`} event={event} />
          ))}
        </motion.div>
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
      </div>
    </section>
  );
}
