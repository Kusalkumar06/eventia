import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { Otp } from "@/models/otp.model";
import { UserModel } from "@/models/user.model";
import bcrypt from "bcrypt";
import { otpVerifyLimiter } from "@/lib/rateLimiter";

export async function POST(req: NextRequest) {
  try {
    await connectDb();
    
    const body = await req.json();
    const { email, otp, newPassword } = body;

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const ip = req.headers.get("x-forwarded-for") ?? req.headers.get("x-real-ip") ?? "anonymous";
    const { success } = await otpVerifyLimiter.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        { status: 429 }
      );
    }

    const existingOtp = await Otp.findOne({ email, purpose: "reset" }).sort({ createdAt: -1 });

    if (!existingOtp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    if (existingOtp.expiresAt < new Date()) {
      return NextResponse.json({ error: "OTP expired" }, { status: 400 });
    }

    const isValid = await bcrypt.compare(otp, existingOtp.otp);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.provider !== "credentials") {
      return NextResponse.json({ error: "Cannot reset password for Google accounts" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    await Otp.deleteMany({ email, purpose: "reset" });

    return NextResponse.json({ message: "Password reset successfully" }, { status: 200 });
  } catch (err: unknown) {
    console.error("Reset password error:", err);
    const errorMessage = err instanceof Error ? err.message : "Internal error";
    return NextResponse.json({ error: "Server error", details: errorMessage }, { status: 500 });
  }
}
