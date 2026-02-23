"use client";

import React, { useState, useTransition } from "react";
import { Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { setPasswordAction } from "@/utilities/services/profileActions";

export default function SetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || isPending) return;

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    startTransition(async () => {
      try {
        const res = await setPasswordAction(newPassword);

        if (!res.success) {
          toast.error(res.error || "Failed to set password.");
        } else {
          toast.success("Password registered securely!");
          setNewPassword("");
          setConfirmPassword("");
        }
      } catch (error: any) {
        toast.error("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-bold text-foreground mb-4">Set a Password</h3>
      <p className="text-sm text-muted-foreground mb-6">
        You logged in via Google. Set a password here if you also want to be
        able to sign in using your email directly.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border border-border bg-background rounded-lg focus:ring-2 focus:ring-primary/50 text-foreground outline-none transition-colors"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 text-muted-foreground w-4 h-4" />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full pl-10 pr-4 py-2 border border-border bg-background rounded-lg focus:ring-2 focus:ring-primary/50 text-foreground outline-none transition-colors"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Set Password"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
