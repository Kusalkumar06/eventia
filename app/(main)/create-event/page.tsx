import { requireAuth } from "@/lib/auth-guards";
import { redirect } from "next/navigation";
import { getCategories } from "@/utilities/server/categoryActions";
import EventForm from "../../../components/createEvent/EventForm";

export const dynamic = "force-dynamic";

export default async function CreateEventPage() {
  const session = await requireAuth();

  if (!session?.user?.id) {
    redirect("/signIn");
  }

  // Fetch active categories using the cached server action
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-muted/30 pt-25 pb-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Create Event
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Fill out the details below to host a new event on Eventia.
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden p-6 sm:p-8">
          <EventForm categories={categories} />
        </div>
      </div>
    </div>
  );
}
