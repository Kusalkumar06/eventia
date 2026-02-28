import { getPendingOrganizerRequests } from "@/utilities/server/adminOrganizerActions";
import OrganizerRequestList from "../../../../components/admin/OrganizerRequestList";

export const dynamic = "force-dynamic";

export default async function AdminOrganizerRequestsPage() {
  const requests = await getPendingOrganizerRequests();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Organizer Requests
        </h1>
        <p className="text-muted-foreground mt-2">
          Review and approve requests from users who want to organize events.
        </p>
      </div>

      <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden p-6">
        <OrganizerRequestList initialRequests={requests} />
      </div>
    </div>
  );
}
