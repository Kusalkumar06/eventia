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

  status: "draft" | "published" | "rejected" | "cancelled";
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
      enum: ["draft", "published", "cancelled","rejected"],
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
  { 
    timestamps: true,
    // Disable automatic index creation in production for performance
    autoIndex: process.env.NODE_ENV !== "production"
  }
);

/**
 * INDEXES FOR PERFORMANCE OPTIMIZATION
 */

// 1. Unique index for slug-based lookups (Event Details page)
eventSchema.index({ slug: 1 }, { unique: true });

// 2. Index for status-based filtering (Draft/Published/Rejected)
eventSchema.index({ status: 1 });

// 3. Index for category-based filtering
eventSchema.index({ category: 1 });

// 4. Index for date-based sorting and filtering
eventSchema.index({ startDate: 1 });

// 5. Index for organizer-based queries (My Events page)
eventSchema.index({ organizer: 1 });

// 6. Compound index for public listings: Filter by published status AND sort by date
eventSchema.index({ status: 1, startDate: 1 });

// 7. Compound index for organizer dashboard: Filter by organizer AND sort by most recent
eventSchema.index({ organizer: 1, createdAt: -1 });

// 8. Text index for global search functionality
eventSchema.index({ title: "text", slug: "text" });

export const EventModel: Model<IEvent> = mongoose.models.Event || mongoose.model<IEvent>("Event", eventSchema);
