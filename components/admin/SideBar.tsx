"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/utilities/styling";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  CalendarX2,
  CalendarClock,
  CalendarCheck2,
} from "lucide-react";
import { lobster } from "@/utilities/fonts";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Events",
    icon: CalendarDays,
    subItems: [
      { title: "Pending", href: "/admin/events/pending", icon: CalendarClock },
      {
        title: "Published",
        href: "/admin/events/published",
        icon: CalendarCheck2,
      },
      { title: "Rejected", href: "/admin/events/rejected", icon: CalendarX2 },
    ],
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
];

interface SideBarProps {
  desktopSidebar: boolean;
  setDesktopSidebar: React.Dispatch<React.SetStateAction<boolean>>;
  mobileSidebar: boolean;
  setMobileSidebar: React.Dispatch<React.SetStateAction<boolean>>;
}

const SideBar = (props: SideBarProps) => {
  const { desktopSidebar, setDesktopSidebar, mobileSidebar, setMobileSidebar } =
    props;
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out",
        desktopSidebar ? "lg:w-64" : "lg:w-20",
        "w-64",
        mobileSidebar ? "translate-x-0" : "-translate-x-full",
        "lg:translate-x-0",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-sidebar-border h-16">
        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden",
            !desktopSidebar && "lg:justify-center lg:w-full",
          )}
        >
          <ShieldCheck className="h-8 w-8 text-primary shrink-0" />
          <span
            className={cn(
              "text-lg font-bold text-sidebar-foreground truncate transition-opacity duration-200",
              !desktopSidebar ? "lg:hidden" : "lg:block",
            )}
          >
            <div>
              <Link
                href="/"
                className={`${lobster.className} text-primary text-[30px] text`}
              >
                Eventia
              </Link>
            </div>
          </span>
        </div>

        <button
          onClick={() => setMobileSidebar(false)}
          className="lg:hidden p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
        >
          <ChevronLeft size={20} />
        </button>

        {desktopSidebar && (
          <button
            onClick={() => setDesktopSidebar(false)}
            className="hidden lg:block p-1 rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
          >
            <ChevronLeft size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {sidebarItems.map((item) => (
          <div key={item.title}>
            {item.subItems ? (
              <div className="space-y-1">
                <div
                  className={cn(
                    "py-2 text-sm font-medium text-muted-foreground transition-all",
                    desktopSidebar
                      ? "lg:px-3"
                      : "lg:flex lg:justify-center bg-transparent",
                    "px-3",
                  )}
                  title={!desktopSidebar ? item.title : undefined}
                >
                  {!desktopSidebar && (
                    <span className="hidden lg:block">
                      <item.icon className="h-5 w-5" />
                    </span>
                  )}

                  <span className={cn(!desktopSidebar && "lg:hidden")}>
                    {item.title}
                  </span>
                </div>
                <div className={cn("space-y-1", !desktopSidebar && "")}>
                  {item.subItems.map((sub) => {
                    const isActive = pathname === sub.href;
                    return (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        onClick={() => setMobileSidebar(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ml-4",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                        )}
                      >
                        <sub.icon
                          className={cn(
                            "h-5 w-5 shrink-0",
                            !desktopSidebar && "lg:mr-0",
                          )}
                        />
                        <span className={cn(!desktopSidebar && "lg:hidden")}>
                          {sub.title}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              <Link
                href={item.href}
                onClick={() => setMobileSidebar(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md transition-colors group relative",
                  pathname === item.href
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  !desktopSidebar && "lg:justify-center",
                )}
                title={!desktopSidebar ? item.title : undefined}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0",
                    !desktopSidebar && "lg:mr-0",
                  )}
                />
                <span className={cn(!desktopSidebar && "lg:hidden")}>
                  {item.title}
                </span>
              </Link>
            )}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <button
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 text-destructive hover:bg-red-100/10 rounded-md transition-colors",
            !desktopSidebar && "lg:justify-center",
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className={cn("font-medium", !desktopSidebar && "lg:hidden")}>
            Logout
          </span>
        </button>
      </div>

      {!desktopSidebar && (
        <button
          onClick={() => setDesktopSidebar(true)}
          className="hidden lg:flex absolute -right-3 top-20 bg-card border border-border p-1 rounded-full shadow-md z-50 text-foreground"
        >
          <ChevronRight size={14} />
        </button>
      )}
    </aside>
  );
};

export default SideBar;
