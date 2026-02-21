"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function PostLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === "admin") {
        router.replace("/admin/");
      } else {
        router.replace("/");
      }
    }
  }, [status, session, router]);

  return <p>Redirecting...</p>;
}
