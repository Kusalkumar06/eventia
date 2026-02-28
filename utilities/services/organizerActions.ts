"use server";

import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/user.model";
import { revalidatePath } from "next/cache";

export async function requestOrganizerAccess(userId: string, reason: string) {
  try {
    await connectDb();
    const user = await UserModel.findById(userId);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (user.role === "organizer" || user.role === "admin") {
      return { success: false, error: "User already has elevated access" };
    }

    user.organizerStatus = "pending";
    user.organizerRequestReason = reason;
    await user.save();

    revalidatePath("/create-event");
    return { success: true };
  } catch (error: unknown) {
    console.error("Error requesting organizer access:", error);
    return { success: false, error: error instanceof Error ? error.message : "Failed to request access" };
  }
}
