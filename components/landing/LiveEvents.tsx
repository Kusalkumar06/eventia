import { getEvents } from "@/utilities/server/eventActions";
import LiveEventsClient from "./LiveEventsClient";

export default async function LiveEvents() {
  const events = await getEvents({ limit: 5 });

  if (events.length === 0) return null;

  return (
    <section className="py-24 bg-background transition-colors duration-300 overflow-hidden">
      <div className="px-6 mb-12 flex items-end justify-between max-w-7xl mx-auto w-full">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Trending <span className="text-primary">Now</span>
          </h2>
        </div>
        <div className="hidden md:block">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
          </span>
        </div>
      </div>

      <LiveEventsClient events={events} />
    </section>
  );
}
