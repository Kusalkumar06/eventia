import FilterComponent from "@/components/FilterComponent";
import EventTab from "@/components/EventTab";
import { EventDTO } from "@/app/lib/types";

type HomeProps = {
  searchParams: Promise<{
    search?: string;
    category?: string;
  }>;
};

async function getEvents(
  search?: string,
  category?: string,
): Promise<EventDTO[]> {
  const params = new URLSearchParams();

  if (search) params.set("search", search);
  if (category && category !== "all") params.set("category", category);

  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/events?${params.toString()}`, {
    cache: "no-store",
  });

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
      <div className="text-center py-15">
        <h1 className="text-4xl font-bold">Explore Events</h1>
        <p className="text-lg text-gray-500">
          Find events that match your interests and availability
        </p>
      </div>
      <div className="px-18 rounded-md">
        <FilterComponent search={search} selectedCategory={selectedCategory} />
      </div>

      <div>
        <EventTab events={events} />
      </div>
    </div>
  );
};

export default Events;
