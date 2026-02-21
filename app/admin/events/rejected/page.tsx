import { EventDTO } from "@/types/types";
import { getRejectedEvents } from "@/utilities/services/eventActions";
import RejectCard from "@/components/admin/RejectCard";
const RejectedPage = async () => {
  const events = await getRejectedEvents();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Rejected Events</h1>

      {events.length === 0 ? (
        <p>No rejected events</p>
      ) : (
        <div className="cards-wrapper grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {events.map((event: EventDTO) => (
            <RejectCard key={event._id.toString()} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default RejectedPage;
