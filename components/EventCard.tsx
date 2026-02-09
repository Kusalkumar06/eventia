import Link from "next/link";

// format helper for dates
const formatEventDate = (start: string | Date, end: string | Date): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  // Format options: 12 March 2026
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  };

  if (startDate.toDateString() === endDate.toDateString()) {
    return startDate.toLocaleDateString("en-GB", options);
  } else {
    // 12-14 March 2026
    // check if same month and year
    if (
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear()
    ) {
      return `${startDate.getDate()}–${endDate.getDate()} ${startDate.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}`;
    } else {
      return `${startDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })} – ${endDate.toLocaleDateString("en-GB", options)}`;
    }
  }
};

interface Event {
  title: string;
  slug: string;
  shortDescription?: string;
  category: {
    name: string;
    slug: string;
  };
  otherCategoryLabel?: string;
  mode: "online" | "offline";
  startDate: string | Date;
  endDate: string | Date;
  location?: {
    city?: string;
    venue?: string;
  };
}

const EventCard = ({ event }: { event: Event }) => {
  const {
    title,
    slug,
    shortDescription,
    category,
    otherCategoryLabel,
    mode,
    startDate,
    endDate,
    location,
  } = event;

  const categoryDisplay =
    category.slug === "others" && otherCategoryLabel
      ? otherCategoryLabel
      : category.name;

  return (
    <article className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100 flex flex-col h-full">
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide text-blue-600 bg-blue-50 rounded-full">
            {categoryDisplay}
          </span>
          <span
            className={`inline-block px-2 py-1 text-xs font-medium rounded ${mode === "online" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
          >
            {mode === "online" ? "Online" : "Offline"}
          </span>
        </div>

        <Link href={`/events/${slug}`} className="block group mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {title}
          </h3>
        </Link>

        <div className="text-sm text-gray-500 mb-4 flex items-center gap-2">
          <span>📅 {formatEventDate(startDate, endDate)}</span>
        </div>

        <div className="text-sm text-gray-500 mb-3 flex items-center gap-1">
          {mode === "online" ? (
            <>
              <span>🌐</span>
              <span>Online Event</span>
            </>
          ) : (
            location?.city && (
              <>
                <span>📍</span>
                <span>
                  {location.city}
                  {location.venue ? `, ${location.venue}` : ""}
                </span>
              </>
            )
          )}
        </div>

        {shortDescription && (
          <p className="text-gray-600 text-sm line-clamp-2 mb-4 flex-grow">
            {shortDescription}
          </p>
        )}

        <div className="mt-auto pt-4 border-t border-gray-100">
          <Link
            href={`/events/${slug}`}
            className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 bg-transparent border border-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            aria-label={`View details for ${title}`}
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
