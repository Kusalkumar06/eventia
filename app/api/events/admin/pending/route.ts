import { NextResponse } from "next/server";
import { connectDb } from "@/app/utilities/db";
import { EventModel } from "@/app/api/models/event.model";
import { requireAdmin } from "@/app/lib/auth-guards";

export async function GET() {
  try {
    await connectDb();
    await requireAdmin();

    const events = await EventModel.find({ status: "draft" })
      .populate("organizer", "name email")
      .populate("category", "name slug")
      .sort({ createdAt: -1 });

    return NextResponse.json(events);

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
