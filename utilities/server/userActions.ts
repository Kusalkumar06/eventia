"use server";

import { connectDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { UserModel } from "@/models/user.model";
import { EventModel } from "@/models/event.model";
import { RegistrationModel } from "@/models/registration.model";

export interface UserMetricDTO {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt: string;
  eventsOrganizedCount: number;
  eventsAttendedCount: number;
}

export async function getAdminUsersMetrics(): Promise<UserMetricDTO[]> {
  try {
    await requireAdmin();
    await connectDb();

    const users = await UserModel.find({}).lean();

    const metricsPromises = users.map(async (user) => {
      const organizedCount = await EventModel.countDocuments({
        organizer: user._id,
      });

      const attendedCount = await RegistrationModel.countDocuments({
        user: user._id,
      });

      return {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
        eventsOrganizedCount: organizedCount,
        eventsAttendedCount: attendedCount,
      };
    });

    const metrics = await Promise.all(metricsPromises);

    return metrics.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error("Failed to fetch user metrics:", error);
    throw new Error("Failed to fetch user metrics");
  }
}
