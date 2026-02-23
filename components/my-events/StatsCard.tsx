import React from "react";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
  colorClass: string;
}

export const StatsCard = ({
  label,
  count,
  icon: Icon,
  colorClass,
}: StatsCardProps) => {
  return (
    <div className="bg-card text-card-foreground p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold mt-1">{count}</p>
        </div>
      </div>
    </div>
  );
};
