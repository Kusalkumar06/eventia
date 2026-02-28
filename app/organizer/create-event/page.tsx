import { requireAuth } from "@/lib/auth-guards";
import { getCategories } from "@/utilities/server/categoryActions";
import EventForm from "@/components/createEvent/EventForm";

export const dynamic = "force-dynamic";

export default async function OrganizerCreateEventPage() {
  await requireAuth();

  const categories = await getCategories();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create Event
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Fill out the details below to host a new event on Eventia.
        </p>
      </div>

      <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden p-6 sm:p-8 max-w-4xl">
        <EventForm categories={categories} />
      </div>
    </div>
  );
}
