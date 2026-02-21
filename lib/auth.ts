import NextAuth, { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { UserModel } from "../models/user.model";
import { connectDb } from "./db";
import bcrypt from "bcrypt";
import { loginLimiter } from "@/lib/rateLimiter";

export const authOptions: NextAuthOptions= {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60, 
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60,
  },
  providers:[
    Credentials({
      name: " Credentials",
      credentials:{
        email :{label: "Email", type: "email"},
        password: {label: "password", type: "password"}
      },
      async authorize(credentials){
        const {email,password} = credentials ?? {};

        if (!email || !password){
          throw new Error("Missing credentials");
        }

        const { success } = await loginLimiter.limit(email);

        if (!success) {
          throw new Error("Too many login attempts. Try later.");
        }
        
        await connectDb();

        const user = await UserModel.findOne({email});

        if (!user){
          throw new Error("User not found. Please register.");
        }

        if (user.provider !== "credentials") {
          throw new Error("Please sign in using Google.");
        }

        if (!user.emailVerified) {
          throw new Error("Please verify your email first.");
        }

        if (!user.password) {
          throw new Error("Invalid login method.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages:{
    signIn: '/signIn',
  },

  callbacks:{
     async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDb();

        if (!user.email) {
          return false; 
        }
        
        const existingUser = await UserModel.findOne({ email: user.email });

        if (!existingUser) {
          await UserModel.create({
            name: user.name ?? user.email.split("@")[0],
            email: user.email,
            provider: "google",
            emailVerified: true, 
          });
        }

        return true;
      }

      return true;
    },
    async jwt({ token }) {
      try {
        if (!token.email) return token;

        await connectDb();
        const dbUser = await UserModel.findOne({ email: token.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }

        return token;
      } catch (error) { 
        console.error("Error in JWT callback:", error);
        return token;
      }
    },
    async session({session,token}){
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
}

export default NextAuth(authOptions);