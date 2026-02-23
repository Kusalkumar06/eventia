import { connectDb } from "@/lib/db";
import { UserModel } from "@/models/user.model";

export async function getUserProfile(userId: string) {
  try {
    await connectDb();
    
    const user = await UserModel.findById(userId).lean();
    
    if (!user) {
      return null;
    }
    
    return {
      name: user.name || "Unknown User",
      email: user.email || "No email provided",
      role: user.role || "user",
      image: user.image || null,
      bio: user.bio || "",
      provider: user.provider || (user.password ? "credentials" : "google"),
      hasPassword: !!user.password,
      createdAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
    };
  } catch (error: unknown) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}
