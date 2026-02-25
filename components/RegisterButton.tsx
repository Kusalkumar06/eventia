"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  registerForEventAction,
  unregisterFromEventAction,
} from "@/utilities/services/registrationActions";

interface RegisterButtonProps {
  eventId: string;
  endDate: string | Date;
  isRegistrationRequired: boolean;
  maxRegistrations?: number;
  registrationsCount: number;
  initialIsRegistered: boolean;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({
  eventId,
  endDate,
  isRegistrationRequired,
  maxRegistrations,
  registrationsCount,
  initialIsRegistered,
}) => {
  const [isRegistered, setIsRegistered] = useState(initialIsRegistered);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isCompleted = new Date(endDate) < new Date();
  const isFull = maxRegistrations
    ? registrationsCount >= maxRegistrations
    : false;

  const [isPending, startTransition] = useTransition();

  const handleAction = async () => {
    if (loading || isPending) return;
    setLoading(true);

    startTransition(async () => {
      try {
        let response;
        if (isRegistered) {
          response = await unregisterFromEventAction(eventId);
        } else {
          response = await registerForEventAction(eventId);
        }

        if (response.success) {
          setIsRegistered(!isRegistered);
          router.refresh(); // Force refresh of server component data
          if (isRegistered) {
            toast.success("Successfully unregistered from event");
          } else {
            toast.success(
              "Successfully registered! Check your email for confirmation.",
            );
          }
        } else {
          toast.error(response.error || "Something went wrong");
        }
      } catch (error: unknown) {
        console.error("Action error:", error);

        if (error instanceof Error && error.message === "Unauthorized") {
          toast.error("You must be signed in to register");
          router.push("/signIn");
        } else {
          toast.error(
            error instanceof Error && error.message
              ? error.message
              : "Failed to perform action",
          );
        }
      } finally {
        setLoading(false);
      }
    });
  };

  if (!isRegistrationRequired) {
    return (
      <div className="text-sm text-muted-foreground italic bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-border text-center">
        No registration required.
      </div>
    );
  }

  let buttonText = isRegistered ? "Unregister" : "Register";
  let isDisabled = loading;

  if (isCompleted) {
    buttonText = "Event Completed";
    isDisabled = true;
  } else if (!isRegistered && isFull) {
    buttonText = "Slots Booked";
    isDisabled = true;
  }

  return (
    <div className="space-y-2 w-full">
      <button
        disabled={isDisabled}
        className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg 
          ${
            isDisabled
              ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-not-allowed shadow-none"
              : isRegistered
                ? "cursor-pointer bg-zinc-500 text-white hover:bg-zinc-600 shadow-zinc-500/20"
                : "cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
          }`}
        onClick={handleAction}
      >
        {loading ? "Processing..." : buttonText}
      </button>
    </div>
  );
};

export default RegisterButton;
