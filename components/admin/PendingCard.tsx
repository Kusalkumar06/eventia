"use client";
import { useState } from "react";
import { EventDTO } from "@/types/types";
import { MapPin, User, Calendar, Globe, Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { useTransition } from "react";
import {
  publishEventAction,
  rejectEventAction,
} from "@/utilities/services/eventActions";

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

  const [isLoading, setIsLoading] = useState(false);

  const [, startTransition] = useTransition();

  const handlePublish = async () => {
    setIsLoading(true);
    startTransition(async () => {
      try {
        const res = await publishEventAction(event._id);
        if (!res.success)
          throw new Error(res.error || "Failed strictly to publish event");
        toast.success("Event successfully published!");
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Failed to publish event.",
        );
      } finally {
        setIsLoading(false);
      }
    });
  };

  const handleReject = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const reason = prompt("Enter rejection reason:");
    if (!reason) return;

    setIsLoading(true);
    startTransition(async () => {
      try {
        const res = await rejectEventAction(event._id, reason);
        if (!res.success)
          throw new Error(res.error || "Failed strictly to reject event");
        toast.success("Event successfully rejected!");
      } catch (error: unknown) {
        toast.error(
          error instanceof Error ? error.message : "Failed to reject event.",
        );
      } finally {
        setIsLoading(false);
      }
    });
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
            className="cursor-pointer row-start-1 row-end-2 col-start-1 col-end-4 bg-primary/10 text-primary text-center rounded-lg py-1 text-xs md:text-[16px] hover:bg-primary hover:text-primary-foreground transition-all duration-300"
          >
            View Details
          </Link>
          <button
            onClick={handlePublish}
            disabled={isLoading}
            className="cursor-pointer row-start-1 row-end-2 col-start-4 col-end-5 border bg-background text-center text-green-500 rounded-lg py-1 flex justify-center items-center hover:bg-green-50 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
            ) : (
              <Check className="h-3 w-3 md:h-4 md:w-4" />
            )}
          </button>
          <button
            onClick={handleReject}
            disabled={isLoading}
            className="cursor-pointer row-start-1 row-end-2 col-start-5 col-end-6 border bg-background text-center text-red-600 rounded-lg py-1 flex justify-center items-center hover:bg-red-50 disabled:opacity-50 transition-colors"
          >
            {isLoading ? (
              <Loader2 className="h-3 w-3 md:h-4 md:w-4 animate-spin" />
            ) : (
              <X className="h-3 w-3 md:h-4 md:w-4" />
            )}
          </button>
        </div>
      </footer>
    </article>
  );
};

export default PendingCard;
