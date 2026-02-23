"use client";
import React, { useState } from "react";
import { EventDTO } from "@/types/types";
import {
  MapPin,
  Users,
  Calendar,
  Globe,
  User,
  Eye,
  X,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { getEventRegistrations } from "@/utilities/server/eventActions";

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

interface Guest {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

const PublishCard = ({ event }: { event: EventDTO }) => {
  const [showModal, setShowModal] = useState(false);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingGuests, setLoadingGuests] = useState(false);

  const {
    _id,
    title,
    slug,
    category,
    mode,
    startDate,
    endDate,
    status,
    organizer,
    registrationsCount,
  } = event;

  const handleOpenGuests = async () => {
    setShowModal(true);
    if (guests.length === 0) {
      setLoadingGuests(true);
      try {
        const fetchedGuests = await getEventRegistrations(_id);
        setGuests(fetchedGuests as Guest[]);
      } catch (error: unknown) {
        console.error("Failed to fetch guests", error);
        toast.error("Failed to load guest list.");
      } finally {
        setLoadingGuests(false);
      }
    }
  };

  return (
    <>
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
          <h4 className="text-sm md:text-lg font-bold">{title}</h4>
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
          <div className="flex items-center gap-2 ">
            <Users className="w-3 h-3 md:w-4 md:h-4" />
            <p className="text-xs md:text-[16px]">
              {registrationsCount} Registrations
            </p>
          </div>
        </div>
        <footer className="mt-auto space-y-2">
          <hr className="border-border opacity-30 mb-2" />
          <div className="grid grid-cols-[repeat(5,1fr)] grid-rows-[repeat(1,1fr)] gap-2">
            <Link
              href={`/events/${slug}`}
              className="cursor-pointer row-start-1 row-end-2 col-start-1 col-end-4 text-primary bg-primary/10 hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-center rounded-lg flex gap-2 justify-center items-center text-xs md:text-[16px]"
            >
              <Eye className="h-3 md:h-4 w-3 md:w-4" />
              <span>Details</span>
            </Link>
            <button
              onClick={handleOpenGuests}
              className="cursor-pointer row-start-1 row-end-2 col-start-4 col-end-6 flex justify-center items-center gap-2 bg-muted text-muted-foreground hover:bg-muted/80 transition-colors rounded-lg py-1 px-3 text-xs md:text-[16px]"
            >
              <Users className="h-3 md:h-4 w-3 md:w-4" />
              <span>Guests</span>
            </button>
          </div>
        </footer>
      </article>

      {/* Guests Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-card text-card-foreground border border-border w-full max-w-lg rounded-xl shadow-2xl flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Registered Guests
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-muted-foreground hover:text-foreground bg-muted/50 hover:bg-muted p-1.5 rounded-md transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto flex-1">
              {loadingGuests ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
                  <p>Loading guest list...</p>
                </div>
              ) : guests.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-lg border border-dashed border-border/50">
                  <p>No one has registered for this event yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {guests.map((guest, idx) => (
                    <div
                      key={guest._id}
                      className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border/50 transition-colors hover:bg-muted/50"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                        {guest.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {guest.user.name}
                        </p>
                        <p
                          className="text-xs text-muted-foreground truncate"
                          title={guest.user.email}
                        >
                          {guest.user.email}
                        </p>
                      </div>
                      <div className="text-[10px] text-muted-foreground text-right shrink-0">
                        <span className="block">#{idx + 1}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PublishCard;
