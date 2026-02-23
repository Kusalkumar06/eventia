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

    const newUser = await UserModel.create({
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
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Eventia!</h2>
          <p>Thank you for registering. Please use the following OTP to verify your email address. It will expire in 5 minutes.</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px;">${otp}</span>
          </div>
          <p>If you did not request this verification code, please ignore this email.</p>
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
