import React from "react";

const statusColors = {
  draft: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
  published:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-500",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-500",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-500",
  rejected:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-500",
};

export const StatusBadge = ({
  status,
}: {
  status: keyof typeof statusColors;
}) => {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusColors[status]}`}
    >
      {status}
    </span>
  );
};
