import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/app/utilities/db";
import { EventModel } from "@/app/api/models/event.model";
import { requireAdmin } from "@/app/lib/auth-guards";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDb();
    await requireAdmin();


    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid event ID" },{ status: 400 });
    }

    const event = await EventModel.findById(id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" },{ status: 404 });
    }

    if (event.status !== "draft") {
      return NextResponse.json({ error: "Only draft events can be published" },{ status: 400 });
    }

    event.status = "published";
    event.rejectionReason = null;

    await event.save();

    return NextResponse.json({message: "Event published successfully",eventId: event._id,});

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" },{ status: 500 });
  }
}
