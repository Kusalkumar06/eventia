"use client";

import { useState } from "react";
import { requestOrganizerAccess } from "@/utilities/services/organizerActions";
import { toast } from "sonner";
import { ShieldAlert, Clock, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

import { motion } from "framer-motion";

interface OrganizerRequestProps {
  userId: string;
  status: "none" | "pending" | "approved" | "rejected";
}

export default function OrganizerRequest({
  userId,
  status: initialStatus,
}: OrganizerRequestProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);

  const [reason, setReason] = useState("");

  const handleRequestAccess = async () => {
    if (reason.trim().length < 10) {
      toast.error(
        "Please provide a more detailed reason for your application.",
      );
      return;
    }
    setLoading(true);
    try {
      const result = await requestOrganizerAccess(userId, reason);
      if (result.success) {
        setStatus("pending");
        toast.success("Request submitted successfully!");
      } else {
        toast.error(result.error || "Failed to submit request.");
      }
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-8 lg:py-16 bg-muted/30 dark:bg-muted/10 relative z-10 border-b lg:border-b-0 lg:border-r border-border min-h-[40vh] lg:min-h-screen">
        <div className="mb-6 lg:absolute lg:top-8 lg:left-8 z-10 w-full max-w-md mx-auto lg:mx-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 group py-2 pr-4 transition-colors lg:hover:bg-transparent lg:p-0"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 rotate-180 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Back to Home
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md mx-auto lg:mx-0 space-y-6 lg:space-y-8 flex-1 flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full w-fit bg-primary/10 text-primary border border-primary/20">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Access Required
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
              <span className="bg-clip-text bg-linear-to-r from-foreground to-foreground/70">
                Host Incredible
              </span>
              <br />
              <span className="text-primary">Experiences</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Join our curated network of event creators. Apply for organizer
              access to unlock premium ticketing, analytics, and management
              tools.
            </p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 xl:px-24 py-10 lg:py-16 bg-background relative z-10">
        <div className="w-full max-w-md mx-auto">
          {status === "none" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Form For the User interest
                </label>
                <textarea
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-input bg-background px-4 py-3 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Tell us why you want to organize events on Eventia and what kind of events you plan to host..."
                />
              </div>

              <div className="text-sm text-muted-foreground p-4 bg-muted/40 rounded-xl border border-border/50 space-y-2">
                <p className="font-semibold text-foreground">Conditions:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Applications are manually reviewed by administrators.</li>
                  <li>Approval is not guaranteed.</li>
                  <li>
                    Organizer access can be revoked by admins at any time.
                  </li>
                </ul>
              </div>

              <button
                onClick={handleRequestAccess}
                disabled={loading || reason.trim().length < 10}
                className="w-full h-14 rounded-xl text-sm sm:text-base font-bold inline-flex items-center justify-center transition-all focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70 bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/20"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting Request...
                  </span>
                ) : (
                  "Submit application"
                )}
              </button>
            </motion.div>
          )}

          {status === "pending" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 p-8 rounded-3xl bg-card border border-amber-200/50 dark:border-amber-900/30 shadow-xl shadow-amber-900/5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-amber-400 to-amber-600" />
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center relative">
                <div className="absolute inset-0 rounded-full border-4 border-amber-200 dark:border-amber-800 animate-ping opacity-20" />
                <Clock className="w-10 h-10 text-amber-600 dark:text-amber-400 relative z-10" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  Under Review
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Your organizer application is currently securely winding its
                  way to our admin team. We will notify you via email once a
                  decision is made!
                </p>
              </div>
              <Link
                href="/events"
                className="w-full h-12 rounded-xl text-sm sm:text-base font-semibold inline-flex items-center justify-center transition-colors border border-input bg-background hover:bg-muted hover:text-foreground text-muted-foreground"
              >
                Explore Events While You Wait
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </motion.div>
          )}

          {status === "rejected" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center space-y-6 p-8 rounded-3xl bg-card border border-red-200/50 dark:border-red-900/30 shadow-xl shadow-red-900/5 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-red-400 to-red-600" />
              <div className="w-20 h-20 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  Application Declined
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Unfortunately, we could not approve your request for organizer
                  access at this time.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => setStatus("none")}
                  className="w-full h-12 rounded-xl text-sm sm:text-md cursor-pointer font-semibold inline-flex items-center justify-center transition-colors border-2 border-primary/20 bg-primary/10 hover:bg-primary/20 text-primary"
                >
                  Re-submit application (If still interested)
                </button>
                <Link
                  href="/events"
                  className="w-full h-12 rounded-xl text-sm sm:text-md font-semibold inline-flex items-center justify-center transition-colors border border-input bg-background hover:bg-muted text-muted-foreground"
                >
                  Return to Events
                </Link>
              </div>
            </motion.div>
          )}

          {status === "approved" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div className="w-full bg-background rounded-3xl border border-input p-8 lg:p-10 shadow-sm text-foreground space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold">
                  You&apos;re Approved!
                </h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Now you can create your own event. Bring your vision to life,
                  publish incredible experiences, and manage your attendees
                  straight from your personal dashboard.
                </p>
              </div>
              <Link
                href="/organizer/create-event"
                className="w-full h-14 rounded-xl text-sm sm:text-base font-bold inline-flex items-center justify-center transition-all focus:ring-2 focus:ring-foreground focus:ring-offset-2 bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                Go to Organizer Dashboard
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
