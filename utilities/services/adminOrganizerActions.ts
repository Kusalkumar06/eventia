"use server";

import { connectDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { UserModel } from "@/models/user.model";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/brevo";

export async function updateOrganizerStatus(userId: string, action: "approve" | "reject") {
  try {
    await requireAdmin();
    await connectDb();

    const user = await UserModel.findById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    if (action === "approve") {
      user.role = "organizer";
      user.organizerStatus = "approved";
    } else if (action === "reject") {
      user.organizerStatus = "rejected";
    }

    await user.save();
    revalidatePath("/admin/users/organizer-requests");
    revalidatePath("/admin");

    if (action === "approve") {
      await sendEmail({
        to: user.email,
        subject: "🎉 You're an Organizer! Welcome to Eventia",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background-color: #d97706; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Eventia Organizers!</h1>
            </div>
            
            <div style="padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #d97706; margin-top: 0;">Hi ${user.name},</h2>
              <p style="font-size: 16px;">Great news! Your request for organizer access has been <strong>approved</strong>.</p>
              
              <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; font-size: 15px; color: #78350f;">You can now log in and access your Organizer Dashboard to start creating and managing extraordinary events.</p>
              </div>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/organizer" style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px; text-align: center;">
                Happy hosting, <br/>The Eventia Admin Team
              </p>
            </div>
          </div>
        `,
      });
    } else if (action === "reject") {
      await sendEmail({
        to: user.email,
        subject: "Update on your Eventia Organizer Application",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background-color: #ef4444; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Update on Organizer Application</h1>
            </div>
            
            <div style="padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #ef4444; margin-top: 0;">Hi ${user.name},</h2>
              <p style="font-size: 16px;">Thank you for your interest in becoming an organizer on Eventia.</p>
              
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <p style="margin: 0; font-size: 15px; color: #991b1b;">Unfortunately, we are unable to approve your application at this time.</p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                If you have any questions or feel this was a mistake, please reach out to our support team.
              </p>
            </div>
          </div>
        `,
      });
    }
    
    return { success: true };
  } catch (error: unknown) {
    console.error(`Failed to ${action} organizer request:`, error);
    return { success: false, error: error instanceof Error ? error.message : `Failed to ${action} request` };
  }
}

export async function revokeOrganizerAccess(userId: string) {
  try {
    await requireAdmin();
    await connectDb();

    const user = await UserModel.findById(userId);
    if (!user) {
      return { success: false, error: "User not found" };
    }

    user.role = "user";
    user.organizerStatus = "none";
    
    await user.save();
    
    revalidatePath("/admin/users");
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error: unknown) {
    console.error(`Failed to revoke organizer access:`, error);
    return { success: false, error: error instanceof Error ? error.message : `Failed to revoke organizer access` };
  }
}
