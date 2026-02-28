"use client";

import { useState } from "react";
import { OrganizerRequestDTO } from "@/utilities/server/adminOrganizerActions";
import { updateOrganizerStatus } from "@/utilities/services/adminOrganizerActions";
import { toast } from "sonner";
import { UserCheck, UserX, UserMinus } from "lucide-react";
import { format } from "date-fns";

export default function OrganizerRequestList({
  initialRequests,
}: {
  initialRequests: OrganizerRequestDTO[];
}) {
  const [requests, setRequests] =
    useState<OrganizerRequestDTO[]>(initialRequests);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (userId: string, action: "approve" | "reject") => {
    setProcessingId(userId);
    try {
      const result = await updateOrganizerStatus(userId, action);
      if (result.success) {
        setRequests(requests.filter((r) => r._id !== userId));
        toast.success(`Request ${action}d successfully`);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setProcessingId(null);
    }
  };

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed rounded-xl bg-muted/20">
        <UserMinus className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="text-xl font-bold">No Pending Requests</h3>
        <p className="text-muted-foreground mt-2">
          There are currently no users waiting for organizer approval.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-muted-foreground uppercase bg-muted/40">
          <tr>
            <th className="px-6 py-4 font-medium">Name</th>
            <th className="px-6 py-4 font-medium">Email</th>
            <th className="px-6 py-4 font-medium w-64 hidden md:table-cell">
              Reason
            </th>
            <th className="px-6 py-4 font-medium">Requested On</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {requests.map((request) => (
            <tr
              key={request._id}
              className="bg-card hover:bg-muted/10 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-foreground">
                {request.name}
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {request.email}
              </td>
              <td
                className="px-6 py-4 text-muted-foreground max-w-xs truncate hidden md:table-cell"
                title={request.reason}
              >
                {request.reason}
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {format(new Date(request.createdAt), "MMM d, yyyy")}
              </td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  className="bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 hover:text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3"
                  onClick={() => handleAction(request._id, "approve")}
                  disabled={processingId === request._id}
                >
                  <UserCheck className="w-4 h-4 mr-2" />
                  Approve
                </button>
                <button
                  className="bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-9 px-3"
                  onClick={() => handleAction(request._id, "reject")}
                  disabled={processingId === request._id}
                >
                  <UserX className="w-4 h-4 mr-2" />
                  Reject
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
