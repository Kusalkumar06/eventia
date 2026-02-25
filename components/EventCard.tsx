"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Calendar,
  MapPin,
  Landmark,
  Users,
  Clock,
  SquareArrowOutUpRight,
  CircleDot,
  Eye,
  Pencil,
  Ban,
  Trash2,
  XCircle,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { EventDTO } from "@/types/types";
import { StatusBadge } from "./my-events/StatusBadge";
import {
  deleteEventAction,
  cancelEventAction,
} from "@/utilities/services/eventActions";
import { unregisterFromEventAction } from "@/utilities/services/registrationActions";

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

export type EventCardVariant =
  | "public"
  | "organizing"
  | "attending"
  | "attended";

const EventCard = ({
  event,
  variant = "public",
}: {
  event: EventDTO;
  variant?: EventCardVariant;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isUnregistering, setIsUnregistering] = useState(false);
  const {
    title,
    slug,
    shortDescription,
    category,
    organizer,
    mode,
    startDate,
    endDate,
    location,
    maxRegistrations,
    registrationsCount,
    isRegistrationRequired,
    status,
    rejectionReason,
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

  const [, startTransition] = useTransition();

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this event? This action cannot be undone.",
      )
    )
      return;

    setIsDeleting(true);
    startTransition(async () => {
      try {
        const res = await deleteEventAction(event._id);
        if (!res.success)
          throw new Error(res.error || "Failed to delete event");
        toast.success("Event deleted successfully");
      } catch (error: unknown) {
        console.error("Delete failed", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to delete event.",
        );
      } finally {
        setIsDeleting(false);
      }
    });
  };

  const handleUnregister = async () => {
    if (!window.confirm("Are you sure you want to unregister from this event?"))
      return;

    setIsUnregistering(true);
    startTransition(async () => {
      try {
        const res = await unregisterFromEventAction(event._id);
        if (!res.success) {
          throw new Error(res.error || "Failed to unregister");
        }
        toast.success("Successfully unregistered");
      } catch (error: unknown) {
        console.error("Unregister failed", error);
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to unregister from event.",
        );
      } finally {
        setIsUnregistering(false);
      }
    });
  };

  const handleCancelEvent = async () => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this event? This action cannot be undone.",
      )
    )
      return;

    setIsCancelling(true);
    startTransition(async () => {
      try {
        const res = await cancelEventAction(event._id);
        if (!res.success)
          throw new Error(res.error || "Failed to cancel event");
        toast.success("Event cancelled successfully");
      } catch (error: unknown) {
        console.error("Cancel failed", error);
        toast.error(
          error instanceof Error ? error.message : "Failed to cancel event.",
        );
      } finally {
        setIsCancelling(false);
      }
    });
  };

  if (variant === "attending" || variant === "attended") {
    return (
      <article className="event-card bg-card text-foreground border border-border rounded-xl p-5 flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300">
        <div className="flex items-center justify-between gap-5">
          <h3 className="text-lg font-semibold truncate" title={title}>
            {title}
          </h3>
          {variant === "attended" && (
            <span className="flex items-center gap-1 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500 px-2 py-0.5 rounded-full text-xs font-medium">
              <CheckCircle2 className="w-3 h-3" />
              Completed
            </span>
          )}
        </div>

        <div className="space-y-3 mt-4 text-muted-foreground grow">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <p className="text-sm">{formatEventDate(startDate, endDate)}</p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <p className="text-sm">Organized by {organizer.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <CircleDot className="w-4 h-4" />
            <p className="text-sm capitalize">{mode} Event</p>
          </div>
        </div>

        {variant === "attending" && (
          <footer className="mt-6 pt-4 border-t border-border/50">
            <button
              onClick={handleUnregister}
              disabled={isUnregistering}
              className="w-full bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-500 dark:hover:bg-red-900/40 px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium disabled:opacity-50 cursor-pointer"
            >
              {isUnregistering ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              {isUnregistering ? "Unregistering..." : "Unregister"}
            </button>
          </footer>
        )}
      </article>
    );
  }

  return (
    <article className="event-card bg-card text-foreground border border-border rounded-xl p-4 md:p-5 flex flex-col h-full shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="flex items-start justify-between gap-3 md:gap-5">
        <h3
          className="text-base md:text-lg font-semibold line-clamp-2"
          title={title}
        >
          {title}
        </h3>

        {variant === "public" ? (
          <span className="text-xs bg-primary text-primary-foreground px-3 md:px-4 py-1 rounded-lg shrink-0">
            {categoryDisplay}
          </span>
        ) : (
          <div className="shrink-0 flex items-center gap-2">
            {status === "rejected" && rejectionReason && (
              <span
                className="text-[10px] md:text-xs max-w-[80px] md:max-w-[120px] truncate text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded w-fit inline-block"
                title={rejectionReason}
              >
                Reason: {rejectionReason}
              </span>
            )}
            <StatusBadge status={status} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 mt-3">
        <div className="flex items-center gap-1 text-muted-foreground">
          <CircleDot className="w-3 h-3" />
          <p className="capitalize text-sm">{mode}</p>
        </div>

        {variant === "organizing" && (
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-md font-medium">
            {categoryDisplay}
          </span>
        )}

        {variant === "public" && (
          <button className="bg-muted text-muted-foreground px-4 py-1 text-xs rounded-lg hover:bg-muted/80 transition cursor-pointer">
            Verified
          </button>
        )}
      </div>

      <div className="my-4 md:my-5 grow">
        <p className="text-xs md:text-sm text-muted-foreground line-clamp-2">
          {shortDescription}
        </p>
      </div>

      <div className="space-y-2 md:space-y-3 my-2 text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 md:w-4 h-3.5 md:h-4" />
          <p className="text-xs md:text-sm">
            {formatEventDate(startDate, endDate)}
          </p>
        </div>

        {mode === "offline" ? (
          <>
            <div className="flex items-center gap-2">
              <Landmark className="w-3.5 md:w-4 h-3.5 md:h-4" />
              <p
                className="text-xs md:text-sm truncate"
                title={location?.venue}
              >
                {location?.venue}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 md:w-4 h-3.5 md:h-4" />
              <p className="text-xs md:text-sm truncate">
                {location?.city}, {location?.state}
              </p>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <CircleDot className="w-3.5 md:w-4 h-3.5 md:h-4" />
            <p className="text-xs md:text-sm">Online Event</p>
          </div>
        )}

        {!isCompleted && variant === "public" && (
          <div className="flex items-center gap-2">
            <Users className="w-3.5 md:w-4 h-3.5 md:h-4" />
            <p className="text-xs md:text-sm">
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

        {variant === "organizing" && (
          <div className="flex items-center gap-2">
            <Users className="w-3.5 md:w-4 h-3.5 md:h-4" />
            <p className="text-xs md:text-sm">
              Registrations:{" "}
              <span className="font-semibold text-foreground">
                {registrationsCount}
              </span>
              {isRegistrationRequired && maxRegistrations && (
                <span className="text-muted-foreground">
                  {" "}
                  / {maxRegistrations}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      <footer className="mt-4 pt-4 border-t border-border/50">
        {variant === "organizing" || variant === "public" ? (
          <div className="flex justify-between items-center text-muted-foreground mb-2">
            <p className="text-[10px] md:text-xs">
              Organized by {organizer.name}
            </p>
          </div>
        ) : null}

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {variant === "organizing" ? (
            <div className="flex items-center gap-2 w-full justify-end">
              <Link
                href={`/events/${slug}`}
                className="cursor-pointer p-2 text-zinc-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                title="View"
              >
                <Eye className="w-4 h-4" />
              </Link>
              {(status === "draft" ||
                status === "published" ||
                (status === "rejected" && today < start)) &&
                !isCompleted && (
                  <Link
                    href={`/events/${slug}/edit`}
                    className="cursor-pointer p-2 text-zinc-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                )}
              {status === "published" && !isCompleted && (
                <button
                  onClick={handleCancelEvent}
                  disabled={isCancelling}
                  className="cursor-pointer p-2 text-zinc-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors disabled:opacity-50"
                  title="Cancel Event"
                >
                  {isCancelling ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Ban className="w-4 h-4" />
                  )}
                </button>
              )}
              {status === "rejected" && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="cursor-pointer p-2 text-zinc-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                  title="Delete"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 text-muted-foreground text-xs md:text-sm">
                <Clock className="w-3.5 md:w-4 h-3.5 md:h-4" />
                <p>{eventLabel}</p>
              </div>

              <Link
                href={`/events/${slug}`}
                className="w-full sm:w-auto cursor-pointer bg-primary/10 text-primary px-4 py-1.5 text-xs md:text-sm rounded-lg flex items-center justify-center gap-2 hover:bg-primary hover:text-primary-foreground transition-all duration-300 font-medium"
              >
                <SquareArrowOutUpRight className="w-4 h-4" />
                <p>View Details</p>
              </Link>
            </>
          )}
        </div>
      </footer>
    </article>
  );
};

export default EventCard;
