import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: "user" | "admin" | "organizer";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: "user" | "admin" | "organizer";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    role: "user" | "admin" | "organizer";
  }
}
