"use server";

import { connectDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { UserModel } from "@/models/user.model";

export interface OrganizerRequestDTO {
  _id: string;
  name: string;
  email: string;
  reason?: string;
  createdAt: string;
}

export async function getPendingOrganizerRequests(): Promise<OrganizerRequestDTO[]> {
  try {
    await requireAdmin();
    await connectDb();

    const users = await UserModel.find({ 
      organizerStatus: "pending" 
    })
    .sort({ updatedAt: -1 })
    .lean();

    return users.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      reason: user.organizerRequestReason || "No reason provided",
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    }));
  } catch (error) {
    console.error("Failed to fetch pending requests:", error);
    throw new Error("Failed to fetch pending organizer requests");
  }
}

