import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDb } from "@/lib/db";
import { UserModel } from "../../../../models/user.model";
import { Otp } from "../../../../models/otp.model";
import { generateOtp } from "@/lib/generateOtp";

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

    console.log("Verification OTP for", email, ":", otp);

    return NextResponse.json({ message: "User created. Verify OTP.", status: 201 });
  } catch (err) {
    return NextResponse.json({ error: "Server error",err }, { status: 500 });
  }
}
