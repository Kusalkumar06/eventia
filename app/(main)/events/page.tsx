import FilterComponent from "@/components/events/FilterComponent";
import EventTab from "@/components/events/EventTab";

import { getEvents } from "@/utilities/server/eventActions";
import { getCategories } from "@/utilities/server/categoryActions";

type HomeProps = {
  searchParams: Promise<{
    category?: string;
  }>;
};

const Events = async ({ searchParams }: HomeProps) => {
  const params = await searchParams;

  const selectedCategory = params.category ?? "all";

  const [events, categories] = await Promise.all([
    getEvents({
      category: selectedCategory === "all" ? undefined : selectedCategory,
    }),
    getCategories(),
  ]);

  return (
    <div className="pt-20">
      <div className="text-center py-15">
        <h1 className="text-4xl font-bold">Explore Events</h1>
        <p className="text-lg text-gray-500">
          Find events that match your interests and availability
        </p>
      </div>
      <div className="px-4 sm:px-6 lg:px-8 rounded-md">
        <FilterComponent
          selectedCategory={selectedCategory}
          categories={categories}
        />
      </div>

      <div>
        <EventTab events={events} />
      </div>
    </div>
  );
};

export default Events;
