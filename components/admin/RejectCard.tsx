import React from "react";
import { EventDTO } from "@/types/types";
import { MapPin, Calendar, Globe, User } from "lucide-react";
import Link from "next/link";

const formatEventDate = (start: string | Date, end: string | Date): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString("en-GB", options);
  } else {
    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      return `${startDate.getDate()}–${endDate.getDate()} ${startDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
    } else {
      return `${startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${endDate.toLocaleDateString("en-GB", options)}`;
    }
  }
};

const RejectCard = ({ event }: { event: EventDTO }) => {
  const { title, slug, category, mode, startDate, endDate, status, organizer } =
    event;
  return (
    <article className="event-card bg-card text-foreground space-y-2 border border-border rounded-xl p-5 flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300">
      <div>
        <div className="flex justify-between items-center">
          <p className="text-primary text-xs md:text-[15px] font-bold">
            {category.name}
          </p>
          <button className="cursor-pointer text-xs px-4 py-1 bg-muted text-muted-foreground rounded-md ">
            {status}
          </button>
        </div>
        <h4 className="text-xs md:text-lg font-bold">{title}</h4>
      </div>
      <div className="space-y-2 text-muted-foreground">
        <div className="flex items-center gap-2 ">
          <User className="w-3 h-3 md:w-4 md:h-4" />
          <p className="text-xs md:text-[16px]">{organizer.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 md:w-4 md:h-4" />
          <p className="text-xs md:text-[16px]">
            {formatEventDate(startDate, endDate)}
          </p>
        </div>
        <div>
          {mode === "online" ? (
            <div className="flex items-center gap-2">
              <Globe className="w-3 h-3 md:w-4 md:h-4" />
              <p className="text-xs md:text-[16px]">Online Event</p>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <MapPin className="w-3 h-3 md:w-4 md:h-4" />
              <p className="text-xs md:text-[16px]">Offline Event</p>
            </div>
          )}
        </div>
      </div>
      <footer className="mt-auto space-y-2">
        <hr className="border-border opacity-30 mb-2" />
        <div className="flex justify-center">
          <Link
            href={`/events/${slug}`}
            className="cursor-pointer bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-center rounded-lg px-10 py-1 text-xs md:text-[15px] font-medium"
          >
            View Details
          </Link>
        </div>
      </footer>
    </article>
  );
};

export default RejectCard;
