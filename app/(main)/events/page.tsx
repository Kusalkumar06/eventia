import FilterComponent from "@/components/events/FilterComponent";
import EventTab from "@/components/events/EventTab";

import { getEvents } from "@/utilities/server/eventActions";

type HomeProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const Events = async ({ searchParams }: HomeProps) => {
  const params = await searchParams;

  const selectedCategory = params.category ?? "all";

  const events = await getEvents({
    category: selectedCategory === "all" ? undefined : selectedCategory,
  });

  return (
    <div>
      <div className="text-center py-15">
        <h1 className="text-4xl font-bold">Explore Events</h1>
        <p className="text-lg text-gray-500">
          Find events that match your interests and availability
        </p>
      </div>
      <div className="px-18 rounded-md">
        <FilterComponent selectedCategory={selectedCategory} />
      </div>

      <div>
        <EventTab events={events} />
      </div>
    </div>
  );
};

export default Events;
