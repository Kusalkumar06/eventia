"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

const FilterComponent = ({
  selectedCategory,
}: {
  selectedCategory: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

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
    <div className="my-5 bg-card py-5 px-7 shadow-lg rounded-xl border border-zinc-200 dark:border-zinc-800">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">
          Filter by Category
        </h2>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => updateUrl("category", "all")}
            className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === "all" ? "bg-primary text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
          >
            All Categories
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateUrl("category", cat.slug)}
              className={`cursor-pointer px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.slug ? "bg-primary text-white" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;
