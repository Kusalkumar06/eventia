import { NextRequest,NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guards";
import { EventModel } from "@/models/event.model";
import { RegistrationModel } from "@/models/registration.model";

export async function POST(req:NextRequest){
  try {
    await connectDb();
    const session = await requireAuth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 });
    }

    const event = await EventModel.findById(eventId);
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    const deleted = await RegistrationModel.findOneAndDelete({
      user: session.user.id,
      event: eventId,
    });

    if (!deleted) {
      return NextResponse.json({ error: "Not registered" }, { status: 400 });
    }

    event.registrationsCount--;
    await event.save();

    return NextResponse.json({ message: "Unregistered" }, { status: 200 });
    
  } catch (error) {
      console.error("Error registering for event:", error);
      return NextResponse.json({ error: "Failed to register for event" }, { status: 500 });
  }
}