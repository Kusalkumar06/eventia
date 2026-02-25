import { getCategories } from "@/utilities/server/categoryActions";
import CategoriesClient from "./CategoriesClient";
import * as Icons from "lucide-react";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface CategoryStyle {
  icon: keyof typeof Icons;
  color: string;
}

export interface CategoryWithStyle extends Category, CategoryStyle {}

export default async function Categories() {
  const categories: Category[] = await getCategories();

  const styleMap: Record<string, CategoryStyle> = {
    Music: { icon: "Music", color: "from-pink-500 to-rose-500" },
    Comedy: { icon: "Mic", color: "from-amber-400 to-orange-500" },
    Art: { icon: "Palette", color: "from-indigo-400 to-cyan-400" },
    Business: { icon: "Briefcase", color: "from-emerald-400 to-green-500" },
    Sports: { icon: "Dumbbell", color: "from-blue-500 to-indigo-500" },
    Gaming: { icon: "Gamepad2", color: "from-purple-500 to-violet-500" },
    Travel: { icon: "Plane", color: "from-sky-400 to-blue-500" },
    Food: { icon: "Utensils", color: "from-red-400 to-pink-500" },
  };

  const categoriesWithStyles: CategoryWithStyle[] = categories.map((cat) => {
    const style = styleMap[cat.name] || {
      icon: "Calendar",
      color: "from-primary/20 to-primary/40",
    };
    return { ...cat, ...style };
  });

  return (
    <section className="py-24 bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Explore Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dive into a world of possibilities. Find events that match your
            passion.
          </p>
        </div>

        <CategoriesClient categories={categoriesWithStyles} />
      </div>
    </section>
  );
}
