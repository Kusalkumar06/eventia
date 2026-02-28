import { requireAuth } from "@/lib/auth-guards";
import {
  getMyEventsData,
  getOrganizerRecentActivity,
} from "@/utilities/server/myEventsActions";
import { StatsCard } from "@/components/my-events/StatsCard";
import { Megaphone, Users, Activity, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const dynamic = "force-dynamic";

const getActionConfig = (action: string) => {
  switch (action) {
    case "EVENT_CREATED":
      return {
        badge:
          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        label: "Created",
      };
    case "EVENT_UPDATED":
      return {
        badge:
          "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
        label: "Updated",
      };
    case "EVENT_DELETED":
      return {
        badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        label: "Deleted",
      };
    case "EVENT_PUBLISHED":
      return {
        badge:
          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
        label: "Published",
      };
    case "EVENT_REJECTED":
      return {
        badge: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
        label: "Rejected",
      };
    case "EVENT_REGISTERED":
      return {
        badge:
          "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
        label: "Registered",
      };
    case "EVENT_UNREGISTERED":
      return {
        badge: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
        label: "Unregistered",
      };
    default:
      return { badge: "bg-muted text-muted-foreground", label: action };
  }
};

export default async function OrganizerDashboardPage() {
  const session = await requireAuth();

  const [{ organizing }, recentActivities] = await Promise.all([
    getMyEventsData(),
    getOrganizerRecentActivity(session.user.id),
  ]);

  const organizingCount = organizing.length;

  const totalRegistrations = organizing.reduce(
    (acc: number, event: { registrationsCount?: number }) =>
      acc + (event.registrationsCount || 0),
    0,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here&apos;s an overview of the events you&apos;re
          organizing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
          <StatsCard
            label="Total Events Organized"
            count={organizingCount}
            icon={Megaphone}
            colorClass="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          />
          <StatsCard
            label="Total Registrations"
            count={totalRegistrations}
            icon={Users}
            colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          />
        </div>
      </div>

      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Recent Activity</h3>
          </div>
        </div>

        <div className="divide-y divide-border">
          {recentActivities.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No recent activity found for your events.
            </div>
          ) : (
            recentActivities.map((activity) => {
              const config = getActionConfig(activity.action);
              return (
                <div
                  key={activity._id as string}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/10"
                >
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      <span className="font-semibold text-foreground mr-1">
                        {activity.actor?.name}
                      </span>
                      <span className="text-muted-foreground font-normal">
                        {activity.message}
                      </span>
                    </p>
                    <p className="text-xs text-muted-foreground flex items-center mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(activity.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  <div className="shrink-0 flex sm:justify-end">
                    <span
                      className={`text-[10px] px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider ${config.badge}`}
                    >
                      {config.label}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
