import mongoose, { Schema, Document, Model } from "mongoose";

export const ACTION_TYPES = {
  EVENT_CREATED: "EVENT_CREATED",
  EVENT_UPDATED: "EVENT_UPDATED",
  EVENT_DELETED: "EVENT_DELETED",
  EVENT_PUBLISHED: "EVENT_PUBLISHED",
  EVENT_REJECTED: "EVENT_REJECTED",
  EVENT_REGISTERED: "EVENT_REGISTERED",
  EVENT_UNREGISTERED: "EVENT_UNREGISTERED",
  EVENT_CANCELLED: "EVENT_CANCELLED",
} as const;

export type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES];

export interface IActivity extends Document {
  actor: mongoose.Types.ObjectId;
  actorRole: "user" | "admin";
  action: ActionType;
  entityType: "event" | "registration";
  entityId: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    actor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    actorRole: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },
    action: {
      type: String,
      enum: Object.values(ACTION_TYPES),
      required: true,
      index: true,
    },
    entityType: {
      type: String,
      enum: ["event", "registration"],
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { 
    timestamps: true,
    autoIndex: process.env.NODE_ENV !== "production"
  }
);

// Add descending index on createdAt for dashboard performance
activitySchema.index({ createdAt: -1 });

// Compound indexes for common query patterns
activitySchema.index({ actor: 1, createdAt: -1 });
activitySchema.index({ entityId: 1, createdAt: -1 });
activitySchema.index({ action: 1, createdAt: -1 });

export const ActivityModel: Model<IActivity> =
  mongoose.models.Activity || mongoose.model<IActivity>("Activity", activitySchema);
