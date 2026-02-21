import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;

  category: mongoose.Types.ObjectId;
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

  startDate: Date;
  endDate: Date;

  status: "draft" | "published" | "rejected" | "cancelled" | "completed";
  rejectionReason?: string | null;

  organizer: mongoose.Types.ObjectId;

  isRegistrationRequired: boolean;
  maxRegistrations?: number;
  registrationsCount: number;

  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new Schema<IEvent>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
    },

    shortDescription: {
      type: String,
      maxlength: 200,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    otherCategoryLabel: {
      type: String,
      trim: true,
      maxlength: 50,
    },

    tags: [
      {
        type: String,
        lowercase: true,
        trim: true,
      },
    ],

    mode: {
      type: String,
      enum: ["online", "offline"],
      required: true,
    },

    location: {
      venue: String,
      city: String,
      state: String,
      zip: String,
      country: String,
    },

    onlineURL: {
      type: String,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["draft", "published", "completed", "cancelled","rejected"],
      default: "draft",
      index: true,
    },

    rejectionReason: {
      type: String,
      default: null,
    },

    organizer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    isRegistrationRequired: {
      type: Boolean,
      default: false,
    },

    maxRegistrations: {
      type: Number,
      min: 1,
    },

    registrationsCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

eventSchema.index({ title: "text", slug: "text" });

export const EventModel: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
