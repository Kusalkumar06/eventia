import FilterComponent from "@/components/FilterComponent";
import EventCard from "@/components/EventCard";

type HomeProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
};

async function getEvents(search?: string, category?: string) {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category && category !== "all") params.set("category", category);

  const baseUrl =
    process.env.SITE_URL ?? "http://localhost:3000";

  const res = await fetch(
    `${baseUrl}/api/events?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch events");
  }

  return res.json();
}

const Events = async ({ searchParams }: HomeProps) => {
  const params = await searchParams;

  const search = params.search ?? "";
  const selectedCategory = params.category ?? "all";

  const events = await getEvents(search, selectedCategory);

  return (
    <div>
      <div className="px-18 rounded-md">
        <FilterComponent
          search={search}
          selectedCategory={selectedCategory}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {events.length > 0 ? (
          events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <p className="text-center text-gray-500">
            No events found
          </p>
        )}
      </div>
    </div>
  );
};

export default Events;
