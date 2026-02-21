import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { EventModel } from "@/models/event.model";
import { requireAdmin } from "@/lib/auth-guards";
import mongoose from "mongoose";

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    await connectDb();
    await requireAdmin();


    const { id } = params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.log(id)
      return NextResponse.json({ error: "Invalid event ID" },{ status: 400 });
    }

    const event = await EventModel.findById(id);

    if (!event) {
      return NextResponse.json({ error: "Event not found" },{ status: 404 });
    }

    if (event.status !== "draft") {
      return NextResponse.json({ error: "Only draft or pending events can be published" },{ status: 400 });
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
