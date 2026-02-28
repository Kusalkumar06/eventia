"use client";

import { revokeOrganizerAccess } from "@/utilities/services/adminOrganizerActions";
import { toast } from "sonner";
import { useState } from "react";
import { UserMinus } from "lucide-react";

export function RevokeAccessButton({ userId }: { userId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRevoke = async () => {
    if (
      !window.confirm(
        "Are you sure you want to revoke this user's organizer privileges?",
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await revokeOrganizerAccess(userId);
      if (result.success) {
        toast.success("Organizer access revoked successfully");
      } else {
        toast.error(result.error || "Failed to revoke access");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleRevoke}
      disabled={isLoading}
      className="text-xs font-medium text-destructive hover:bg-destructive/10 px-2 py-1 rounded flex items-center transition-colors disabled:opacity-50"
      title="Revoke Organizer Access"
    >
      <UserMinus className="w-3.5 h-3.5 mr-1" />
      Revoke Access
    </button>
  );
}
