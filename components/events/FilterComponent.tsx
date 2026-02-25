"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

const FilterComponent = ({
  selectedCategory,
  categories,
}: {
  selectedCategory: string;
  categories: Category[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrl = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!value || value === "all") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.push(`/events?${params.toString()}`);
  };

  return (
    <div className="my-5 bg-card py-4 md:py-5 px-5 md:px-7 shadow-lg rounded-xl border border-zinc-200 dark:border-zinc-800 transition-all duration-300">
      <div className="space-y-4">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">
          Filter by Category
        </h2>
        <div className="flex gap-2.5 overflow-x-auto pb-2 md:pb-0 no-scrollbar items-center">
          <button
            onClick={() => updateUrl("category", "all")}
            className={`cursor-pointer whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 ${
              selectedCategory === "all"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            All Categories
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateUrl("category", cat.slug)}
              className={`cursor-pointer whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 active:scale-95 ${
                selectedCategory === cat.slug
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default FilterComponent;
