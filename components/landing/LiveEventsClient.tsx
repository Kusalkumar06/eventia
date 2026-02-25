"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import EventImage from "@/components/shared/EventImage";
import Link from "next/link";
import { EventDTO } from "@/types/types";

const EventCard = ({ event }: { event: EventDTO }) => {
  const eventDate = new Date(event.startDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group relative w-[300px] sm:w-[350px] shrink-0 overflow-hidden rounded-xl bg-card border border-border transition-colors duration-300"
    >
      <div className="relative h-48 w-full overflow-hidden">
        <EventImage
          src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop"
          alt={event.title}
          fill
          sizes="(max-width: 768px) 300px, 350px"
          className="group-hover:scale-110"
        />
        <div className="absolute top-3 left-3 bg-background/60 dark:bg-black/60 backdrop-blur-md px-2 py-1 rounded text-xs font-bold text-foreground dark:text-white uppercase tracking-wider border border-border dark:border-white/10">
          {event.category.name}
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
            <span>{eventDate}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
            <span className="truncate max-w-[120px]">
              {event.mode === "online"
                ? "Online"
                : event.location?.city || "Offline"}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default function LiveEventsClient({ events }: { events: EventDTO[] }) {
  return (
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
          <EventCard key={`${event._id}-${idx}`} event={event} />
        ))}
      </motion.div>
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
    </div>
  );
}
