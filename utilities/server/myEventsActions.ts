import { connectDb } from "@/lib/db";
import { requireAuth, requireOrganizer } from "@/lib/auth-guards";
import { EventModel } from "@/models/event.model";
import { RegistrationModel } from "@/models/registration.model";
import "@/models/category.model";
import "@/models/user.model";
import { Document } from "mongoose";
import { EventDTO } from "@/types/types";

import { unstable_cache } from "next/cache";

function serializeDateAndId(doc: Document | Record<string, unknown>) {
  if (!doc) return doc;
  const obj = typeof (doc as Document).toObject === 'function' 
    ? (doc as Document).toObject() 
    : { ...doc } as Record<string, unknown>;
  
  if (obj._id) obj._id = obj._id.toString();
  
  if (obj.category) {
    if (typeof obj.category === 'object' && obj.category !== null) {
      if ('_id' in obj.category) {
        (obj.category as Record<string, unknown>)._id = String((obj.category as Record<string, unknown>)._id);
      }
    } else {
      obj.category = obj.category.toString();
    }
  }
  
  if (obj.organizer) {
    if (typeof obj.organizer === 'object' && obj.organizer !== null) {
      if ('_id' in obj.organizer) {
        (obj.organizer as Record<string, unknown>)._id = String((obj.organizer as Record<string, unknown>)._id);
      }
    } else {
      obj.organizer = obj.organizer.toString();
    }
  }
  
  if (obj.startDate instanceof Date) obj.startDate = obj.startDate.toISOString();
  if (obj.endDate instanceof Date) obj.endDate = obj.endDate.toISOString();
  if (obj.createdAt instanceof Date) obj.createdAt = obj.createdAt.toISOString();
  if (obj.updatedAt instanceof Date) obj.updatedAt = obj.updatedAt.toISOString();
  
  return obj;
} 

export async function getMyEventsData() {
  const session = await requireAuth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  return unstable_cache(
    async () => {
      await connectDb();
      const now = new Date();

      const [organizingRaw, registrations] = await Promise.all([
        EventModel.find({
          organizer: userId,
        })
          .populate("category", "name slug")
          .populate("organizer", "name email")
          .sort({ createdAt: -1 })
          .lean(),

        RegistrationModel.find({
          user: userId,
        })
          .populate({
            path: "event",
            match: {
              status: "published",
            },
            populate: [
              { path: "category", select: "name slug" },
              { path: "organizer", select: "name email" },
            ],
          })
          .lean(),
      ]);

      const organizing = organizingRaw.map(serializeDateAndId) as unknown as EventDTO[];

      const attending: EventDTO[] = [];
      const attended: EventDTO[] = [];

      interface PopulatedRegistration {
        event: Record<string, unknown> | null;
      }

      for (const reg of registrations as unknown as PopulatedRegistration[]) {
        const event = reg.event;
        if (!event) continue;

        const endDate = new Date(event.endDate as string);
        const serializedEvent = serializeDateAndId(event as unknown as Document) as unknown as EventDTO;
        
        if (endDate > now) {
          attending.push(serializedEvent);
        } else {
          attended.push(serializedEvent);
        }
      }

      return { organizing, attending, attended };
    },
    ["my-events", userId],
    { tags: [`user-events-${userId}`] }
  )();
}

export async function getOrganizerRecentActivity(userId: string) {
  try {
    await requireOrganizer();
    await connectDb();

    // Find all events owned by this organizer
    const events = await EventModel.find({ organizer: userId }).select("_id").lean();
    const eventIds = events.map(e => e._id);

    if (eventIds.length === 0) {
      return [];
    }

    interface PopulatedActivity {
      _id: { toString(): string };
      action: string;
      message: string;
      createdAt: Date | string;
      actor?: {
        name: string;
        email: string;
      };
    }

    const { ActivityModel } = await import("@/models/activity.model");

    const recentActivitiesRaw = await ActivityModel.find({
      entityId: { $in: eventIds }
    })
      .populate("actor", "name email")
      .sort({ createdAt: -1 })
      .limit(6)
      .lean() as unknown as PopulatedActivity[];

    return recentActivitiesRaw.map((act) => ({
      _id: act._id?.toString(),
      action: act.action,
      message: act.message,
      createdAt:
        act.createdAt instanceof Date
          ? act.createdAt.toISOString()
          : act.createdAt,
      actor: act.actor
        ? {
            name: act.actor.name,
            email: act.actor.email,
          }
        : { name: "System", email: "" },
    }));
  } catch (error) {
    console.error("Failed to fetch organizer recent activity:", error);
    return [];
  }
}
