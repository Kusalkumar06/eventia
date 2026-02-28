"use server";

import { connectDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { UserModel } from "@/models/user.model";

export interface UserMetricDTO {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "organizer";
  createdAt: string;
  eventsOrganizedCount: number;
  eventsAttendedCount: number;
}

export async function getAdminUsersMetrics(): Promise<UserMetricDTO[]> {
  try {
    await requireAdmin();
    await connectDb();

    const metrics = await UserModel.aggregate([
      {
        $lookup: {
          from: "events",
          localField: "_id",
          foreignField: "organizer",
          as: "organizedEvents",
        },
      },
      {
        $lookup: {
          from: "registrations",
          localField: "_id",
          foreignField: "user",
          as: "attendedEvents",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          role: 1,
          createdAt: 1,
          eventsOrganizedCount: { $size: "$organizedEvents" },
          eventsAttendedCount: { $size: "$attendedEvents" },
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return metrics.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
      eventsOrganizedCount: user.eventsOrganizedCount,
      eventsAttendedCount: user.eventsAttendedCount,
    }));
  } catch (error) {
    console.error("Failed to fetch user metrics:", error);
    throw new Error("Failed to fetch user metrics");
  }
}
