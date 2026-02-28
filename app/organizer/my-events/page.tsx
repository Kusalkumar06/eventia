import { getMyEventsData } from "@/utilities/server/myEventsActions";
import { MyEventTab } from "@/components/my-events/MyEventTab";
import { CalendarOff } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function OrganizerEventsPage() {
  const { organizing } = await getMyEventsData();
  const organizingCount = organizing.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          My Events
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Manage and track all the events you are organizing across different
          statuses.
        </p>
      </div>

      <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm p-6 sm:p-8">
        {organizingCount === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-muted/20 border border-dashed border-border rounded-xl">
            <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
              <CalendarOff className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium text-center">
              You are not organizing any events yet. Create one to get started!
            </p>
          </div>
        ) : (
          <MyEventTab events={organizing} />
        )}
      </div>
    </div>
  );
}
