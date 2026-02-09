"use client";

import { useState } from "react";

// Define the interface for the form data
interface EventFormData {
  title: string;
  description: string;
  shortDescription: string;
  category: string;
  tags: string;
  mode: "online" | "offline";
  venue: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  onlineURL: string;
  startDate: string;
  endDate: string;
  organizer: string;
  isRegistrationRequired: boolean;
  maxRegistrations: string;
}

export default function CreateEventPage() {
  const [formData, setFormData] = useState<EventFormData>({
  title: "Intro to Next.js App Router",
  description: "A beginner-friendly session covering the basics of Next.js App Router, routing, layouts, and API routes.",
  shortDescription: "Learn Next.js App Router basics in a free session.",
  category: "",

  tags: "nextjs,react,web",

  mode: "online",

  venue: "",
  city: "",
  state: "",
  zip: "",
  country: "",

  onlineURL: "https://meet.google.com/abc-defg-hij",

  startDate: "2026-02-15T10:00",
  endDate: "2026-02-15T12:00",

  organizer: "65c9f0a1a2b3c4d5e6f78901", // dummy ObjectId string

  isRegistrationRequired: false,
  maxRegistrations: ""
}
);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Prepare payload
      const tagsArray = formData.tags
        ? formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag !== "")
        : [];

      const payload: any = {
        title: formData.title,
        description: formData.description,
        shortDescription: formData.shortDescription || undefined,
        category: formData.category || undefined,
        tags: tagsArray.length > 0 ? tagsArray : undefined,
        mode: formData.mode,
        organizer: formData.organizer,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
        isRegistrationRequired: formData.isRegistrationRequired,
      };

      if (formData.mode === "online") {
        payload.onlineURL = formData.onlineURL || undefined;
      } else {
        payload.location = {
          venue: formData.venue || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          zip: formData.zip || undefined,
          country: formData.country || undefined,
        };
      }

      if (formData.isRegistrationRequired && formData.maxRegistrations) {
        payload.maxRegistrations = Number(formData.maxRegistrations);
      }

      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create event");
      }

      const data = await res.json();
      console.log("Event created successfully:", data);
      setSuccess(true);
      // Reset form or redirect (not requested)
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Create Event</h1>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded">{error}</div>
      )}
      {success && (
        <div className="p-3 mb-4 text-green-700 bg-green-100 rounded">
          Event created successfully! Check console.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Short Description (Max 200 chars)
          </label>
          <input
            type="text"
            name="shortDescription"
            maxLength={200}
            value={formData.shortDescription}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category (Optimizer ID)
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="e.g. 64f..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="React, Workshop, Tech"
          />
        </div>

        {/* Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mode *
          </label>
          <select
            name="mode"
            required
            value={formData.mode}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Conditional Fields based on Mode */}
        {formData.mode === "online" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Online URL
            </label>
            <input
              type="url"
              name="onlineURL"
              value={formData.onlineURL}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        ) : (
          <div className="space-y-2 border p-3 rounded-md bg-gray-50">
            <h3 className="font-medium text-gray-800">Location Details</h3>
            <div>
              <label className="block text-sm text-gray-600">Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-600">City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-gray-600">Zip</label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600">Country</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date *
            </label>
            <input
              type="datetime-local"
              name="startDate"
              required
              value={formData.startDate}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date *
            </label>
            <input
              type="datetime-local"
              name="endDate"
              required
              value={formData.endDate}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* Organizer */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Organizer ID *
          </label>
          <input
            type="text"
            name="organizer"
            required
            value={formData.organizer}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            placeholder="Owner User ID"
          />
        </div>

        {/* Registration */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isRegistrationRequired"
            id="isRegistrationRequired"
            checked={formData.isRegistrationRequired}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isRegistrationRequired"
            className="ml-2 block text-sm text-gray-900"
          >
            Registration Required
          </label>
        </div>

        {/* Max Registrations */}
        {formData.isRegistrationRequired && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Max Registrations
            </label>
            <input
              type="number"
              name="maxRegistrations"
              value={formData.maxRegistrations}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {isLoading ? "Creating..." : "Create Event"}
        </button>
      </form>
    </div>
  );
}
