import { NextRequest, NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { EventModel } from "@/models/event.model";
import { CategoryModel } from "@/models/category.model";

export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");

    if (!q || q.trim().length < 2) {
      return NextResponse.json([]);
    }

    function escapeRegex(text: string) {
      return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    const safeQuery = escapeRegex(q);
    const regex = new RegExp(safeQuery, "i");


    const matchingCategories = await CategoryModel.find({
      name: { $regex: regex },
    }).select("_id");

    const categoryIds = matchingCategories.map((cat) => cat._id);
    const events = await EventModel.find({
      status: "published",
      $or: [
        { title: { $regex: regex } },
        { slug: { $regex: regex } },
        { category: { $in: categoryIds } },
      ],
    })
      .populate("category", "name slug")
      .select("_id title slug startDate location category") 
      .limit(10)
      .lean();

    const formattedEvents = events.map((event) => ({
      _id: event._id,
      title: event.title,
      slug: event.slug,
      date: event.startDate, 
      location: event.location,
      category: event.category,
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
