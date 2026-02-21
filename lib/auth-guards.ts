import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function requireAdmin(){
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin"){
    throw new Error("Unauthorized");
  }

  return session;
}

export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error("Unauthorized");
  }

  return session;
}

export function requireOrganizer(
  eventOrganizerId: string,
  userId: string
) {
  if (eventOrganizerId !== userId) {
    throw new Error("Forbidden");
  }
}