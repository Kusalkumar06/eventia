export const dynamic = "force-dynamic";

import React from "react";
import EventCard from "@/components/EventCard";
import { SectionHeader } from "@/components/my-events/SectionHeader";
import { StatsCard } from "@/components/my-events/StatsCard";
// MyEventTab is no longer utilized since organizing content is removed.
import { EventDTO } from "@/types/types";
import {
  CalendarCheck,
  CalendarOff,
  LucideIcon,
  CheckSquare,
} from "lucide-react";
import { getMyEventsData } from "@/utilities/server/myEventsActions";

const EmptyState = ({
  message,
  icon: Icon,
}: {
  message: string;
  icon: LucideIcon;
}) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/20 border border-dashed border-border rounded-xl">
    <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
      <Icon className="w-8 h-8 text-muted-foreground" />
    </div>
    <p className="text-muted-foreground font-medium text-center">{message}</p>
  </div>
);

const MyEventsPage = async () => {
  const { attending, attended } = await getMyEventsData();

  const attendingCount = attending.length;
  const attendedCount = attended.length;

  return (
    <div className="min-h-screen bg-background pb-20 pt-20">
      {/* SaaS Dashboard Header */}
      <header className="border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Events
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Events you are participating in.
          </p>

          <div className="flex gap-4 mt-8 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <StatsCard
                label="Attending"
                count={attendingCount}
                icon={CalendarCheck}
                colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              />
            </div>
            <div className="flex-1 min-w-[200px]">
              <StatsCard
                label="Attended"
                count={attendedCount}
                icon={CheckSquare}
                colorClass="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Section 2: Attending */}
        <section>
          <SectionHeader title="Attending (Upcoming)" count={attendingCount} />

          {attendingCount === 0 ? (
            <EmptyState
              message="You are not attending any upcoming events."
              icon={CalendarOff}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attending.map((event: EventDTO) => (
                <EventCard key={event._id} event={event} variant="attending" />
              ))}
            </div>
          )}
        </section>

        {/* Section 3: Attended */}
        <section>
          <SectionHeader title="Attended (Past)" count={attendedCount} />

          {attendedCount === 0 ? (
            <EmptyState
              message="You haven't attended any events yet."
              icon={CheckSquare}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {attended.map((event: EventDTO) => (
                <EventCard key={event._id} event={event} variant="attended" />
              ))}
            </div>
          )}
        </section>


      </main>
    </div>
  );
};

export default MyEventsPage;
