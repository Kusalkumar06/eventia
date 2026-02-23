"use client";

import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/utilities/styling";

interface SearchResult {
  users: { _id: string; name: string; email: string }[];
  events: { _id: string; title: string; status: string; slug: string }[];
}

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({
    users: [],
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
      setResults({ users: [], events: [] });
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
        `/api/admin/search?q=${encodeURIComponent(searchTerm)}`,
        { signal: controller.signal },
      );

      if (!response.ok) {
        throw new Error("Search request failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (error: unknown) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (!value.trim()) {
      setResults({ users: [], events: [] });
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
    setResults({ users: [], events: [] });
    setShowDropdown(false);
    setShowMobileSearch(false);
  };

  const hasResults = results.users.length > 0 || results.events.length > 0;

  return (
    <div ref={searchContainerRef} className="relative">
      <button
        onClick={() => setShowMobileSearch(true)}
        className="cursor-pointer md:hidden p-2 text-muted-foreground hover:text-foreground"
      >
        <SearchIcon className="h-5 w-5" />
      </button>

      {showMobileSearch && (
        <div className="fixed top-0 left-0 right-0 h-16 z-50 flex items-center bg-background px-4 border-b border-border md:hidden animate-in fade-in slide-in-from-top-2">
          <SearchIcon className="h-4 w-4 text-muted-foreground mr-2 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search..."
            value={query}
            onChange={handleInputChange}
            className="flex-1 h-9 bg-transparent border-none text-sm focus:outline-none placeholder:text-muted-foreground"
          />
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground ml-2" />
          )}
          <button
            onClick={clearSearch}
            className="cursor-pointer ml-2 p-2 text-sm text-muted-foreground hover:text-foreground"
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
        <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search users or events..."
          value={query}
          onChange={handleInputChange}
          onFocus={() => query && setShowDropdown(true)}
          className="h-9 w-64 lg:w-80 rounded-md border border-input bg-transparent px-9 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />

        {isLoading && (
          <div className="absolute right-3 top-2.5">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}

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
          ? "absolute top-16 left-0 right-0 bg-card border-b border-border shadow-lg max-h-[calc(100vh-4rem)] overflow-y-auto"
          : "absolute top-10 left-0 w-80 bg-card border border-border rounded-md shadow-lg max-h-96 overflow-y-auto",
      )}
    >
      {!hasResults && !isLoading ? (
        <div className="p-4 text-sm text-muted-foreground text-center">
          No results found.
        </div>
      ) : (
        <>
          {results.users.length > 0 && (
            <div className="py-2">
              <h3 className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Users
              </h3>
              {results.users.map((user) => (
                <Link
                  key={user._id}
                  href="/admin/users"
                  onClick={close}
                  className="block px-4 py-2 hover:bg-accent transition-colors"
                >
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </Link>
              ))}
            </div>
          )}

          {results.users.length > 0 && results.events.length > 0 && (
            <div className="border-t border-border" />
          )}

          {results.events.length > 0 && (
            <div className="py-2">
              <h3 className="px-4 pb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Events
              </h3>
              {results.events.map((event) => (
                <Link
                  key={event._id}
                  href={`/admin/events/${event.slug}`}
                  onClick={close}
                  className="block px-4 py-2 hover:bg-accent transition-colors"
                >
                  <p className="text-sm font-medium">{event.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {event.slug}
                    </p>
                    <span
                      className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full",
                        event.status === "Published" &&
                          "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
                        event.status === "Pending" &&
                          "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                        event.status === "Rejected" &&
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
                      )}
                    >
                      {event.status}
                    </span>
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
