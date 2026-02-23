"use client";

import React, { useState } from "react";
import { EventDTO } from "@/types/types";
import EventCard from "@/components/EventCard";
import { motion } from "framer-motion";
import { CalendarOff } from "lucide-react";

interface MyEventTabProps {
  events: EventDTO[];
}

export const MyEventTab = ({ events }: MyEventTabProps) => {
  type TabType = EventDTO["status"] | "completed";
  const [activeTab, setActiveTab] = useState<TabType>("published");

  const tabs: { label: string; value: TabType }[] = [
    { label: "Draft", value: "draft" },
    { label: "Published", value: "published" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Rejected", value: "rejected" },
  ];

  const isEventCompleted = (event: EventDTO) => {
    return (
      event.status === "published" &&
      new Date(event.endDate).getTime() < new Date().getTime()
    );
  };

  const filteredEvents = events.filter((event) => {
    if (activeTab === "completed") {
      return isEventCompleted(event);
    }
    if (activeTab === "published") {
      return event.status === "published" && !isEventCompleted(event);
    }
    return event.status === activeTab;
  });

  const getStatusCount = (status: TabType) => {
    if (status === "completed") {
      return events.filter(isEventCompleted).length;
    }
    if (status === "published") {
      return events.filter(
        (e) => e.status === "published" && !isEventCompleted(e),
      ).length;
    }
    return events.filter((e) => e.status === status).length;
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-around gap-x-8 gap-y-4 mb-8">
        {tabs.map((tab) => {
          const count = getStatusCount(tab.value);
          // if (count === 0 && activeTab !== tab.value) return null; // Optional: hide empty tabs if not active

          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`cursor-pointer relative pb-3 text-sm font-medium transition-colors ${
                activeTab === tab.value
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              } flex items-center gap-2`}
            >
              {tab.label}
              <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                {count}
              </span>
              {activeTab === tab.value && (
                <motion.span
                  layoutId="my-event-tab-underline"
                  className="absolute left-0 right-0 bottom-0 h-[2px] bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="min-h-[300px]">
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <EventCard key={event._id} event={event} variant="organizing" />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/20 border border-dashed border-border rounded-xl h-full">
            <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
              <CalendarOff className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium text-center">
              No {activeTab} events found.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
