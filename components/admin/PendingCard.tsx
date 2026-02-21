"use client";
import { EventDTO } from "@/types/types";
import { MapPin, User, Calendar, Globe, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

const PendingCard = ({ event }: { event: EventDTO }) => {
  const { title, slug, category, mode, startDate, endDate, status, organizer } =
    event;

  const router = useRouter();
  const handlePublish = async () => {
    await fetch(`/api/events/${event._id}/publish`, {
      method: "POST",
    });

    router.refresh();
  };

  const handleReject = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    await fetch(`/api/events/${event._id}/reject`, {
      method: "POST",
      body: JSON.stringify({ reason }),
      headers: { "Content-Type": "application/json" },
    });

    router.refresh();
  };

  return (
    <article className="event-card bg-card text-foreground space-y-2 border border-border rounded-xl p-2 md:p-5 flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300">
      <div>
        <div className="flex justify-between items-center">
          <p className="text-primary text-xs md:text-[15px] font-bold">
            {category.name}
          </p>
          <button className="text-xs px-4 py-1 bg-muted text-muted-foreground rounded-md ">
            {status}
          </button>
        </div>
        <h4 className="md:text-lg font-bold">{title}</h4>
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
        <div className="grid grid-cols-[repeat(5,1fr)] grid-rows-[repeat(1,1fr)] gap-2">
          <Link
            href={`/events/${slug}`}
            className="row-start-1 row-end-2 col-start-1 col-end-4 bg-primary/10 text-primary text-center rounded-lg py-1 text-xs md:text-[16px] hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            View Details
          </Link>
          <button
            onClick={handlePublish}
            className="row-start-1 row-end-2 col-start-4 col-end-5 border bg-background text-center text-green-500 rounded-lg py-1 flex justify-center items-center"
          >
            <Check className="h-3 w-3 md:h-4 md:w-4" />
          </button>
          <button
            onClick={handleReject}
            className="row-start-1 row-end-2 col-start-5 col-end-6 border bg-background text-center text-red-600 rounded-lg py-1 flex justify-center items-center"
          >
            <X className="h-3 w-3 md:h-4 md:w-4" />
          </button>
        </div>
      </footer>
    </article>
  );
};

export default PendingCard;
