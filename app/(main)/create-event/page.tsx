import { requireAuth } from "@/lib/auth-guards";
import { redirect } from "next/navigation";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/user.model";
import OrganizerRequest from "@/components/createEvent/OrganizerRequest";

export const dynamic = "force-dynamic";

export default async function CreateEventPage() {
  const session = await requireAuth();

  if (!session?.user?.id) {
    redirect("/signIn");
  }

  await connectDb();
  const dbUser = await UserModel.findById(session.user.id);

  if (!dbUser) {
    redirect("/signIn");
  }

  return (
    <div className="min-h-screen bg-muted/30 pt-25 pb-10 px-4 sm:px-6 lg:px-8">
      <OrganizerRequest
        userId={dbUser._id.toString()}
        status={
          dbUser.role === "organizer" || dbUser.role === "admin"
            ? "approved"
            : dbUser.organizerStatus || "none"
        }
      />
    </div>
  );
}
