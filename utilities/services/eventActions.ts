"use server";

import { connectDb } from "@/lib/db";
import { requireAuth, requireOrganizer, requireAdmin } from "@/lib/auth-guards";
import { EventModel, IEvent } from "@/models/event.model";
import { CategoryModel } from "@/models/category.model";
import { EventDTO } from "@/types/types";
import { logActivity } from "@/lib/logActivity";
import mongoose from "mongoose";
import slugify from "slugify";
import { revalidatePath } from "next/cache";

type EventWithCategoryAndOrganizer = Omit<IEvent, "category" | "organizer"> & {
  category: {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
  };
  organizer: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
};

const mapEventToDTO = (event: EventWithCategoryAndOrganizer): EventDTO => ({
  _id: event._id.toString(),
  title: event.title,
  slug: event.slug,
  description: event.description,
  shortDescription: event.shortDescription,
  category: {
    _id: event.category._id.toString(),
    name: event.category.name,
    slug: event.category.slug,
  },
  otherCategoryLabel: event.otherCategoryLabel,
  tags: event.tags,
  mode: event.mode,
  location: event.location,
  onlineURL: event.onlineURL,
  startDate: event.startDate.toISOString(),
  endDate: event.endDate.toISOString(),
  status: event.status,
  organizer: {
    _id: event.organizer._id.toString(),
    name: event.organizer.name,
    email: event.organizer.email,
  },
  isRegistrationRequired: event.isRegistrationRequired,
  maxRegistrations: event.maxRegistrations,
  registrationsCount: event.registrationsCount,
  createdAt: event.createdAt.toISOString(),
  updatedAt: event.updatedAt.toISOString(),
});

export interface EventActionData {
  title: string;
  description: string;
  shortDescription?: string;
  category: string;
  otherCategoryLabel?: string;
  tags?: string[];
  mode: "online" | "offline";
  location?: {
    venue?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
  onlineURL?: string;
  startDate: string;
  endDate: string;
  isRegistrationRequired: boolean;
  maxRegistrations?: number;
}

export async function createEventAction(data: EventActionData) {
  try {
    const session = await requireAuth();

    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    await connectDb();

    const {
      title,
      description,
      shortDescription,
      category,
      otherCategoryLabel,
      tags,
      mode,
      location,
      onlineURL,
      startDate,
      endDate,
      isRegistrationRequired,
      maxRegistrations,
    } = data;

    const organizer = session.user.id;
    const status = "draft";
    const registrationsCount = 0;

    if (!title || !description || !category || !mode || !startDate || !endDate) {
      throw new Error("Missing required fields");
    }

    if (!mongoose.Types.ObjectId.isValid(category)) {
      throw new Error("Invalid category");
    }

    const categoryDoc = await CategoryModel.findById(category);
    if (!categoryDoc) {
      throw new Error("Category not found");
    }

    if (categoryDoc.slug === "others") {
      if (!otherCategoryLabel || otherCategoryLabel.trim().length < 3) {
        throw new Error("Please specify other category");
      }
    }

    if (categoryDoc.slug !== "others" && otherCategoryLabel) {
      throw new Error("otherCategoryLabel allowed only for Others category");
    }

    if (new Date(endDate) <= new Date(startDate)) {
      throw new Error("End date must be after start date");
    }

    if (mode === "online" && !onlineURL) {
      throw new Error("onlineURL is required for online events");
    }

    if (mode === "offline" && !location?.city) {
      throw new Error("Location is required for offline events");
    }

    if (isRegistrationRequired && (!maxRegistrations || maxRegistrations <= 0)) {
       throw new Error("maxRegistrations must be greater than 0 if registration is required");
    }

    let sanitizedTags: string[] = [];
    if (Array.isArray(tags)) {
      sanitizedTags = tags
        .filter((tag) => typeof tag === "string" && tag.trim() !== "")
        .map((tag) => tag.trim().toLowerCase());
    }

    const baseSlug = slugify(title, { lower: true, strict: true, trim: true });
    let slug = baseSlug;
    let count = 1;

    let isUnique = false;
    while (!isUnique) {
      const existing = await EventModel.findOne({ slug }).lean();
      if (!existing) {
        isUnique = true;
      } else {
        slug = `${baseSlug}-${count}`;
        count++;
      }
    }

    const event = await EventModel.create({
      title,
      description,
      shortDescription,
      category,
      otherCategoryLabel: categoryDoc.slug === "others" ? otherCategoryLabel : undefined,
      tags: sanitizedTags,
      mode,
      location: mode === "offline" ? location : undefined,
      onlineURL: mode === "online" ? onlineURL : undefined,
      startDate,
      endDate,
      isRegistrationRequired,
      maxRegistrations: isRegistrationRequired ? maxRegistrations : undefined,
      organizer,
      status,
      registrationsCount,
      slug,
    });

    await logActivity({
      actorId: session.user.id,
      actorRole: session.user.role as "user" | "admin",
      action: "EVENT_CREATED",
      entityType: "event",
      entityId: event._id,
      message: `Created a new event: ${event.title}`,
    });

    revalidatePath("/my-events");
    
    // Return a serialized representation of the event
    return { success: true, eventId: event._id.toString() };
  } catch (error: unknown) {
    console.error("Error creating event:", error);
    const message = error instanceof Error ? error.message : "Failed to create event";
    return { success: false, error: message };
  }
}

export async function updateEventAction(eventId: string, data: Partial<EventActionData>) {
    try {
        const session = await requireAuth();
        await connectDb();

        const event = await EventModel.findById(eventId);
    
        if (!event) {
          throw new Error("Event not found");
        }
    
        requireOrganizer(event.organizer.toString(), session.user.id);
        
        if (event.status !== "draft" && event.status !== "rejected" && event.status !== "published") {
          throw new Error("Can only edit draft, published or rejected events");
        }
    
        const updatableFields = [
          "title", "description", "shortDescription", "category",
          "tags", "mode", "location", "onlineURL", "startDate", "endDate",
          "isRegistrationRequired", "maxRegistrations", "otherCategoryLabel"
        ];
    
        updatableFields.forEach((field) => {
          const value = (data as Record<string, unknown>)[field];
          if (value !== undefined) {
            event.set(field, value);
          }
        });
    
        // Handle resetting rejection status to draft upon resubmission
        if (event.status === "rejected") {
          event.status = "draft";
          event.rejectionReason = "";
        }
    
        await event.save();
    
        await logActivity({
          actorId: session.user.id,
          actorRole: session.user.role as "user" | "admin",
          action: "EVENT_UPDATED",
          entityType: "event",
          entityId: event._id,
          message: `Updated event "${event.title}"`,
        });

        revalidatePath("/my-events");
        revalidatePath(`/events/${event.slug}`);

        return { success: true, eventId: event._id.toString() };
    } catch (error: unknown) {
        console.error("Error updating event:", error);
        const message = error instanceof Error ? error.message : "Failed to update event";
        return { success: false, error: message };
    }
}

export async function deleteEventAction(eventId: string) {
  try {
    const session = await requireAuth();
    await connectDb();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error("Invalid event ID");
    }

    const event = await EventModel.findById(eventId);

    if (!event) {
        throw new Error("Event not found");
    }

    if (event.status !== "rejected" && event.status !== "draft") {
        throw new Error("Only rejected or draft events can be deleted");
    }

    requireOrganizer(event.organizer.toString(), session.user.id);

    await EventModel.findByIdAndDelete(eventId);

    await logActivity({
        actorId: session.user.id,
        actorRole: session.user.role as "user" | "admin",
        action: "EVENT_DELETED",
        entityType: "event",
        entityId: event._id,
        message: `Deleted event "${event.title}"`,
    });

    revalidatePath("/my-events");

    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting event:", error);
    const message = error instanceof Error ? error.message : "Failed to delete event";
    return { success: false, error: message };
  }
}

