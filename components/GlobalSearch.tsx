"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utilities/styling";

interface SearchResult {
  events: {
    _id: string;
    title: string;
    slug: string;
    date: string;
    location: { city: string };
    category: { name: string };
  }[];
}

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({
    events: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setShowMobileSearch(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const performSearch = async (searchTerm: string) => {
    if (searchTerm.trim().length < 2) {
      setResults({ events: [] });
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);

    try {
      const response = await fetch(
        `/api/events/search?q=${encodeURIComponent(searchTerm)}`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      setResults({ events: data });
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("Search error:", error);
      setResults({ events: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults({ events: [] });
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value);
    }, 400);
  };

  const clearSearch = () => {
    setQuery("");
    setResults({ events: [] });
    setShowDropdown(false);
    setShowMobileSearch(false);
  };

  const hasResults = results.events.length > 0;

  return (
    <div ref={searchContainerRef} className="relative flex items-center">
      <button
        onClick={() => setShowMobileSearch(true)}
        className="cursor-pointer md:hidden p-2 text-zinc-600 dark:text-zinc-300 hover:text-primary"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {showMobileSearch && (
        <div className="fixed top-0 left-0 right-0 h-16 z-100 flex items-center bg-white dark:bg-zinc-950 px-4 border-b border-zinc-200 dark:border-zinc-800 md:hidden animate-in fade-in slide-in-from-top-2">
          <SearchIcon className="h-4 w-4 text-zinc-400 mr-2 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search events..."
            value={query}
            onChange={handleInputChange}
            className="flex-1 h-9 bg-transparent border-none text-base focus:outline-none placeholder:text-zinc-400"
          />
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-zinc-400 ml-2" />
          )}
          <button
            onClick={clearSearch}
            className="cursor-pointer ml-2 p-2 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
          >
            Cancel
          </button>

          {showDropdown && query && (
            <Dropdown
              results={results}
              hasResults={hasResults}
              isLoading={isLoading}
              close={clearSearch}
              mobile
            />
          )}
        </div>
      )}

      <div className="relative hidden md:block">
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-3 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search events..."
            value={query}
            onChange={handleInputChange}
            onFocus={() => query && setShowDropdown(true)}
            className="h-9 w-64 rounded-full border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/50 px-9 py-1 text-sm transition-all focus:w-80 focus:ring-2 focus:ring-primary/20 focus:border-primary/50 outline-none"
          />
          {isLoading && (
            <div className="absolute right-3">
              <Loader2 className="h-3 w-3 animate-spin text-zinc-400" />
            </div>
          )}
        </div>

        {showDropdown && query && (
          <Dropdown
            results={results}
            hasResults={hasResults}
            isLoading={isLoading}
            close={() => setShowDropdown(false)}
          />
        )}
      </div>
    </div>
  );
}

function Dropdown({
  results,
  hasResults,
  isLoading,
  close,
  mobile = false,
}: {
  results: SearchResult;
  hasResults: boolean;
  isLoading: boolean;
  close: () => void;
  mobile?: boolean;
}) {
  return (
    <div
      className={cn(
        mobile
          ? "absolute top-16 left-0 right-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
          : "absolute top-12 left-0 w-80 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl max-h-96 overflow-y-auto z-50",
      )}
    >
      {!hasResults && !isLoading ? (
        <div className="p-4 text-sm text-zinc-500 text-center">
          No events found.
        </div>
      ) : (
        <>
          {results.events.length > 0 && (
            <div className="py-2">
              <h3 className="px-4 pb-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                Events
              </h3>
              {results.events.map((event) => (
                <Link
                  key={event._id}
                  href={`/events/${event.slug}`}
                  onClick={close}
                  className="flex items-start gap-3 px-4 py-3 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1 dark:text-zinc-200">
                      {event.title}
                    </p>
                    <div className="flex justify-between text-xs text-zinc-500 mt-1">
                      <span>{event.location?.city || "Online"}</span>
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
