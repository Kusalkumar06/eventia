import {NextRequest,NextResponse} from "next/server";
import { connectDb } from "@/lib/db";
import { Otp } from "../../../../models/otp.model";
import { UserModel } from "../../../../models/user.model";
import bcrypt from "bcrypt";
import { otpVerifyLimiter } from "@/lib/rateLimiter";
import { sendEmail } from "@/lib/brevo";


export async function POST(req: NextRequest) {
  try{
    await connectDb();

    const body = await req.json();

    const email: string = body.email;
    const otp: string = body.otp;
    const purpose: "verify" | "reset" = body.purpose;
    console.log(email, otp, purpose);

    if(!email || !otp || !purpose){
      return NextResponse.json({ error: "Missing fields" }, {status: 400,})
    }

    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";

    const { success } = await otpVerifyLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    // Sort by createdAt: -1 to get the most recent OTP in case of race conditions
    const existingOtp = await Otp.findOne({ email, purpose }).sort({ createdAt: -1 });
    console.log(existingOtp);

    if(!existingOtp){
      return NextResponse.json({ error: "Invalid OTP" }, {status: 400,})
    }

    if (existingOtp.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (purpose === "verify") {
      await UserModel.updateOne({ email }, { emailVerified: true });
      
      // Dispatch Welcome Email
      await sendEmail({
        to: email,
        subject: "🎉 Welcome to Eventia!",
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background-color: #d97706; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Eventia, ${user.name || "Creator"}!</h1>
            </div>
            
            <div style="padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
              <h2 style="color: #d97706; margin-top: 0;">Your email is verified!</h2>
              <p style="font-size: 16px;">We are super excited to have you on board. Eventia is your ultimate platform for discovering, organizing, and attending incredible events.</p>
              
              <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin: 24px 0;">
                <h3 style="color: #78350f; margin-top: 0; margin-bottom: 12px;">What's Next?</h3>
                <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Explore upcoming events from top creators</li>
                  <li style="margin-bottom: 8px;">Manage your event registrations effortlessly</li>
                  <li><strong>Apply for Organizer Access</strong> to host your own events!</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-top: 32px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/events" style="background-color: #d97706; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Start Exploring
                </a>
              </div>
            </div>
          </div>
        `
      });
    }

    const isValid = await bcrypt.compare(otp, existingOtp.otp);
    console.log(isValid);


    if (!isValid) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    await Otp.deleteMany({ email, purpose });

    return NextResponse.json({ message: "OTP verified successfully" });
  }catch(err){
    return NextResponse.json({ error: "Server error", err,}, {status: 500,})
  }
}