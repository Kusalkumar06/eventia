"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AuthPage() {
  const router = useRouter();
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  const [signUpName, setSignUpName] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [showOtpPanel, setShowOtpPanel] = useState(false);

  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (sessionStorage.getItem("authAction") === "loggedOut") {
      toast.success("Successfully signed out!");
      sessionStorage.removeItem("authAction");
    }
  }, []);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      email: signInEmail,
      password: signInPassword,
      redirect: false,
    });

    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Successfully signed in!");
      router.push("/");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: signUpName,
          email: signUpEmail,
          password: signUpPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Registration failed");
      } else {
        toast.success(
          "Registration successful! Please check your email for the OTP.",
        );
        setShowOtpPanel(true);
      }
    } catch (error: unknown) {
      console.error("Signup error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signUpEmail, otp, purpose: "verify" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Verification failed");
      } else {
        toast.success("Verified! Signing you in...");
        const loginRes = await signIn("credentials", {
          email: signUpEmail,
          password: signUpPassword,
          redirect: false,
        });
        if (loginRes?.error) {
          toast.error(
            "Verified but failed to auto-login. Please sign in manually.",
          );
          setTimeout(() => {
            setShowOtpPanel(false);
            setIsRightPanelActive(false);
          }, 2000);
        } else {
          router.push("/");
        }
      }
    } catch (error: unknown) {
      console.error("OTP verification error:", error);
      toast.error("An error occurred during verification.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-300">
      <div
        className={`relative bg-card rounded-2xl shadow-2xl overflow-hidden max-w-full min-h-[550px] w-full md:w-[868px] border border-border transition-all duration-300 ${
          isRightPanelActive ? "right-panel-active" : ""
        }`}
        id="container"
      >
        <div
          className={`form-container sign-up-container absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full md:w-1/2 z-10 ${
            isRightPanelActive
              ? "opacity-100 translate-x-0 md:translate-x-full z-50 animate-show"
              : "opacity-0 z-10 -translate-x-full md:translate-x-0"
          }`}
        >
          {!showOtpPanel ? (
            <form
              onSubmit={handleSignUp}
              className="bg-card flex flex-col items-center justify-center h-full px-8 md:px-12 text-center"
            >
              <h1 className="font-bold text-2xl md:text-3xl mb-4 text-foreground">
                Create Account
              </h1>
              <div className="social-container w-full mb-4">
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.setItem("googleLogin", "pending");
                    signIn("google", { callbackUrl: "/" });
                  }}
                  className="flex items-center justify-center gap-3 w-full border border-border rounded-lg py-2.5 px-4 text-sm font-medium text-foreground hover:bg-muted transition-all duration-300 active:scale-[0.98]"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    className="w-5 h-5"
                  >
                    <path
                      fill="#4285F4"
                      d="M512 320c0-11-1-21-3-31H320v60h108c-5 25-19 46-40 60v50h65c38-35 60-86 60-147z"
                    />
                    <path
                      fill="#34A853"
                      d="M320 512c52 0 95-17 127-46l-65-50c-18 12-41 19-62 19-48 0-89-32-103-76H148v52c32 63 97 106 172 106z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M217 359c-3-10-5-20-5-30s2-20 5-30V247H148c-10 20-15 42-15 65s5 45 15 65l69-53c0 0 0 0 0 0z"
                    />
                    <path
                      fill="#EA4335"
                      d="M320 128c28 0 53 10 73 29l55-55C415 72 371 52 320 52c-75 0-140 43-172 106l69 53c14-44 55-76 103-76z"
                    />
                  </svg>
                  <span>Sign up with Google</span>
                </button>
              </div>
              <div className="flex items-center w-full mb-4">
                <div className="flex-1 h-px bg-border"></div>
                <span className="px-3 text-xs text-muted-foreground uppercase">
                  or
                </span>
                <div className="flex-1 h-px bg-border"></div>
              </div>

              <div className="w-full relative mb-3">
                <User
                  className="absolute left-3 top-3.5 text-muted-foreground"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Name"
                  value={signUpName}
                  onChange={(e) => setSignUpName(e.target.value)}
                  className="bg-muted border border-transparent rounded-lg px-4 py-3 pl-10 w-full outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  required
                />
              </div>

              <div className="w-full relative mb-3">
                <Mail
                  className="absolute left-3 top-3.5 text-muted-foreground"
                  size={16}
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  className="bg-muted border border-transparent rounded-lg px-4 py-3 pl-10 w-full outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  required
                />
              </div>

              <div className="w-full relative mb-3">
                <Lock
                  className="absolute left-3 top-3.5 text-muted-foreground"
                  size={16}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  className="bg-muted border border-transparent rounded-lg px-4 py-3 pl-10 pr-10 w-full outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <button className="mt-4 w-full md:w-auto rounded-full border border-primary bg-primary text-white text-xs font-bold py-3 px-12 tracking-wide uppercase transition-transform active:scale-95 hover:shadow-lg focus:outline-none">
                Sign Up
              </button>

              <button
                type="button"
                onClick={() => setIsRightPanelActive(false)}
                className="mt-6 text-sm text-primary font-medium md:hidden"
              >
                Already have an account? Sign In
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleVerifyOtp}
              className="bg-card flex flex-col items-center justify-center h-full px-8 md:px-12 text-center animate-fade-in"
            >
              <CheckCircle size={48} className="text-primary mb-4" />
              <h1 className="font-bold text-2xl md:text-3xl mb-4 text-foreground">
                Verify OTP
              </h1>
              <p className="text-sm text-muted-foreground mb-6 font-light">
                We have sent a code to{" "}
                <span className="font-semibold">{signUpEmail}</span>
              </p>

              <div className="w-full relative mb-3">
                <Lock
                  className="absolute left-3 top-3.5 text-muted-foreground"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Enter Validator/OTP Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-muted border border-transparent rounded-lg px-4 py-3 pl-10 w-full outline-none focus:ring-2 focus:ring-primary/50 text-center tracking-widest text-lg text-foreground"
                  required
                />
              </div>

              <button className="mt-4 w-full md:w-auto rounded-full border border-primary bg-primary text-white text-xs font-bold py-3 px-12 tracking-wide uppercase transition-transform active:scale-95 hover:shadow-lg focus:outline-none">
                Verify & Login
              </button>

              <button
                type="button"
                onClick={() => setShowOtpPanel(false)}
                className="mt-4 text-xs text-muted-foreground underline hover:text-primary transition-colors"
              >
                Back to Registration
              </button>
            </form>
          )}
        </div>

        <div
          className={`form-container sign-in-container absolute top-0 h-full transition-all duration-600 ease-in-out left-0 w-full md:w-1/2 z-20 ${
            isRightPanelActive
              ? "opacity-0 -translate-x-full md:translate-x-full"
              : "opacity-100 translate-x-0"
          }`}
        >
          <form
            onSubmit={handleSignIn}
            className="bg-card flex flex-col items-center justify-center h-full px-8 md:px-12 text-center"
          >
            <h1 className="font-bold text-2xl md:text-3xl mb-4 text-foreground">
              Sign in
            </h1>
            <div className="social-container w-full mb-4">
              <button
                type="button"
                onClick={() => {
                  sessionStorage.setItem("googleLogin", "pending");
                  signIn("google", { callbackUrl: "/" });
                }}
                className="flex items-center justify-center gap-3 w-full border border-border rounded-lg py-2.5 px-4 text-sm font-medium text-foreground hover:bg-muted transition-all duration-300 active:scale-[0.98]"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 640"
                  className="w-5 h-5"
                >
                  <path
                    fill="#4285F4"
                    d="M512 320c0-11-1-21-3-31H320v60h108c-5 25-19 46-40 60v50h65c38-35 60-86 60-147z"
                  />
                  <path
                    fill="#34A853"
                    d="M320 512c52 0 95-17 127-46l-65-50c-18 12-41 19-62 19-48 0-89-32-103-76H148v52c32 63 97 106 172 106z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M217 359c-3-10-5-20-5-30s2-20 5-30V247H148c-10 20-15 42-15 65s5 45 15 65l69-53c0 0 0 0 0 0z"
                  />
                  <path
                    fill="#EA4335"
                    d="M320 128c28 0 53 10 73 29l55-55C415 72 371 52 320 52c-75 0-140 43-172 106l69 53c14-44 55-76 103-76z"
                  />
                </svg>
                <span>Sign in with Google</span>
              </button>
            </div>
            <div className="flex items-center w-full mb-4">
              <div className="flex-1 h-px bg-border"></div>
              <span className="px-3 text-xs text-muted-foreground uppercase">
                or
              </span>
              <div className="flex-1 h-px bg-border"></div>
            </div>

            <div className="w-full relative mb-3">
              <Mail
                className="absolute left-3 top-3.5 text-muted-foreground"
                size={16}
              />
              <input
                type="email"
                placeholder="Email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
                className="bg-muted border border-transparent rounded-lg px-4 py-3 pl-10 w-full outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                required
              />
            </div>

            <div className="w-full relative mb-3">
              <Lock
                className="absolute left-3 top-3.5 text-muted-foreground"
                size={16}
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
                className="bg-muted border border-transparent rounded-lg px-4 py-3 pl-10 pr-10 w-full outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <Link
              href="/forgot-password"
              className="text-muted-foreground text-xs no-underline my-2 hover:underline transition-colors"
            >
              Forgot your password?
            </Link>

            <button className="mt-4 w-full md:w-auto rounded-full border border-primary bg-primary text-white text-xs font-bold py-3 px-12 tracking-wide uppercase transition-transform active:scale-95 hover:shadow-lg focus:outline-none">
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setIsRightPanelActive(true)}
              className="mt-6 text-sm text-primary font-medium md:hidden"
            >
              Don&apos;t have an account? Sign Up
            </button>
          </form>
        </div>

        <div
          className={`overlay-container absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-600 ease-in-out z-100 hidden md:block ${
            isRightPanelActive ? "-translate-x-full" : ""
          }`}
        >
          <div
            className={`overlay bg-primary dark:bg-[#FEF3C7] text-primary-foreground dark:text-zinc-900 relative -left-full h-full w-[200%] transform transition-transform duration-600 ease-in-out ${
              isRightPanelActive ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            <div
              className={`overlay-panel overlay-left absolute flex items-center justify-center flex-col p-10 text-center top-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out ${
                isRightPanelActive ? "translate-x-0" : "-translate-x-[20%]"
              }`}
            >
              <h1 className="font-bold text-3xl mb-4">Welcome Back!</h1>
              <p className="text-sm font-light leading-6 mb-8 opacity-90">
                To keep connected with us please login with your personal info
              </p>
              <button
                className="ghost rounded-full border border-current bg-transparent text-current text-xs font-bold py-3 px-12 tracking-wide uppercase transition-transform active:scale-95 focus:outline-none cursor-pointer"
                onClick={() => setIsRightPanelActive(false)}
              >
                Sign In
              </button>
            </div>
            <div
              className={`overlay-panel overlay-right absolute right-0 flex items-center justify-center flex-col p-10 text-center top-0 h-full w-1/2 transform transition-transform duration-600 ease-in-out ${
                isRightPanelActive ? "translate-x-[20%]" : "translate-x-0"
              }`}
            >
              <h1 className="font-bold text-3xl mb-4">Hello, Friend!</h1>
              <p className="text-sm font-light leading-6 mb-8 opacity-90">
                Enter your personal details and start your journey with us
              </p>
              <button
                className="ghost rounded-full border border-current bg-transparent text-current text-xs font-bold py-3 px-12 tracking-wide uppercase transition-transform active:scale-95 focus:outline-none cursor-pointer"
                onClick={() => setIsRightPanelActive(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes show {
          0%,
          49.99% {
            opacity: 0;
            z-index: 1;
          }
          50%,
          100% {
            opacity: 1;
            z-index: 5;
          }
        }
        .animate-show {
          animation: show 0.6s;
        }
      `}</style>
    </div>
  );
}
