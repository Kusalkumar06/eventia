import { requireAuth } from "@/lib/auth-guards";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/utilities/server/profileActions";
import Link from "next/link";
import { format } from "date-fns";
import { Mail, CalendarDays, Shield, User as UserIcon } from "lucide-react";
import Image from "next/image";
import EditProfile from "../../../components/profile/EditProfile";
import ChangePassword from "../../../components/profile/ChangePassword";
import SetPassword from "../../../components/profile/SetPassword";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await requireAuth();

  if (!session?.user?.id) {
    redirect("/signIn");
  }

  const user = await getUserProfile(session.user.id);

  if (!user) {
    redirect("/signIn");
  }

  const role = user.role;
  const name = user.name;
  const email = user.email;
  const avatarUrl =
    user.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  const bio = user.bio;
  const joinedDate = new Date(user.createdAt);

  return (
    <div className="min-h-screen bg-muted/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Profile
          </h1>
          {role === "admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
            >
              Go to Dashboard
            </Link>
          )}
        </div>

        <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="h-32 bg-linear-to-r from-primary/10 via-primary/5 to-transparent border-b border-border/50"></div>

          <div className="px-6 sm:px-10 pb-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 -mt-16 sm:-mt-20 mb-8">
              <div className="relative inline-block">
                <Image
                  src={avatarUrl}
                  alt={name}
                  width={160}
                  height={160}
                  className="w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-card bg-muted object-cover shadow-md"
                />
              </div>

              <div className="sm:pb-4 flex gap-3">
                <EditProfile initialName={name} initialBio={bio} />
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                    {name}
                  </h2>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      role === "admin"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {role === "admin" ? (
                      <Shield className="w-3 h-3 mr-1" />
                    ) : (
                      <UserIcon className="w-3 h-3 mr-1" />
                    )}
                    <span className="capitalize">{role}</span>
                  </span>
                </div>
              </div>

              {bio ? (
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-muted-foreground">
                  <p>{bio}</p>
                </div>
              ) : (
                <p className="text-muted-foreground italic text-sm">
                  No bio provided yet. Add a short bio to let others know more
                  about you!
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-border">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">
                      Email Address
                    </p>
                    <p className="text-sm font-medium text-foreground truncate">
                      {email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-foreground/70" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-0.5">
                      Joined Eventia
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {format(joinedDate, "MMMM d, yyyy")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {user.hasPassword ? <ChangePassword /> : <SetPassword />}
      </div>
    </div>
  );
}
