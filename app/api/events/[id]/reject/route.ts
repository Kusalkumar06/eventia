import { connectDb } from '@/app/utilities/db';
import {NextRequest,NextResponse} from "next/server";
import { EventModel } from '../../../models/event.model';
import { requireAdmin } from '@/app/lib/auth-guards';

export async function POST(req:NextRequest, {params}:{params:{id:string}}){
  try{
    await requireAdmin();
    await connectDb();

    const body = await req.json();
    const reason:string = body.reason;

    if (!reason || reason.trim().length < 5){
      return NextResponse.json({error: "Rejection reason required"},{status: 400})
    }

    const event = await EventModel.findById(params.id);

    if (!event){
      return NextResponse.json({error: "Event not found."},{status:400})
    }

    if (event.status !== "draft") {
      return NextResponse.json({ error: "Only draft events can be rejected" },{ status: 400 });
    }

    event.status = "rejected"
    event.rejectionReason = reason;

    await event.save();

    return NextResponse.json({message: "Event Rejected Successfully."})
  }catch(err){
    return NextResponse.json({error: "Unauthorized",err},{status: 403})
  }
}