import { connectDb } from "@/lib/db";
import { CategoryModel } from "@/models/category.model";

export async function getCategories() {
  await connectDb();
  const categories = await CategoryModel.find({ isActive: true })
    .select("_id name slug")
    .sort({ name: 1 })
    .lean();
    
  return JSON.parse(JSON.stringify(categories));
}
