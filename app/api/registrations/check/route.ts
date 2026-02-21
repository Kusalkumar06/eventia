import { NextRequest,NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guards";
import { RegistrationModel } from "@/models/registration.model";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    const session = await requireAuth();

    const { eventId } = await req.json();

    if (!eventId) {
      return NextResponse.json(
        { error: "Event ID is required" },
        { status: 400 }
      );
    }

    const isExists = await RegistrationModel.exists({
      event: eventId,
      user: session.user.id,
    });

    return NextResponse.json({ registered: !!isExists }, { status: 200 });
    
  } catch (error) {
    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json({ registered: false, message: "Unauthenticated" }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ message }, { status: 500 });
  }
}