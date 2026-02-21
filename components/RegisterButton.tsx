"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

interface RegisterButtonProps {
  eventId: string;
  endDate: string | Date;
  isRegistrationRequired: boolean;
  maxRegistrations?: number;
  registrationsCount: number;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({
  eventId,
  endDate,
  isRegistrationRequired,
  maxRegistrations,
  registrationsCount,
}) => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(isRegistrationRequired);
  const router = useRouter();

  const isCompleted = new Date(endDate) < new Date();
  const isFull = maxRegistrations
    ? registrationsCount >= maxRegistrations
    : false;

  const checkRegistrationStatus = useCallback(async () => {
    try {
      const response = await fetch("/api/registrations/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await response.json();
        if (response.ok && data.registered) {
          setIsRegistered(true);
        }
      }
    } catch (error) {
      console.error("Error checking registration status:", error);
    } finally {
      setCheckingStatus(false);
    }
  }, [eventId]);

  useEffect(() => {
    if (isRegistrationRequired) {
      checkRegistrationStatus();
    } else {
      setCheckingStatus(false);
    }
  }, [isRegistrationRequired, checkRegistrationStatus]);

  const handleAction = async () => {
    setLoading(true);
    try {
      const endpoint = isRegistered
        ? "/api/registrations/unregister"
        : "/api/registrations/register";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsRegistered(!isRegistered);
        router.refresh();
      } else {
        if (response.status === 401) {
          alert("Please login to register for events.");
          router.push("/auth/signin");
        } else {
          alert(data.error || data.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error("Action error:", error);
      alert("Failed to perform action");
    } finally {
      setLoading(false);
    }
  };

  if (!isRegistrationRequired) {
    return (
      <div className="text-sm text-muted-foreground italic bg-zinc-50 dark:bg-zinc-900/50 p-3 rounded-lg border border-border text-center">
        No registration required.
      </div>
    );
  }

  if (checkingStatus) {
    return (
      <div className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg animate-pulse flex items-center justify-center">
        <span className="text-zinc-400 text-sm">
          Loading registration status...
        </span>
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
    <button
      disabled={isDisabled}
      className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg 
        ${
          isDisabled
            ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 cursor-not-allowed shadow-none"
            : isRegistered
              ? "bg-zinc-500 text-white hover:bg-zinc-600 shadow-zinc-500/20"
              : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
        }`}
      onClick={handleAction}
    >
      {loading ? "Processing..." : buttonText}
    </button>
  );
};

export default RegisterButton;
