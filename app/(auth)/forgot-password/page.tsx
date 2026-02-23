"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "reset" }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send reset code.");
      } else {
        setMessage("A reset code has been sent to your email.");
        setStep(2);
      }
    } catch (error: unknown) {
      console.error("OTP request error:", error);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password.");
      } else {
        setMessage("Password reset successfully! Redirecting...");
        setTimeout(() => {
          router.push("/signIn");
        }, 2000);
      }
    } catch (error: unknown) {
      console.error("Password reset error:", error);
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div className="relative bg-card rounded-2xl shadow-xl overflow-hidden max-w-md w-full border border-border p-8 text-center transition-all duration-300">
        {step === 1 ? (
          <form
            onSubmit={handleRequestOtp}
            className="flex flex-col items-center animate-in fade-in zoom-in duration-300"
          >
            <h1 className="font-bold text-2xl mb-4 text-foreground">
              Forgot Password
            </h1>
            <p className="text-sm text-muted-foreground mb-6 font-light">
              Enter your registered email address and we&apos;ll send you a code
              to reset your password.
            </p>

            <div className="w-full relative mb-3">
              <Mail
                className="absolute left-3 top-3.5 text-muted-foreground"
                size={16}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-muted border border-transparent rounded-lg px-4 py-3 pl-10 w-full outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs mt-2 text-left w-full">
                {error}
              </p>
            )}
            {message && (
              <p className="text-green-500 text-xs mt-2 text-left w-full">
                {message}
              </p>
            )}

            <button
              disabled={isLoading}
              className="mt-6 w-full rounded-full border border-primary bg-primary text-white text-xs font-bold py-3 tracking-wide uppercase transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center hover:shadow-lg focus:outline-none"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Send Reset Code"
              )}
            </button>

            <Link
              href="/signin"
              className="mt-6 text-xs text-muted-foreground underline hover:text-primary transition-colors"
            >
              Back to Sign In
            </Link>
          </form>
        ) : (
          <form
            onSubmit={handleResetPassword}
            className="flex flex-col items-center animate-in fade-in duration-300"
          >
            <CheckCircle size={48} className="text-primary mb-4" />
            <h1 className="font-bold text-2xl mb-2 text-foreground">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground mb-6 font-light">
              Code sent to <span className="font-semibold">{email}</span>
            </p>

            <div className="w-full relative mb-3">
              <Lock
                className="absolute left-3 top-3.5 text-muted-foreground"
                size={16}
              />
              <input
                type="text"
                placeholder="Enter 6-digit OTP Code"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="bg-muted border border-transparent rounded-lg px-4 py-3 pl-10 w-full outline-none focus:ring-2 focus:ring-primary/50 text-center tracking-widest text-lg text-foreground"
                required
              />
            </div>

            <div className="w-full relative mb-3">
              <Lock
                className="absolute left-3 top-3.5 text-muted-foreground"
                size={16}
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="bg-muted border border-transparent rounded-lg px-4 py-3 pl-10 pr-10 w-full outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                required
              />
            </div>

            <div className="w-full relative mb-3">
              <Lock
                className="absolute left-3 top-3.5 text-muted-foreground"
                size={16}
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-muted border border-transparent rounded-lg px-4 py-3 pl-10 pr-10 w-full outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-xs mt-2 text-left w-full">
                {error}
              </p>
            )}
            {message && (
              <p className="text-green-500 text-xs mt-2 text-left w-full">
                {message}
              </p>
            )}

            <button
              disabled={isLoading || message.includes("Redirecting")}
              className="mt-6 w-full rounded-full border border-primary bg-primary text-white text-xs font-bold py-3 tracking-wide uppercase transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100 flex items-center justify-center hover:shadow-lg focus:outline-none"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Set New Password"
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setOtp("");
                setError("");
                setMessage("");
              }}
              className="mt-6 text-xs text-muted-foreground underline hover:text-primary transition-colors"
            >
              Back to Request Code
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
