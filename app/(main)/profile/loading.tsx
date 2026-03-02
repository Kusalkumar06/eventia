import React from "react";
import { Loader2 } from "lucide-react";

const Loading = () => {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-background/60 backdrop-blur-2xl transition-all duration-500">
      <div className="relative flex flex-col items-center">
        <div className="absolute -inset-10 bg-primary/15 rounded-full blur-[60px] animate-pulse" />

        <div className="relative flex flex-col items-center space-y-8 text-center px-4">
          <div className="relative">
            <Loader2 className="w-20 h-20 text-primary animate-[spin_1.5s_linear_infinite] stroke-[1.2] drop-shadow-[0_0_8px_rgba(var(--color-primary),0.3)]" />

            <div className="absolute -inset-3 rounded-full border border-primary/10 border-t-primary/30 animate-[spin_4s_linear_infinite]" />

            <div className="absolute inset-0 m-auto w-3 h-3 bg-primary rounded-full shadow-[0_0_20px_rgb(var(--color-primary))]" />
          </div>

          <div className="flex flex-col items-center gap-1">
            <h2
              className="text-4xl font-extrabold tracking-tighter text-foreground drop-shadow-sm"
              id="loading-title"
            >
              <span className="bg-clip-text text-transparent bg-linear-to-b from-primary to-primary/60">
                Eventia
              </span>
            </h2>

            <div className="flex items-center justify-center space-x-1.5 mt-2">
              <div className="w-2 h-2 bg-primary/30 rounded-full animate-bounce [animation-delay:-0.32s]" />
              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.16s]" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
            </div>

            <p className="text-sm font-medium text-muted-foreground/60 tracking-widest uppercase mt-4 animate-pulse">
              Preparing your experience
            </p>
          </div>
        </div>
      </div>

      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
};

export default Loading;
