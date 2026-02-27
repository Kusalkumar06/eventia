"use server";

import { connectDb } from "@/lib/db";
import { requireAuth } from "@/lib/auth-guards";
import { EventModel } from "@/models/event.model";
import { RegistrationModel } from "@/models/registration.model";
import { logActivity } from "@/lib/logActivity";
import { sendEmail } from "@/lib/brevo";
import { format } from "date-fns";
import { revalidateTag, revalidatePath } from "next/cache";

export async function registerForEventAction(eventId: string) {
  try {
    await connectDb();
    const session = await requireAuth();

    const updatedEvent = await EventModel.findOneAndUpdate(
      {
        _id: eventId,
        status: "published",
        endDate: { $gt: new Date() },
        organizer: { $ne: session.user.id },
        isRegistrationRequired: true,
        $or: [
          { maxRegistrations: { $exists: false } },
          { maxRegistrations: null },
          { $expr: { $lt: ["$registrationsCount", "$maxRegistrations"] } }
        ]
      },
      { $inc: { registrationsCount: 1 } },
      { new: false } 
    );

    if (!updatedEvent) {
      throw new Error("Cannot register. Event may be full, ended, unpublished, not require registration, or you are the organizer.");
    }

    try {
      const registration = await RegistrationModel.create({
        event: eventId,
        user: session.user.id,
      });
      
      logActivity({
        actorId: session.user.id,
        actorRole: session.user.role as "user" | "admin",
        action: "EVENT_REGISTERED",
        entityType: "registration",
        entityId: registration._id,
        message: `Registered for event: ${updatedEvent.title}`,
      });

      const gcalStart = new Date(updatedEvent.startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
      const gcalEnd = new Date(updatedEvent.endDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
      const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(updatedEvent.title)}&dates=${gcalStart}/${gcalEnd}&details=${encodeURIComponent(updatedEvent.shortDescription || "")}&location=${encodeURIComponent(updatedEvent.mode === "offline" && updatedEvent.location ? `${updatedEvent.location.venue}, ${updatedEvent.location.city}` : "Online")}`;

      const dateStr = `${new Date(updatedEvent.startDate).toLocaleDateString()} - ${new Date(updatedEvent.endDate).toLocaleDateString()}`;
      
      const locationStr = updatedEvent.mode === "offline" && updatedEvent.location 
        ? `${updatedEvent.location.venue}, ${updatedEvent.location.city}` 
        : "Online Event";

      const onlineUrlStr = updatedEvent.mode === "online" && updatedEvent.onlineURL
        ? `
              <div style="margin-bottom: 12px; display: flex; align-items: center;">
                🔗 <strong>Online Link:</strong> &nbsp;<a href="${updatedEvent.onlineURL}" target="_blank" style="color: #d97706;">${updatedEvent.onlineURL}</a>
              </div>
          `
        : "";

      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #d97706; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Application Successful!</h1>
          </div>
          
          <div style="padding: 32px 24px;">
            <p style="font-size: 16px;">You have successfully applied for <strong>${updatedEvent.title}</strong>.</p>
            
            <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin: 24px 0;">
              <h3 style="color: #78350f; margin-top: 0; margin-bottom: 16px;">${updatedEvent.title}</h3>
              
              <div style="margin-bottom: 12px; display: flex; align-items: center;">
                📅 <strong>Date:</strong> &nbsp;${dateStr}
              </div>
              
              <div style="margin-bottom: 12px; display: flex; align-items: center;">
                📍 <strong>Venue:</strong> &nbsp;${locationStr}
              </div>
              
${onlineUrlStr}
            </div>
            
            <p style="font-size: 14px; margin-bottom: 24px;">Don't miss out! Add this event to your calendar now.</p>
            
            <div style="text-align: center;">
              <a href="${gcalUrl}" style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                📅 Add to Google Calendar
              </a>
            </div>
            
            <p style="margin-top: 32px; font-size: 14px; text-align: center;">Good luck with the event! We'll keep you posted on any updates.</p>
          </div>
          
          <div style="background-color: #333; color: white; text-align: center; padding: 16px; border-radius: 0 0 8px 8px; font-size: 12px;">
            &copy; ${new Date().getFullYear()} Eventia. All rights reserved.
          </div>
        </div>
      `;

      try {
        if (session.user.email) {
          await sendEmail({
            to: session.user.email,
            subject: `Registration Confirmed: ${updatedEvent.title}`,
            htmlContent,
          });
        }
      } catch (emailError) {
        console.error("Failed to send registration confirmation email", emailError);
      }

      // @ts-expect-error: Next.js types mismatch in this environment
      revalidateTag(`event-${updatedEvent.slug}`);
      // @ts-expect-error: Next.js types mismatch in this environment
      revalidateTag("events-list");
      // @ts-expect-error: Next.js types mismatch in this environment
      revalidateTag(`user-events-${session.user.id}`);
      revalidatePath(`/events/${updatedEvent.slug}`);

      return { success: true };
    } catch (error: unknown) {
      console.error("Error registering for event:", error);
      const message = error instanceof Error ? error.message : "Failed to register for event";

      // Rollback the increment if registration creation fails, ensuring it doesn't go below zero
      await EventModel.updateOne(
        { _id: eventId, registrationsCount: { $gt: 0 } },
        { $inc: { registrationsCount: -1 } }
      );
      
      if (typeof error === 'object' && error !== null && 'code' in error && (error as { code?: number }).code === 11000) {
        return { success: false, error: "Already registered" };
      }
      return { success: false, error: message };
    }
  } catch (error: unknown) {
    console.error("Error registering for event:", error);
    const message = error instanceof Error ? error.message : "Failed to register for event";
    return { success: false, error: message };
  }
}

export async function unregisterFromEventAction(eventId: string) {
    try {
        await connectDb();
        const session = await requireAuth();
    
        if (!session) {
          throw new Error("Unauthorized");
        }
    
        if (!eventId) {
          throw new Error("Event ID is required");
        }
    
        const event = await EventModel.findById(eventId);
        if (!event) {
          throw new Error("Event not found");
        }
    
        const deleted = await RegistrationModel.findOneAndDelete({
          user: session.user.id,
          event: eventId,
        });
    
        if (!deleted) {
          throw new Error("Not registered");
        }
    
        await EventModel.findOneAndUpdate(
          { _id: eventId, registrationsCount: { $gt: 0 } },
          { $inc: { registrationsCount: -1 } }
        );
    
        logActivity({
          actorId: session.user.id,
          actorRole: session.user.role as "user" | "admin",
          action: "EVENT_UNREGISTERED",
          entityType: "registration",
          entityId: deleted._id,
          message: `Unregistered from event: ${event.title}`,
        });
    
        try {
          if (session.user.email) {
            const dateStr = format(new Date(event.startDate), "PPP 'at' p");
    
            const htmlContent = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                <div style="background-color: #ef4444; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h1 style="color: white; margin: 0; font-size: 24px;">Unregistration Confirmed</h1>
                </div>
                
                <div style="padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
                  <h2 style="color: #ef4444; margin-top: 0;">Hello,</h2>
                  <p style="font-size: 16px;">This email confirms that you have successfully <strong>unregistered</strong> from the following event.</p>
                  
                  <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 24px 0;">
                    <h3 style="color: #991b1b; margin-top: 0; margin-bottom: 16px;">${event.title}</h3>
                    
                    <div style="margin-bottom: 12px; display: flex; align-items: center;">
                      📅 <strong>Date:</strong> &nbsp;${dateStr}
                    </div>
                  </div>
                  
                  <p style="color: #6b7280; font-size: 14px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
                    Changed your mind? You can always register again from the <a href="${process.env.NEXT_PUBLIC_APP_URL}/events/${event.slug}" style="color: #d97706;">event page</a>, provided there are still open slots.
                  </p>
                </div>
              </div>
            `;
    
            await sendEmail({
              to: session.user.email,
              subject: `Cancellation Confirmed: ${event.title}`,
              htmlContent,
            });
          }
        } catch (emailError) {
          console.error("Failed to send unregistration confirmation email", emailError);
        }
    
        // @ts-expect-error: Next.js types mismatch in this environment
        revalidateTag(`event-${event.slug}`);
        // @ts-expect-error: Next.js types mismatch in this environment
        revalidateTag("events-list");
        // @ts-expect-error: Next.js types mismatch in this environment
        revalidateTag(`user-events-${session.user.id}`);
        revalidatePath(`/events/${event.slug}`);
        console.log("Revalidating tag:", `event-${event.slug}`);

        return { success: true };
    
      } catch (error: unknown) {
        console.error("Error unregistering for event:", error);
        const message = error instanceof Error ? error.message : "Failed to unregister for event";
        return { success: false, error: message };
      }
}
