import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRegistration extends Document {
  user: mongoose.Types.ObjectId;
  event: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
      index: true,
    },
  },
  { 
    timestamps: true,
    autoIndex: process.env.NODE_ENV !== "production"
  }
);

registrationSchema.index({ user: 1, event: 1 }, { unique: true });

export const RegistrationModel: Model<IRegistration> = mongoose.models.Register || mongoose.model<IRegistration>("Register",  registrationSchema);
