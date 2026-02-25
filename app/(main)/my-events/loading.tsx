import React from "react";

const MyEventsLoading = () => {
  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-2">
          <div className="h-9 w-48 bg-muted animate-pulse rounded-lg" />
          <div className="h-5 w-72 bg-muted/60 animate-pulse rounded-lg" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-24 bg-card border border-border rounded-2xl animate-pulse shadow-sm"
              />
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {[1, 2].map((section) => (
          <section key={section} className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="h-7 w-40 bg-muted animate-pulse rounded-lg" />
              <div className="h-4 w-20 bg-muted animate-pulse rounded-lg" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-card border border-border rounded-xl h-48 animate-pulse shadow-sm"
                />
              ))}
            </div>
          </section>
        ))}
      </main>
    </div>
  );
};

export default MyEventsLoading;
