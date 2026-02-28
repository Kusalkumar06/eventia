import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDb } from "@/lib/db";
import { UserModel } from "../../../../models/user.model";
import { Otp } from "../../../../models/otp.model";
import { generateOtp } from "@/lib/generateOtp";
import { sendEmail } from "@/lib/brevo";

export async function POST(req: NextRequest){
  try {
    await connectDb();

    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      name,
      email,
      password: hashedPassword,
      provider: "credentials",
      emailVerified: false,
    });

    await Otp.deleteMany({ email, purpose: "verify" });

    const otp = generateOtp();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.create({
      email,
      otp: hashedOtp,
      purpose: "verify",
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    const emailSent = await sendEmail({
      to: email,
      subject: "Verify your Eventia Account",
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <div style="background-color: #d97706; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to Eventia!</h1>
          </div>
          
          <div style="padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px;">
            <h2 style="color: #d97706; margin-top: 0;">Hello,</h2>
            <p style="font-size: 16px;">Thank you for registering. Please use the following OTP to <strong>verify your email address</strong>. It will expire in 5 minutes.</p>
            
            <div style="background-color: #fef3c7; border: 1px solid #fcd34d; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #78350f;">${otp}</span>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 16px;">
              If you did not request this verification code, please safely ignore this email.
            </p>
          </div>
        </div>
      `,
    });

    if (!emailSent) {
      console.warn("User created but verification email failed to send.");
    }

    return NextResponse.json({ message: "User created. Verify OTP.", status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
