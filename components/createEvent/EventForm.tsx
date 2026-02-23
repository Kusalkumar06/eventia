"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/utilities/styling";
import { toast } from "sonner";
import {
  createEventAction,
  updateEventAction,
  type EventActionData,
} from "@/utilities/services/eventActions";

import { EventDTO } from "@/types/types";

interface Category {
  _id: string;
  name: string;
  slug: string;
}

interface EventFormProps {
  categories: Category[];
  initialData?: EventDTO;
}

const STEPS = [
  { id: 1, name: "Basic Info" },
  { id: 2, name: "Date & Time" },
  { id: 3, name: "Location" },
  { id: 4, name: "Registration" },
];

export default function EventForm({ categories, initialData }: EventFormProps) {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [shortDescription, setShortDescription] = useState(
    initialData?.shortDescription || "",
  );
  const [category, setCategory] = useState(initialData?.category?._id || "");
  const [otherCategoryLabel, setOtherCategoryLabel] = useState(
    initialData?.otherCategoryLabel || "",
  );
  const [tags, setTags] = useState(initialData?.tags?.join(", ") || "");

  const formatDatetimeLocal = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  };

  const [startDate, setStartDate] = useState(
    formatDatetimeLocal(initialData?.startDate),
  );
  const [endDate, setEndDate] = useState(
    formatDatetimeLocal(initialData?.endDate),
  );

  const [mode, setMode] = useState<"online" | "offline">(
    initialData?.mode || "online",
  );
  const [onlineURL, setOnlineURL] = useState(initialData?.onlineURL || "");
  const [venue, setVenue] = useState(initialData?.location?.venue || "");
  const [city, setCity] = useState(initialData?.location?.city || "");
  const [state, setState] = useState(initialData?.location?.state || "");
  const [zip, setZip] = useState(initialData?.location?.zip || "");
  const [country, setCountry] = useState(initialData?.location?.country || "");

  const [isRegistrationRequired, setIsRegistrationRequired] = useState(
    initialData?.isRegistrationRequired || false,
  );
  const [maxRegistrations, setMaxRegistrations] = useState(
    initialData?.maxRegistrations?.toString() || "",
  );

  const [isLoading, setIsLoading] = useState(false);

  const selectedCategoryObj = categories.find((c) => c._id === category);
  const isOthersCategory = selectedCategoryObj?.slug === "others";

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!title.trim()) return "Title is required.";
        if (!description.trim()) return "Description is required.";
        if (!category) return "Category is required.";
        if (isOthersCategory && !otherCategoryLabel.trim())
          return "Please specify the custom category.";
        return null;
      case 2:
        if (!startDate) return "Start date is required.";
        if (!endDate) return "End date is required.";
        if (new Date(endDate) <= new Date(startDate))
          return "End date must be after start date.";
        return null;
      case 3:
        if (mode === "online" && !onlineURL.trim())
          return "Online meeting URL is required.";
        if (mode === "offline" && (!city.trim() || !country.trim()))
          return "City and Country are required for offline events.";
        return null;
      case 4:
        if (
          isRegistrationRequired &&
          (!maxRegistrations || Number(maxRegistrations) <= 0)
        )
          return "Maximum capacity must be greater than 0.";
        return null;
      default:
        return null;
    }
  };

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const err = validateStep(currentStep);
    if (err) {
      toast.error(err);
      return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (currentStep !== STEPS.length) return;

    const err = validateStep(4);
    if (err) {
      toast.error(err);
      return;
    }

    setIsLoading(true);

    try {
      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

      const payload: Record<string, unknown> = {
        title,
        description,
        shortDescription: shortDescription || undefined,
        category,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        mode,
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString(),
        isRegistrationRequired,
      };

      if (isOthersCategory) {
        payload.otherCategoryLabel = otherCategoryLabel;
      }

      if (mode === "online") {
        payload.onlineURL = onlineURL || undefined;
      } else {
        payload.location = {
          venue: venue || undefined,
          city: city || undefined,
          state: state || undefined,
          zip: zip || undefined,
          country: country || undefined,
        };
      }

      if (isRegistrationRequired && maxRegistrations) {
        payload.maxRegistrations = Number(maxRegistrations);
      }

      let res;
      if (initialData) {
        res = await updateEventAction(
          initialData._id,
          payload as unknown as Partial<EventActionData>,
        );
      } else {
        res = await createEventAction(payload as unknown as EventActionData);
      }

      if (!res.success) {
        throw new Error(res.error || "Failed to save event");
      }

      toast.success(
        initialData
          ? "Event updated successfully!"
          : "Event created successfully!",
      );
      router.push("/my-events");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Progress Bar Header */}
      <nav
        aria-label="Progress"
        className="mb-12 md:max-w-3xl md:mx-auto pt-4 pb-8"
      >
        <ol role="list" className="flex items-center justify-between w-full">
          {STEPS.map((step, index) => {
            const isCompleted = currentStep > step.id;
            const isCurrent = currentStep === step.id;

            return (
              <li
                key={step.name}
                className={cn(
                  "relative flex items-center",
                  index !== STEPS.length - 1 ? "flex-1 w-full" : "",
                )}
              >
                {/* Step Circle & Label Container */}
                <div className="flex flex-col items-center flex-shrink-0 relative group min-w-[2rem]">
                  <div
                    className={cn(
                      "flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full transition-all duration-500 ease-in-out z-10",
                      isCompleted
                        ? "bg-primary border-2 border-primary"
                        : isCurrent
                          ? "border-2 border-primary bg-background shadow-[0_0_10px_rgba(var(--primary),0.3)]"
                          : "border-2 border-muted bg-background text-muted-foreground",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground stroke-[3px]" />
                    ) : (
                      <span
                        className={cn(
                          "text-sm sm:text-base font-semibold transition-colors duration-300",
                          isCurrent ? "text-primary" : "text-muted-foreground",
                        )}
                      >
                        {step.id}
                      </span>
                    )}
                  </div>

                  {/* Step Label */}
                  <span
                    className={cn(
                      "absolute top-12 sm:top-14 mt-1 text-[10px] sm:text-xs font-medium w-max text-center transition-colors duration-300",
                      isCurrent
                        ? "text-foreground font-semibold"
                        : "text-muted-foreground",
                    )}
                  >
                    {step.name}
                  </span>
                </div>

                {/* Connector Line */}
                {index !== STEPS.length - 1 && (
                  <div className="flex-1 px-2 pb-0 pt-0 w-full relative h-[2px] -mt-[1px] md:-mt-[2px]">
                    <div
                      className={cn(
                        "h-full w-full transition-all duration-500 ease-in-out",
                        isCompleted ? "bg-primary" : "bg-muted",
                      )}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Step 1: Basic Info */}
        <div
          className={
            currentStep === 1
              ? "block animate-in fade-in slide-in-from-right-2"
              : "hidden"
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="title"
                className="text-sm font-medium leading-none"
              >
                Event Title <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g. Next.js Masterclass"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="description"
                className="text-sm font-medium leading-none"
              >
                Detailed Description <span className="text-destructive">*</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={5}
                className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                placeholder="Describe what the event is about in detail..."
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="shortDescription"
                className="text-sm font-medium leading-none"
              >
                Short Description{" "}
                <span className="text-muted-foreground font-normal">
                  (Max 200 chars)
                </span>
              </label>
              <input
                id="shortDescription"
                maxLength={200}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="A brief summary for the event card..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="category"
                  className="text-sm font-medium leading-none"
                >
                  Category <span className="text-destructive">*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>
                    Select a category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tags"
                  className="text-sm font-medium leading-none"
                >
                  Tags{" "}
                  <span className="text-muted-foreground font-normal">
                    (Comma separated)
                  </span>
                </label>
                <input
                  id="tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. react, programming, web"
                />
              </div>
            </div>

            {isOthersCategory && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label
                  htmlFor="otherCategoryLabel"
                  className="text-sm font-medium leading-none"
                >
                  Please specify the category{" "}
                  <span className="text-destructive">*</span>
                </label>
                <input
                  id="otherCategoryLabel"
                  value={otherCategoryLabel}
                  onChange={(e) => setOtherCategoryLabel(e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Custom category name..."
                />
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Date & Time */}
        <div
          className={
            currentStep === 2
              ? "block animate-in fade-in slide-in-from-right-2"
              : "hidden"
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="startDate"
                  className="text-sm font-medium leading-none"
                >
                  Start Date & Time <span className="text-destructive">*</span>
                </label>
                <input
                  id="startDate"
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="endDate"
                  className="text-sm font-medium leading-none"
                >
                  End Date & Time <span className="text-destructive">*</span>
                </label>
                <input
                  id="endDate"
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Step 3: Modality & Location */}
        <div
          className={
            currentStep === 3
              ? "block animate-in fade-in slide-in-from-right-2"
              : "hidden"
          }
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="mode"
                className="text-sm font-medium leading-none"
              >
                Event Mode <span className="text-destructive">*</span>
              </label>
              <select
                id="mode"
                value={mode}
                onChange={(e) =>
                  setMode(e.target.value as "online" | "offline")
                }
                disabled={isLoading}
                className="flex h-10 w-full md:w-1/2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="online">Online</option>
                <option value="offline">Offline / In-Person</option>
              </select>
            </div>

            {mode === "online" ? (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label
                  htmlFor="onlineURL"
                  className="text-sm font-medium leading-none"
                >
                  Online Meeting URL <span className="text-destructive">*</span>
                </label>
                <input
                  id="onlineURL"
                  type="url"
                  value={onlineURL}
                  onChange={(e) => setOnlineURL(e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. https://meet.google.com/..."
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 p-4 bg-muted/40 rounded-xl border border-border">
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="venue"
                    className="text-sm font-medium leading-none"
                  >
                    Venue Name
                  </label>
                  <input
                    id="venue"
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="e.g. Convention Center"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="city"
                    className="text-sm font-medium leading-none"
                  >
                    City <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="state"
                    className="text-sm font-medium leading-none"
                  >
                    State
                  </label>
                  <input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="zip"
                    className="text-sm font-medium leading-none"
                  >
                    Postal / Zip Code
                  </label>
                  <input
                    id="zip"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="country"
                    className="text-sm font-medium leading-none"
                  >
                    Country <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={isLoading}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 4: Registration Settings */}
        <div
          className={
            currentStep === 4
              ? "block animate-in fade-in slide-in-from-right-2"
              : "hidden"
          }
        >
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isRegistrationRequired"
                checked={isRegistrationRequired}
                onChange={(e) => setIsRegistrationRequired(e.target.checked)}
                disabled={isLoading}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary inline-block"
              />
              <label
                htmlFor="isRegistrationRequired"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 inline-block align-middle"
              >
                Require users to register to attend
              </label>
            </div>

            {isRegistrationRequired && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2 mt-4">
                <label
                  htmlFor="maxRegistrations"
                  className="text-sm font-medium leading-none"
                >
                  Maximum Capacity <span className="text-destructive">*</span>
                </label>
                <input
                  id="maxRegistrations"
                  type="number"
                  min="1"
                  value={maxRegistrations}
                  onChange={(e) => setMaxRegistrations(e.target.value)}
                  disabled={isLoading}
                  className="flex h-10 w-full md:w-1/2 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="e.g. 100"
                />
              </div>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="pt-6 border-t border-border flex justify-between items-center">
          <button
            type="button"
            key="back-button"
            onClick={handleBack}
            disabled={currentStep === 1 || isLoading}
            className={`cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-6 shadow-sm ${currentStep === 1 ? "invisible" : ""}`}
          >
            Back
          </button>

          {currentStep < STEPS.length ? (
            <button
              type="button"
              key="next-button"
              onClick={() => handleNext()}
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              key="submit-button"
              disabled={isLoading}
              className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 px-8 ml-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : initialData ? (
                "Update Event"
              ) : (
                "Create Event"
              )}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
