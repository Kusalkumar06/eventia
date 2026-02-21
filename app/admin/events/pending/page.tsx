import { EventDTO } from "@/types/types";
import { getPendingEvents } from "@/utilities/services/eventActions";
import PendingCard from "@/components/admin/PendingCard";

const AdminPage = async () => {
  const events = await getPendingEvents();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pending Events</h1>

      {events.length === 0 ? (
        <p>No pending events</p>
      ) : (
        <div className="cards-wrapper grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-6">
          {events.map((event: EventDTO) => (
            <PendingCard key={event._id.toString()} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
