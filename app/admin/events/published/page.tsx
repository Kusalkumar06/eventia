import { EventDTO } from "@/types/types";
import { getPublishedEvents } from "@/utilities/server/eventActions";
import PublishCard from "@/components/admin/PublishCard";

const PublishedPage = async () => {
  const events = await getPublishedEvents();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Published Events</h1>

      {events.length === 0 ? (
        <p>No published events</p>
      ) : (
        <div className="cards-wrapper grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {events.map((event: EventDTO) => (
            <PublishCard key={event._id.toString()} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PublishedPage;