export async function cancelEventAction(eventId: string) {
  try {
    const session = await requireAuth();
    await connectDb();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid event ID");
    }

    const event = await EventModel.findById(eventId);

    if (!event) {
        throw new Error("Event not found");
    }

    requireOrganizer(event.organizer.toString(), session.user.id);

    if (event.status !== "published") {
        throw new Error("Only published events can be cancelled.");
    }

    event.status = "cancelled";
    await event.save();

    await logActivity({
      actorId: session.user.id,
      actorRole: session.user.role as "user" | "admin",
      action: "EVENT_CANCELLED",
      entityType: "event",
      entityId: event._id,
      message: `Cancelled event: ${event.title}`,
    });

    revalidatePath("/my-events");
    revalidatePath(`/events/${event.slug}`);

    return { success: true };
  } catch (error: unknown) {
    console.error("Error cancelling event:", error);
    const message = error instanceof Error ? error.message : "Failed to cancel event";
    return { success: false, error: message };
  }
}

export async function publishEventAction(eventId: string) {
  try {
    const session = await requireAdmin();

    await connectDb();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid event ID");
    }

    const event = await EventModel.findById(eventId);

    if (!event) {
      throw new Error("Event not found");
    }

    if (event.status !== "draft") {
      throw new Error("Only draft or pending events can be published");
    }

    event.status = "published";
    event.rejectionReason = undefined; 
    await event.save();

    await logActivity({
      actorId: session.user.id,
      actorRole: "admin",
      action: "EVENT_PUBLISHED",
      entityType: "event",
      entityId: event._id,
      message: `Published event: ${event.title}`,
    });

    revalidatePath("/admin/pending-events");
    revalidatePath("/admin");
    revalidatePath("/events"); 
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Error publishing event:", error);
    const message = error instanceof Error ? error.message : "Failed to publish event";
    return { success: false, error: message };
  }
}

export async function rejectEventAction(eventId: string, reason: string) {
  try {
    const session = await requireAdmin();

    if (!reason || reason.trim() === "") {
        throw new Error("Rejection reason is required");
    }

    await connectDb();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        throw new Error("Invalid event ID");
    }

    const event = await EventModel.findById(eventId);

    if (!event) {
        throw new Error("Event not found");
    }

    if (event.status !== "draft") {
        throw new Error("Only draft events can be rejected");
    }

    event.status = "rejected";
    event.rejectionReason = reason;

    await event.save();

    await logActivity({
        actorId: session.user.id,
        actorRole: "admin",
        action: "EVENT_REJECTED",
        entityType: "event",
        entityId: event._id,
        message: `Rejected event: ${event.title} - Reason: ${reason}`,
    });

    revalidatePath("/admin/pending-events");
    revalidatePath("/admin");
    revalidatePath("/events"); 

    return { success: true };
  } catch (error: unknown) {
    console.error("Error rejecting event:", error);
    const message = error instanceof Error ? error.message : "Failed to reject event";
    return { success: false, error: message };
  }
}

export async function getLandingPageEvents(): Promise<EventDTO[]> {
  await connectDb();

  const now = new Date();
  
  const events = await EventModel.find({
    status: "published",
    endDate: { $gte: now },
  })
    .populate("category", "name slug")
    .populate("organizer", "name email")
    .sort({ startDate: 1 })
    .limit(6)
    .lean<EventWithCategoryAndOrganizer[]>();

  return events.map(mapEventToDTO);
}
