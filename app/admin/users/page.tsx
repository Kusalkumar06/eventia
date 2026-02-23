import { getAdminUsersMetrics } from "@/utilities/server/userActions";
import UserCard from "@/components/admin/UserCard";
import { UsersIcon, Search } from "lucide-react";
import { requireAdmin } from "@/lib/auth-guards";

export const metadata = {
  title: "User Management | Admin",
  description: "View and manage all registered users.",
};

export default async function UsersPage() {
  await requireAdmin();

  const users = await getAdminUsersMetrics();

  return (
    <div className="flex-1 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Users Management
          </h2>
          <p className="text-muted-foreground">
            Overview of all {users.length} registered members, their roles, and
            activity.
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg border border-border mt-8">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <UsersIcon className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No users found</h3>
          <p className="text-muted-foreground text-sm mt-1 text-center max-w-sm">
            There are currently no registered users in the platform.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {users.map((user) => (
            <UserCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
}
