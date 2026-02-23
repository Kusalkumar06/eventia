import React from "react";

export const SectionHeader = ({
  title,
  count,
}: {
  title: string;
  count: number;
}) => {
  return (
    <div className="flex items-center gap-3 mb-6 pb-2 border-b border-border/50">
      <h2 className="text-xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <span className="bg-primary/10 text-primary text-xs font-semibold px-2.5 py-0.5 rounded-full">
        {count}
      </span>
    </div>
  );
};
