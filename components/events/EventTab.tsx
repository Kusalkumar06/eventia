"use client";
import EventCard from "@/components/EventCard";
import { EventDTO } from "@/types/types";
import { useState } from "react";
import { motion } from "framer-motion";

const EventTab = ({ events }: { events: EventDTO[] }) => {
  const [activeTab, setActiveTab] = useState<string>("upcoming");

  const tabs: { label: string; value: string }[] = [
    {
      label: "Recent",
      value: "recent",
    },
    {
      label: "Ongoing",
      value: "ongoing",
    },
    {
      label: "Upcoming",
      value: "upcoming",
    },
  ];

  const stripTime = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

  const today = stripTime(new Date());

  const filteredEvents = events.filter((event: EventDTO) => {
    const start = stripTime(new Date(event.startDate));
    const end = stripTime(new Date(event.endDate));

    switch (activeTab) {
      case "ongoing":
        return start <= today && end >= today;

      case "recent":
        return end < today;

      case "upcoming":
        return start > today;

      default:
        return false;
    }
  });
  return (
    <div>
      <div className="flex justify-center gap-20 my-15">
        {tabs.map((each: { label: string; value: string }) => {
          return (
            <button
              key={each.value}
              onClick={() => setActiveTab(each.value)}
              className={`relative pb-3 text-lg font-medium transition-colors ${activeTab === each.value ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {each.label}
              {activeTab === each.value && (
                <motion.span
                  layoutId="tab-underline"
                  className="absolute left-0 right-0 bottom-0 h-[3px] bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
      <div className="cards-wrapper grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-15 px-4 md:px-10 lg:px-15 transition-all duration-300">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event: EventDTO) => (
            <EventCard key={event._id.toString()} event={event} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No events found
          </p>
        )}
      </div>
    </div>
  );
};

export default EventTab;
