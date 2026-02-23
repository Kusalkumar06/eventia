import { requireAuth } from "@/lib/auth-guards";
import { notFound, redirect } from "next/navigation";
import { connectDb } from "@/lib/db";
import { CategoryModel } from "@/models/category.model";
import { getEventsBySlug } from "@/utilities/server/eventActions";
import EventForm from "@/components/createEvent/EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const session = await requireAuth();

  if (!session?.user?.id) {
    redirect("/signIn");
  }

  const { slug } = await props.params;
  const event = await getEventsBySlug(slug);

  if (!event) {
    notFound();
  }

  const isOrganizer = event.organizer._id.toString() === session.user.id;
  const isAdmin = session.user.role === "admin";

  if (!isOrganizer && !isAdmin) {
    redirect("/my-events");
  }

  await connectDb();

  const categories = await CategoryModel.find({ isActive: true })
    .select("_id name slug")
    .sort({ name: 1 })
    .lean();

  const serializedCategories = categories.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
  }));

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Edit Event
          </h1>
          <p className="text-muted-foreground mt-2 text-sm sm:text-base">
            Update the details of your event below. Resubmitting a rejected
            event resets it to draft.
          </p>
        </div>

        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden p-6 sm:p-8">
          <EventForm categories={serializedCategories} initialData={event} />
        </div>
      </div>
    </div>
  );
}
