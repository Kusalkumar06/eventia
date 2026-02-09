"use client"

import React, { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

type Category = {
  _id: string
  name: string
  slug: string
}

const FilterComponent = ({
  search,
  selectedCategory,
}: {
  search: string
  selectedCategory: string
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchInput, setSearchInput] = useState(search)
  const [categories, setCategories] = useState<Category[]>([])

  // fetch categories
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories)
      .catch(() => setCategories([]))
  }, [])

  const updateUrl = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (!value || value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    router.push(`/events?${params.toString()}`)
  }

  return (
    <div className="my-5 bg-white py-5 px-7 shadow-lg">
      {/* Search */}
      <div className="flex items-center gap-2 mb-5">
        <input
          type="search"
          className="border px-5 py-2 w-full rounded-md outline-none"
          placeholder="search events..."
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value)
            updateUrl("search", e.target.value)
          }}
        />
      </div>

      {/* Category filter */}
      <div className="space-y-4">
        <h2>Filter by Category</h2>

        <div className="flex gap-2 flex-wrap">
          {/* All Categories (UI-only) */}
          <button
            onClick={() => updateUrl("category", "all")}
            className={`px-4 py-1 rounded-lg ${
              selectedCategory === "all"
                ? "bg-[#DB2525] text-white"
                : "border border-zinc-500"
            }`}
          >
            All Categories
          </button>

          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateUrl("category", cat.slug)}
              className={`px-4 py-1 rounded-lg ${
                selectedCategory === cat.slug
                  ? "bg-[#DB2525] text-white"
                  : "border border-zinc-500"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterComponent
