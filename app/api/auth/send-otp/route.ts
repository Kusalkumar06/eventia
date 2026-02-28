import {NextRequest, NextResponse} from "next/server";
import { connectDb } from "@/lib/db";
import {Otp} from "../../../../models/otp.model";
import { UserModel } from "../../../../models/user.model";
import {generateOtp} from "@/lib/generateOtp";
import bcrypt from "bcrypt"
import { otpResendLimiter } from "@/lib/rateLimiter";
import { sendEmail } from "@/lib/brevo";


export async function POST(req: NextRequest){
  try{
    await connectDb();

    const body = await req.json();

    const email: string = body.email;
    const purpose: "verify" | "reset" = body.purpose;


    if (!email || !purpose){
      return NextResponse.json({
        error: "Missing fields",
      }, {
        status: 400,
      })
    }

    const ip =
      req.headers.get("x-forwarded-for") ??
      req.headers.get("x-real-ip") ??
      "anonymous";

    const { success } = await otpResendLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many OTP requests. Try later." },
        { status: 429 }
      );
    }

    const user = await UserModel.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (purpose === "verify" && user.emailVerified) {
      return NextResponse.json(
        { error: "Email is already verified." },
        { status: 400 }
      );
    }


    const recentOtp = await Otp.findOne({
      email,
      purpose,
      expiresAt: { $gt: new Date() },
    });

    if (recentOtp) {
      return NextResponse.json(
        { error: "OTP already sent. Try later." },
        { status: 429 }
      );
    }

    await Otp.deleteMany({ email, purpose });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await Otp.create({email,otp:hashedOtp,purpose,expiresAt: new Date(Date.now() + 5 * 60 * 1000)});

    const isReset = purpose === "reset";
    const subject = isReset ? "Reset Your Eventia Password" : "Verify your Eventia Account";
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background-color: #d97706; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">Eventia ${isReset ? "Password Reset" : "Email Verification"}</h1>
        </div>
        
        <div style="padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
          <h2 style="color: #d97706; margin-top: 0;">Hello,</h2>
          <p style="font-size: 16px;">
            ${isReset 
              ? "We received a request to <strong>reset your Eventia password</strong>. Please use the following OTP to proceed. It will expire in 5 minutes." 
              : "Please use the following OTP to <strong>verify your email address</strong>. It will expire in 5 minutes."}
          </p>
          
          <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #78350f;">${otp}</span>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
            If you did not request this ${isReset ? "password reset" : "verification code"}, please safely ignore this email.
          </p>
        </div>
      </div>
    `;

    const emailSent = await sendEmail({
      to: email,
      subject,
      htmlContent,
    });

    if (!emailSent) {
      console.warn(`Failed to send ${purpose} email to ${email}`);
    }

    return NextResponse.json({ message: "OTP sent successfully" });

  }catch(err){
    return NextResponse.json({ error: "Server error",err }, { status: 500 });
  }
}