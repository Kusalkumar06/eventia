import {NextRequest, NextResponse} from "next/server";
import { connectDb } from "@/app/utilities/db";
import {Otp} from "../../models/otp.model";
import {generateOtp} from "@/app/lib/generateOtp";
import bcrypt from "bcrypt"
import { otpResendLimiter } from "@/app/lib/rateLimiter";


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

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);
    await Otp.create({email,otp:hashedOtp,purpose,expiresAt: new Date(Date.now() + 5 * 60 * 1000)});

    console.log("OTP for", email, "is:", otp);

    return NextResponse.json({ message: "OTP sent (check console)" });

  }catch(err){
    return NextResponse.json({ error: "Server error",err }, { status: 500 });
  }
}