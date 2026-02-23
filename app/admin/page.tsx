import { requireAdmin } from "@/lib/auth-guards";
import { connectDb } from "@/lib/db";
import { EventModel } from "@/models/event.model";
import { UserModel } from "@/models/user.model";
import { ActivityModel } from "@/models/activity.model";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Users,
  XCircle,
  Activity,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const metadata = {
  title: "Dashboard | Admin",
  description: "Eventia Admin Dashboard and Activity Log.",
};

interface PopulatedActivity {
  _id: string | number | boolean | object | null | undefined;
  action: string;
  message: string;
  createdAt: Date | string;
  actor?: {
    name: string;
    email: string;
  };
}

export default async function AdminDashboardPage() {
  await requireAdmin();
  await connectDb();

  const [
    totalEvents,
    pendingEvents,
    publishedEvents,
    rejectedEvents,
    totalUsers,
    recentActivitiesRaw,
  ] = await Promise.all([
    EventModel.countDocuments(),
    EventModel.countDocuments({ status: "draft" }),
    EventModel.countDocuments({ status: "published" }),
    EventModel.countDocuments({ status: "rejected" }),
    UserModel.countDocuments(),
    ActivityModel.find()
      .populate("actor", "name email")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean() as unknown as Promise<PopulatedActivity[]>,
  ]);

  const recentActivities = recentActivitiesRaw.map((act) => ({
    _id: act._id?.toString(),
    action: act.action,
    message: act.message,
    createdAt:
      act.createdAt instanceof Date
        ? act.createdAt.toISOString()
        : act.createdAt,
    actor: act.actor
      ? {
          name: act.actor.name,
          email: act.actor.email,
        }
      : { name: "System", email: "" },
  }));

  const stats = [
    {
      title: "Total Events",
      value: totalEvents,
      icon: CalendarDays,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      title: "Pending Events",
      value: pendingEvents,
      icon: Clock,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      title: "Published Events",
      value: publishedEvents,
      icon: CheckCircle2,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      title: "Rejected Events",
      value: rejectedEvents,
      icon: XCircle,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

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
          badge:
            "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
          label: "Unregistered",
        };
      default:
        return { badge: "bg-muted text-muted-foreground", label: action };
    }
  };

  return (
    <div className="flex-1 space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          Dashboard Overview
        </h2>
        <p className="text-muted-foreground">
          System-wide metrics and recent activity across the platform.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-card text-card-foreground rounded-xl border border-border p-6 shadow-sm flex flex-col items-center sm:items-start transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </span>
              <div className={`p-2 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </div>
            <div className="text-3xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Recent Activity</h3>
          </div>
          <button
            className="text-sm font-medium text-primary hover:underline"
            disabled
          >
            View All Activity
          </button>
        </div>

        <div className="divide-y divide-border">
          {recentActivities.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No recent activity found. Operations will appear here.
            </div>
          ) : (
            recentActivities.map((activity) => {
              const config = getActionConfig(activity.action);
              return (
                <div
                  key={activity._id}
                  className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-muted/10"
                >
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      <span className="font-semibold text-foreground mr-1">
                        {activity.actor.name}
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
