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

/**
 * Log activity in a non-blocking (fire-and-forget) manner.
 * Main request will not wait for this to finish unless explicitly awaited.
 */
export function logActivity(params: LogActivityParams) {
  // Fire and forget: catch internal errors so they don't affect the caller
  logActivityInternal(params).catch((err) => {
    console.error(`[ActivityLogger] Error:`, err);
  });
}

/**
 * Internal async function that performs the actual database write.
 */
async function logActivityInternal({
  actorId,
  actorRole,
  action,
  entityType,
  entityId,
  message,
}: LogActivityParams) {
  try {
    // Ensure DB connection
    await connectDb();

    // Create log entry with normalized ObjectIds
    await ActivityModel.create({
      actor: new mongoose.Types.ObjectId(actorId),
      actorRole,
      action,
      entityType,
      entityId: new mongoose.Types.ObjectId(entityId),
      message,
    });
  } catch (error) {
    // Re-throw to be caught by the fire-and-forget wrapper
    throw error;
  }
}
