import { Calendar, Mail, ShieldAlert, Award, Megaphone } from "lucide-react";
import { RevokeAccessButton } from "./RevokeAccessButton";

interface UserCardProps {
  user: {
    _id: string;
    name: string;
    email: string;
    role: "admin" | "user" | "organizer";
    createdAt: string;
    eventsOrganizedCount: number;
    eventsAttendedCount: number;
  };
}

export default function UserCard({ user }: UserCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border overflow-hidden shadow-sm transition-shadow hover:shadow-md flex flex-col h-full">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-4 min-w-0">
            <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-normal text-sm border border-primary/20 shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <h3 className="font-semibold text-sm truncate pr-2">
                {user.name}
              </h3>
              <div className="mt-1 flex items-center gap-2">
                {user.role === "admin" ? (
                  <div className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center w-fit">
                    <ShieldAlert className="w-3 h-3 mr-1" />
                    Admin
                  </div>
                ) : user.role === "organizer" ? (
                  <div className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center w-fit">
                    <Megaphone className="w-3 h-3 mr-1" />
                    Organizer
                  </div>
                ) : (
                  <div className="bg-muted text-muted-foreground text-[10px] px-2 py-0.5 rounded-md font-medium flex items-center capitalize w-fit">
                    {user.role}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground flex items-center truncate">
            <Mail className="w-4 h-4 mr-2 shrink-0 text-muted-foreground/70" />
            <span className="truncate" title={user.email}>
              {user.email}
            </span>
          </p>
        </div>
      </div>

      <div className="px-6 py-4 bg-muted/30 border-t border-border mt-auto">
        <div className="grid grid-cols-2 gap-4 divide-x divide-border">
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">
              {user.eventsOrganizedCount}
            </span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
              Organized
            </span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-2xl font-bold">
              {user.eventsAttendedCount}
            </span>
            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-1">
              Attended
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-3 bg-muted/50 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center">
          <Calendar className="w-3.5 h-3.5 mr-1.5" />
          Joined {formattedDate}
        </div>

        {(user.eventsAttendedCount > 0 || user.eventsOrganizedCount > 0) && (
          <div className="flex items-center text-primary/80">
            <Award className="w-3.5 h-3.5 mr-1" />
            Active Member
          </div>
        )}

        {user.role === "organizer" && (
          <div className="ml-auto">
            <RevokeAccessButton userId={user._id} />
          </div>
        )}
      </div>
    </div>
  );
}
