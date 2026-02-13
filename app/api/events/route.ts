import { NextResponse,NextRequest } from "next/server";
import slugify from "slugify";
import mongoose from "mongoose";
import { connectDb } from "@/app/utilities/db";
import { EventModel } from "@/app/api/models/event.model";
import { CategoryModel } from "@/app/api/models/category.model";

type EventFilter = {
  status: "published";
  $or?: Array<
    | { title: { $regex: string; $options: string } }
    | { description: { $regex: string; $options: string } }
  >;
  category?: mongoose.Types.ObjectId;
};



export async function POST(req: Request) {
  try {
    await connectDb();

    const body = await req.json();

    const {
      title,
      description,
      shortDescription,
      category,
      otherCategoryLabel,
      tags,
      mode,
      location,
      onlineURL,
      startDate,
      endDate,
      isRegistrationRequired,
      maxRegistrations,
      organizer, 
    } = body;

    // ---- Basic required checks ----
    if (
      !title ||
      !description ||
      !category ||
      !mode ||
      !startDate ||
      !endDate ||
      !organizer
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // ---- ObjectId validation ----
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return NextResponse.json(
        { message: "Invalid category" },
        { status: 400 }
      );
    }

    // ---- Category existence ----
    const categoryDoc = await CategoryModel.findById(category);
    if (!categoryDoc) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 400 }
      );
    }

    // ---- Others logic ----
    if (categoryDoc.slug === "others") {
      if (!otherCategoryLabel || otherCategoryLabel.trim().length < 3) {
        return NextResponse.json(
          { message: "Please specify other category" },
          { status: 400 }
        );
      }
    }

    if (categoryDoc.slug !== "others" && otherCategoryLabel) {
      return NextResponse.json(
        { message: "otherCategoryLabel allowed only for Others category" },
        { status: 400 }
      );
    }

    // ---- Date validation ----
    if (new Date(endDate) <= new Date(startDate)) {
      return NextResponse.json(
        { message: "End date must be after start date" },
        { status: 400 }
      );
    }

    // ---- Mode-based validation ----
    if (mode === "online" && !onlineURL) {
      return NextResponse.json(
        { message: "onlineURL is required for online events" },
        { status: 400 }
      );
    }

    if (mode === "offline" && !location?.city) {
      return NextResponse.json(
        { message: "Location is required for offline events" },
        { status: 400 }
      );
    }

    // ---- Registration validation ----
    if (isRegistrationRequired && (!maxRegistrations || maxRegistrations <= 0)) {
      return NextResponse.json(
        { message: "maxRegistrations must be greater than 0" },
        { status: 400 }
      );
    }

    // ---- Slug generation with collision handling ----
    const baseSlug = slugify(title, { lower: true, strict: true });
    let slug = baseSlug;
    let count = 1;

    while (await EventModel.exists({ slug })) {
      slug = `${baseSlug}-${count++}`;
    }

    const event = await EventModel.create({
      title,
      description,
      shortDescription,
      category,
      otherCategoryLabel,
      tags,
      mode,
      location,
      onlineURL,
      startDate,
      endDate,
      isRegistrationRequired,
      maxRegistrations,
      organizer,
      slug,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ message }, { status: 500 });
  }
}

// GET EVENTS
export async function GET(req: NextRequest) {
  try {
    await connectDb();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const categorySlug = searchParams.get("category");

    const filter: EventFilter = {status: "published",};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (categorySlug) {
      const category = await CategoryModel.findOne({slug: categorySlug,isActive: true,});

      if (!category) {
        return NextResponse.json([]);
      }

      filter.category = category._id;
    }

    const events = await EventModel.find(filter).populate("category", "name slug").sort({ startDate: 1 });

    return NextResponse.json(events);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json({ message }, { status: 500 });
  }
}


