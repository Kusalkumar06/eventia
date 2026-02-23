import {NextRequest,NextResponse} from "next/server";
import { connectDb } from "@/lib/db";
import { Otp } from "../../../../models/otp.model";
import { UserModel } from "../../../../models/user.model";
import bcrypt from "bcrypt";
import { otpVerifyLimiter } from "@/lib/rateLimiter";


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