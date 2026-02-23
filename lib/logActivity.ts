import { connectDb } from "@/lib/db";
import { ActivityModel, ActionType } from "@/models/activity.model";
import mongoose from "mongoose";

interface LogActivityParams {
  actorId: string | mongoose.Types.ObjectId;
  actorRole: "user" | "admin";
  action: ActionType;
  entityType: "event" | "registration" | "user";
  entityId: string | mongoose.Types.ObjectId;
  message: string;
}

export async function logActivity({
  actorId,
  actorRole,
  action,
  entityType,
  entityId,
  message,
}: LogActivityParams) {
  try {
    await connectDb();

    await ActivityModel.create({
      actor: new mongoose.Types.ObjectId(actorId),
      actorRole,
      action,
      entityType,
      entityId: new mongoose.Types.ObjectId(entityId),
      message,
    });
  } catch (error: unknown) {
    console.error("Failed to log activity:", error);
  }
}
