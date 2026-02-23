import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/user.model";

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { name, bio, image } = await req.json();

    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { message: "Name is required." },
        { status: 400 }
      );
    }

    await connectDb();

    // Prepare update object, only allowing specific fields
    const updates: { name: string; bio?: string; image?: string } = {
      name: name.trim()
    };
    
    // allow empty string for bio to clear it
    if (bio !== undefined) {
      updates.bio = typeof bio === "string" ? bio.trim() : "";
    }
    
    if (image && typeof image === "string" && image.trim() !== "") {
      updates.image = image.trim();
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password").lean();

    if (!updatedUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Profile updated successfully.", user: updatedUser },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Error updating user profile:", error);
    const message = error instanceof Error ? error.message : "Failed to update profile.";
    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
