import { SunMedium, Moon, Menu } from "lucide-react";
import { cn } from "@/utilities/styling";
import { useTheme } from "next-themes";
import Search from "./Search";

interface TopBarProps {
  desktopSidebar: boolean;
  setMobileSidebar: (open: boolean) => void;
}

const TopBar = (props: TopBarProps) => {
  const { desktopSidebar, setMobileSidebar } = props;
  const { theme, setTheme } = useTheme();

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 h-16 flex items-center justify-between border-b border-border bg-background/80 backdrop-blur-md px-6 transition-all duration-300 ease-in-out",
        desktopSidebar ? "lg:left-64" : "lg:left-20",
        "left-0",
      )}
    >
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setMobileSidebar(true)}
        >
          <Menu />
        </button>

        <h1 className="text-xl font-bold text-foreground hidden lg:block">
          Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Search />

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative p-2 rounded-full hover:bg-accent text-foreground transition-colors"
        >
          <SunMedium className="h-5 w-5 transition-all scale-0 rotate-90 dark:scale-100 dark:rotate-0" />
          <Moon className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-5 w-5 transition-all scale-100 rotate-0 dark:scale-0 dark:-rotate-90" />
          <span className="sr-only">Toggle theme</span>
        </button>

        <div className="flex items-center gap-3 pl-2 border-l border-border">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium leading-none text-foreground">
              Kusal Kumar
            </p>
            <p className="text-xs text-muted-foreground">admin@eventia.com</p>
          </div>
          <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/20">
            KK
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
