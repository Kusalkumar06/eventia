import { NextResponse,NextRequest } from "next/server";
import { connectDb } from "@/lib/db";
import { EventModel } from "@/models/event.model";
import { requireAuth } from "@/lib/auth-guards";
import { RegistrationModel } from "@/models/registration.model";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await requireAuth();

    const { eventId } = await req.json();

    const event = await EventModel.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event.status !== "published") {
      return NextResponse.json({ error: "Event is not published" }, { status: 400 });
    }

    if (event.isRegistrationRequired && event.maxRegistrations && event.registrationsCount >= event.maxRegistrations) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }

    const registration = await RegistrationModel.create({
      event: eventId,
      user: session.user.id,
    });

    event.registrationsCount++;
    await event.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error registering for event:", error);
    return NextResponse.json({ error: "Failed to register for event" }, { status: 500 });
  }
}