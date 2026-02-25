import React from "react";

const EventsLoading = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="text-center py-15 space-y-4">
        <div className="h-10 w-64 bg-muted animate-pulse mx-auto rounded-lg" />
        <div className="h-6 w-96 bg-muted/60 animate-pulse mx-auto rounded-lg" />
      </div>

      <div className="my-5 bg-card py-5 px-7 shadow-lg rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-4">
        <div className="h-6 w-40 bg-muted animate-pulse rounded-lg" />
        <div className="flex gap-2 flex-wrap">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-9 w-24 bg-muted rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl overflow-hidden h-[450px]"
          >
            <div className="h-56 w-full bg-muted animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="h-6 w-3/4 bg-muted animate-pulse rounded-lg" />
              <div className="h-4 w-1/2 bg-muted animate-pulse rounded-lg" />
              <div className="flex gap-4 pt-4">
                <div className="h-4 w-20 bg-muted animate-pulse rounded-lg" />
                <div className="h-4 w-20 bg-muted animate-pulse rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsLoading;
