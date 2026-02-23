"use server";

import { connectDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guards";
import { UserModel } from "@/models/user.model";
import { revalidatePath } from "next/cache";
import { hash, compare } from "bcrypt";

export async function updateProfileAction(data: { name: string; bio?: string }) {
  try {
    const session = await requireAuth();
    await connectDb();

    if (!data.name || data.name.trim() === "") {
        throw new Error("Name is required");
    }

    const updates: { name: string; bio?: string } = {
        name: data.name.trim()
    };
    
    // allow empty string for bio to clear it
    if (data.bio !== undefined) {
        updates.bio = data.bio.trim();
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      session.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select("-password").lean();

    if (!updatedUser) {
        throw new Error("User not found");
    }

    revalidatePath("/profile");
    
    return { success: true };
  } catch (error: unknown) {
    console.error("Error updating profile:", error);
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return { success: false, error: message };
  }
}

export async function changePasswordAction(currentPassword: string, newPassword: string) {
    try {
        const session = await requireAuth();
        await connectDb();

        const user = await UserModel.findById(session.user.id);
        if (!user) {
            throw new Error("User not found");
        }

        if (!user.password) {
            throw new Error("You signed in with a Google account. Set a password first to enable email/password sign-in.");
        }

        if (!currentPassword || !newPassword) {
            throw new Error("Current and new passwords are required");
        }

        const isValid = await compare(currentPassword, user.password);
        if (!isValid) {
            throw new Error("Incorrect current password.");
        }

        user.password = await hash(newPassword, 10);
        await user.save();

        revalidatePath("/profile");

        return { success: true };
    } catch (error: unknown) {
        console.error("Error changing password:", error);
        const message = error instanceof Error ? error.message : "Failed to change password";
        return { success: false, error: message };
    }
}

export async function setPasswordAction(newPassword: string) {
    try {
        const session = await requireAuth();
        await connectDb();

        const user = await UserModel.findById(session.user.id);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.password) {
            throw new Error("Account already has a password");
        }

        if (!newPassword || newPassword.length < 6) {
            throw new Error("Password must be at least 6 characters long");
        }

        user.password = await hash(newPassword, 10);
        await user.save();

        revalidatePath("/profile");

        return { success: true };
    } catch (error: unknown) {
        console.error("Error setting password:", error);
        const message = error instanceof Error ? error.message : "Failed to set password";
        return { success: false, error: message };
    }
}
