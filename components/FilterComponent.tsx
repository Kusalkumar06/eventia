"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

const FilterComponent = ({
  search,
  selectedCategory,
} : {
  search: string;
  selectedCategory: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchInput, setSearchInput] = useState(search);
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
    <div className="my-5 bg-card py-5 px-7 shadow-lg">
      <div className="flex items-center gap-2 mb-5">
        <input
          type="search"
          className="border border-border px-5 py-2 w-full rounded-md outline-none bg-background text-foreground"
          placeholder="search events..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
            updateUrl("search", e.target.value);
          }}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-foreground">Filter by Category</h2>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => updateUrl("category", "all")}
            className={`px-4 py-1 rounded-lg ${selectedCategory === "all" ? "bg-primary text-primary-foreground" : "border border-border text-foreground"}`}
          >
            All Categories
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateUrl("category", cat.slug)}
              className={`px-4 py-1 rounded-lg ${ selectedCategory === cat.slug ? "bg-primary text-primary-foreground" : "border border-border text-foreground" }`}>
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;