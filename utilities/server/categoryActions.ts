import { unstable_cache } from "next/cache";
import { connectDb } from "@/lib/db";
import { CategoryModel } from "@/models/category.model";

/**
 * Fetch all active categories with high-performance caching.
 * Uses Next.js unstable_cache with a 24-hour expiration and on-demand revalidation tag.
 */
export const getCategories = unstable_cache(
  async () => {
    await connectDb();
    const categories = await CategoryModel.find({ isActive: true })
      .select("_id name slug")
      .sort({ name: 1 })
      .lean();

    return JSON.parse(JSON.stringify(categories)) as Array<{
      _id: string;
      name: string;
      slug: string;
    }>;
  },
  ["categories-list"],
  {
    revalidate: 86400, // 24 hours
    tags: ["categories"],
  }
);
