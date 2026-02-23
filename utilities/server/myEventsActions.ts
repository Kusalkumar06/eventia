import { connectDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guards";
import { EventModel } from "@/models/event.model";
import { RegistrationModel } from "@/models/registration.model";
import "@/models/category.model";
import "@/models/user.model";
import { Document } from "mongoose";

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
  await connectDb();
  const session = await requireAuth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const now = new Date();

  const organizingRaw = await EventModel.find({
    organizer: userId,
  })
    .populate("category", "name slug")
    .populate("organizer", "name email")
    .sort({ createdAt: -1 })
    .lean();
    
  const organizing = organizingRaw.map(serializeDateAndId);

  const attendingRegs = await RegistrationModel.find({
    user: userId,
  }).populate({
    path: "event",
    match: {
      status: "published",
      endDate: { $gt: now },
    },
    populate: [
      { path: "category", select: "name slug" },
      { path: "organizer", select: "name email" }
    ]
  });

  const attending = attendingRegs
    .map((r) => r.event as unknown as Record<string, unknown>)
    .filter(Boolean)
    .map(serializeDateAndId);

  const attendedRegs = await RegistrationModel.find({
    user: userId,
  }).populate({
    path: "event",
    match: {
      status: "published",
      endDate: { $lte: now },
    },
    populate: [
      { path: "category", select: "name slug" },
      { path: "organizer", select: "name email" }
    ]
  });

  const attended = attendedRegs
    .map((r) => r.event as unknown as Record<string, unknown>)
    .filter(Boolean)
    .map(serializeDateAndId);

  return { organizing, attending, attended };
}
