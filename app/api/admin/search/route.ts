import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { requireAdmin } from "@/lib/auth-guards";
import { UserModel } from "@/models/user.model";
import { EventModel } from "@/models/event.model";

export async function GET(req: NextRequest) {
  await connectDb();
  await requireAdmin();

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");

  if (!q || q.trim().length < 2) {
    return NextResponse.json({ users: [], events: [] });
  }

  function escapeRegex(text: string) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  const safeQuery = escapeRegex(q);
  const regex = new RegExp(safeQuery, "i");

  const users = await UserModel.find({
    $or: [{ name: regex }, { email: regex }],
  })
    .select("_id name email")
    .limit(5)
    .lean();

  const events = await EventModel.find({
    $or: [{ title: regex }, { slug: regex }],
  })
    .select("_id title status slug")
    .limit(5)
    .lean();

  return NextResponse.json({ users, events });
}
