import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOtp extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  purpose: "verify" | "reset";
  createdAt: Date;
}

const OtpSchema = new Schema<IOtp>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },

    otp: {
      type: String,
      required: true,
    },

    purpose: {
      type: String,
      enum: ["verify", "reset"],
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { 
    timestamps: { createdAt: true, updatedAt: false },
    autoIndex: process.env.NODE_ENV !== "production"
  }
);

OtpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Otp: Model<IOtp> = mongoose.models.Otp || mongoose.model<IOtp>("Otp", OtpSchema);


