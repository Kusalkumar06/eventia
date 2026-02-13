import Link from "next/link";
import {
  Calendar,
  MapPin,
  Landmark,
  Users,
  Clock,
  SquareArrowOutUpRight,
  CircleDot,
} from "lucide-react";
// format helper for dates
const formatEventDate = (start: string | Date, end: string | Date): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Format options: 12 March 2026
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

import { EventDTO } from "@/app/lib/types";

const EventCard = ({ event }: { event: EventDTO }) => {
  const {
    title,
    slug,
    shortDescription,
    category,
    otherCategoryLabel,
    mode,
    startDate,
    endDate,
    location,
    maxRegistrations,
    registrationsCount,
    isRegistrationRequired,
  } = event;

  const remainingSlots = isRegistrationRequired
    ? Math.max(0, (maxRegistrations ?? 0) - registrationsCount)
    : null;

  const stripTime = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const today = stripTime(new Date());
  const start = stripTime(new Date(startDate));
  const end = stripTime(new Date(endDate));

  let eventLabel: string;

  if (today < start) {
    const daysLeft = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
    eventLabel = daysLeft === 1 ? "1 day left" : `${daysLeft} days left`;
  } else if (today > end) {
    eventLabel = "Completed";
  } else {
    eventLabel = "Happening Today";
  }

  const categoryDisplay = category.name;
  const isCompleted = eventLabel === "Completed";

  return (
    <article className="event-card bg-card text-foreground border border-border rounded-xl p-5 flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-5">
        <h3 className="text-lg font-semibold">{title}</h3>

        <span className="text-sm bg-primary text-primary-foreground px-4 py-1 rounded-lg">
          {categoryDisplay}
        </span>
      </div>

      {/* MODE */}
      <div className="flex items-center gap-5 mt-3">
        <div className="flex items-center gap-1 text-muted-foreground">
          <CircleDot className="w-3 h-3" />
          <p className="capitalize text-sm">{mode}</p>
        </div>

        <button
          className="
        bg-primary
        text-primary-foreground
        px-4 py-1
        text-xs
        rounded-lg
        hover:bg-primary/90
        transition
      "
        >
          Verified
        </button>
      </div>

      {/* DESCRIPTION */}
      <div className="my-5">
        <p className="text-sm text-muted-foreground">{shortDescription}</p>
      </div>

      {/* DETAILS */}
      <div className="space-y-3 my-2 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <p>{formatEventDate(startDate, endDate)}</p>
        </div>

        {mode === "offline" ? (
          <>
            <div className="flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              <p>{location?.venue}</p>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <p>
                {location?.city}, {location?.state}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <CircleDot className="w-4 h-4" />
            <p>Online Event</p>
          </div>
        )}

        {!isCompleted && (
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <p>
              Slots:{" "}
              <span
                className={`font-semibold ${
                  remainingSlots === 0 ? "text-primary" : "text-foreground"
                }`}
              >
                {!isRegistrationRequired
                  ? "Unlimited"
                  : remainingSlots === 0
                    ? "Sold Out"
                    : `${remainingSlots} Available / ${maxRegistrations}`}
              </span>
            </p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="mt-auto">
        {/* you don't have border-border/30, so do it correctly */}
        <hr className="border-border opacity-30 mb-2" />

        <div className="text-muted-foreground mb-2">
          <p className="text-sm text-right">Organized by KusalKumar</p>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <p>{eventLabel}</p>
          </div>

          <Link
            href={`/events/${slug}`}
            className="
          bg-primary
          text-primary-foreground
          px-5 py-1
          rounded-lg
          flex items-center gap-2
          hover:bg-primary/90
          transition
        "
          >
            <SquareArrowOutUpRight className="w-4 h-4" />
            <p>View Details</p>
          </Link>
        </div>
      </footer>
    </article>
  );
};

export default EventCard;
