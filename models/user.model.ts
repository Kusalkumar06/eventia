import mongoose from "mongoose";
import { Schema,Document,Model, } from "mongoose";

export interface IUser extends Document {
  name:string;
  email:string;
  password:string|null;
  image:string|null;
  bio:string;
  role: "user" | "admin" | "organizer";
  organizerStatus: "none" | "pending" | "approved" | "rejected";
  organizerRequestReason?: string;
  provider: "credentials" | "google" ;
  emailVerified:boolean;
  createdAt:Date;
  updatedAt:Date;
}

const userSchema = new Schema<IUser>(
  {
    name:{
      type: String,
      required:true,
      trim: true,
    },
    email:{
      type: String,
      required: true,
      unique: true,
      lowercase:true,
      index: true,
    },
    bio:{
      type: String,
      trim: true,
      default: "",
    },
    password:{
      type: String,
      default: null,
    },
    role:{
      type: String,
      enum: ["user", "admin", "organizer"],
      default: "user",
    },
    organizerStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    organizerRequestReason: {
      type: String,
    },
    provider:{
      type: String,
      enum: ["credentials", "google"],
      required: true,
    },
    emailVerified:{
      type: Boolean,
      default: false,
    },
  },
  { 
    timestamps: true,
    autoIndex: process.env.NODE_ENV !== "production"
  }
)

userSchema.index({ name: "text", email: "text" });

export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);