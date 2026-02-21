import { NextResponse } from "next/server";
import { connectDb } from "@/lib/db";
import { CategoryModel } from "@/models/category.model";

export async function GET() {
  try {
    await connectDb();

    const categories = await CategoryModel.find({ isActive: true })
      .select("_id name slug")
      .sort({ name: 1 });

    return NextResponse.json(categories);
  } catch (error: unknown ) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      { message },
      { status: 500 }
    );
  }
}
