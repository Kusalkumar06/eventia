"use server";

import { connectDb } from "@/lib/db";
import { requireOrganizer, requireAdmin } from "@/lib/auth-guards";
import { EventModel } from "@/models/event.model";
import { CategoryModel } from "@/models/category.model";
import { UserModel } from "@/models/user.model";
import { logActivity } from "@/lib/logActivity";
import { sendEmail } from "@/lib/brevo";
import mongoose from "mongoose";
import slugify from "slugify";
import { revalidateTag, revalidatePath } from "next/cache";


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
    const session = await requireOrganizer();

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

    logActivity({
      actorId: session.user.id,
      actorRole: session.user.role as "user" | "admin",
      action: "EVENT_CREATED",
      entityType: "event",
      entityId: event._id,
      message: `Created a new event: ${event.title}`,
    });

    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag("admin-events");
    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag(`user-events-${session.user.id}`);
    revalidatePath("/admin/events");

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
        const session = await requireOrganizer();
        await connectDb();

        const event = await EventModel.findById(eventId);
    
        if (!event) {
          throw new Error("Event not found");
        }
    
        if (event.organizer.toString() !== session.user.id && session.user.role !== "admin") {
          throw new Error("Forbidden: You are not the organizer of this event.");
        }
        
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
    
        logActivity({
          actorId: session.user.id,
          actorRole: session.user.role as "user" | "admin",
          action: "EVENT_UPDATED",
          entityType: "event",
          entityId: event._id,
          message: `Updated event "${event.title}"`,
        });

        // @ts-expect-error: Next.js types mismatch in this environment
        revalidateTag("admin-events");
        // @ts-expect-error: Next.js types mismatch in this environment
        revalidateTag(`user-events-${session.user.id}`);
        // @ts-expect-error: Next.js types mismatch in this environment
        revalidateTag(`event-${event.slug}`);
        // If it's already published, update lists too
        if (event.status === "published") {
          // @ts-expect-error: Next.js types mismatch in this environment
          revalidateTag("events-list");
        }
        revalidatePath(`/events/${event.slug}`);
        revalidatePath("/admin/events");

        return { success: true, eventId: event._id.toString() };
    } catch (error: unknown) {
        console.error("Error updating event:", error);
        const message = error instanceof Error ? error.message : "Failed to update event";
        return { success: false, error: message };
    }
}

export async function deleteEventAction(eventId: string) {
  try {
    const session = await requireOrganizer();
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

    if (event.organizer.toString() !== session.user.id && session.user.role !== "admin") {
      throw new Error("Forbidden: You are not the organizer of this event.");
    }

    await EventModel.findByIdAndDelete(eventId);

    logActivity({
        actorId: session.user.id,
        actorRole: session.user.role as "user" | "admin",
        action: "EVENT_DELETED",
        entityType: "event",
        entityId: event._id,
        message: `Deleted event "${event.title}"`,
    });

    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag("admin-events");
    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag(`user-events-${session.user.id}`);
    revalidatePath("/admin/events");


    return { success: true };
  } catch (error: unknown) {
    console.error("Error deleting event:", error);
    const message = error instanceof Error ? error.message : "Failed to delete event";
    return { success: false, error: message };
  }
}

export async function cancelEventAction(eventId: string) {
  try {
    const session = await requireOrganizer();
    await connectDb();

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      throw new Error("Invalid event ID");
    }

    const event = await EventModel.findById(eventId);

    if (!event) {
        throw new Error("Event not found");
    }

    if (event.organizer.toString() !== session.user.id && session.user.role !== "admin") {
      throw new Error("Forbidden: You are not the organizer of this event.");
    }

    if (event.status !== "published") {
        throw new Error("Only published events can be cancelled.");
    }

    event.status = "cancelled";
    await event.save();

    logActivity({
      actorId: session.user.id,
      actorRole: session.user.role as "user" | "admin",
      action: "EVENT_CANCELLED",
      entityType: "event",
      entityId: event._id,
      message: `Cancelled event: ${event.title}`,
    });

    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag("events-list");
    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag(`event-${event.slug}`);
    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag("admin-events");
    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag(`user-events-${session.user.id}`);
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/admin/events");

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

    logActivity({
      actorId: session.user.id,
      actorRole: "admin",
      action: "EVENT_PUBLISHED",
      entityType: "event",
      entityId: event._id,
      message: `Published event: ${event.title}`,
    });

    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag("events-list");
    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag("admin-events");
    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag(`event-${event.slug}`);
    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag(`user-events-${event.organizer.toString()}`);
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/admin/events");
    
    // Fetch Organizer Email
    const organizerDoc = await UserModel.findById(event.organizer).select("email name");
    if (organizerDoc?.email) {
      await sendEmail({
        to: organizerDoc.email,
        subject: "🎉 Your Event is Live!",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background-color: #d97706; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Your Event is Live!</h1>
            </div>
            
            <div style="padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #d97706; margin-top: 0;">Hi ${organizerDoc.name},</h2>
              <p style="font-size: 16px;">Great news! Your event <strong>${event.title}</strong> has been approved and is now published on Eventia.</p>
              
              <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin: 24px 0;">
                 <p style="margin: 0; font-size: 15px; color: #78350f;">Attendees can now start registering. You can monitor your event's performance anytime from your Organizer Dashboard.</p>
              </div>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/events/${event.slug}" style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  View Event Page
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
                Happy hosting, <br/>The Eventia Team
              </p>
            </div>
          </div>
        `,
      });
    }

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

    logActivity({
        actorId: session.user.id,
        actorRole: "admin",
        action: "EVENT_REJECTED",
        entityType: "event",
        entityId: event._id,
        message: `Rejected event: ${event.title} - Reason: ${reason}`,
    });

    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag("admin-events");
    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag(`event-${event.slug}`);
    // @ts-expect-error: Next.js types mismatch in this environment
    revalidateTag(`user-events-${event.organizer.toString()}`);
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/admin/events");

    // Fetch Organizer Email
    const organizerDoc = await UserModel.findById(event.organizer).select("email name");
    if (organizerDoc?.email) {
      await sendEmail({
        to: organizerDoc.email,
        subject: "Requires Action: Update on your Event Submission",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background-color: #ef4444; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Action Required: Event Submission</h1>
            </div>
            
            <div style="padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #ef4444; margin-top: 0;">Hi ${organizerDoc.name},</h2>
              <p style="font-size: 16px;">Your recent event submission, <strong>${event.title}</strong>, was reviewed by the Eventia Admin Team.</p>
              <p style="font-size: 16px;">Unfortunately, it couldn't be published and requires revisions based on the following feedback:</p>
              
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <blockquote style="margin: 0; padding-left: 16px; border-left: 4px solid #ef4444; color: #991b1b; font-style: italic;">
                  ${reason}
                </blockquote>
              </div>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/organizer" style="background-color: #18181b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                You can edit your draft event straight from your Organizer Dashboard and resubmit it.
              </p>
            </div>
          </div>
        `,
      });
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("Error rejecting event:", error);
    const message = error instanceof Error ? error.message : "Failed to reject event";
    return { success: false, error: message };
  }
}

