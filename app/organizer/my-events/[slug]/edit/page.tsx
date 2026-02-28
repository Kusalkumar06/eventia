import { requireAuth } from "@/lib/auth-guards";
import { getEventsBySlug } from "@/utilities/server/eventActions";
import { getCategories } from "@/utilities/server/categoryActions";
import EventForm from "@/components/createEvent/EventForm";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const session = await requireAuth();

  const resolvedParams = await params;
  let eventData;
  let categories;

  try {
    const [fetchedEvent, fetchedCategories] = await Promise.all([
      getEventsBySlug(resolvedParams.slug),
      getCategories(),
    ]);
    eventData = fetchedEvent;
    categories = fetchedCategories;
  } catch (error) {
    console.error("Error loading edit page:", error);
    redirect("/organizer/my-events");
  }

  if (!eventData) {
    redirect("/organizer/my-events");
  }

  if (
    eventData.organizer._id !== session.user.id &&
    session.user.role !== "admin"
  ) {
    redirect("/organizer/my-events");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Event
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Update the details for &quot;{eventData.title}&quot;.
        </p>
      </div>

      <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden p-6 sm:p-8 max-w-4xl">
        <EventForm initialData={eventData} categories={categories} />
      </div>
    </div>
  );
}
