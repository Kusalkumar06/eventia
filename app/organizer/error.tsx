"use client";

import { useEffect } from "react";
import { AlertCircle } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Organizer route error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-destructive/10 p-4 rounded-full mb-6">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold tracking-tight mb-2">
        Something went wrong!
      </h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        An error occurred while loading this page. We apologize for the
        inconvenience.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Try again
        </button>
      </div>
      {process.env.NODE_ENV === "development" && (
        <pre className="mt-8 p-4 bg-muted text-left text-xs text-muted-foreground rounded-lg overflow-auto max-w-full">
          {error.message}
        </pre>
      )}
    </div>
  );
}
