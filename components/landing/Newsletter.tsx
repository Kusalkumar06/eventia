"use client";

import { motion } from "framer-motion";
import { Mail, Check } from "lucide-react";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <section className="py-24 bg-background border-t border-border transition-colors duration-300">
      <div className="max-w-xl mx-auto px-6 text-center">
        <Mail className="w-12 h-12 text-muted-foreground mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Stay Updated
        </h2>
        <p className="text-muted-foreground mb-8">
          Get the latest events and news delivered to your inbox.
        </p>

        <form onSubmit={handleSubmit} className="relative max-w-sm mx-auto">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={subscribed}
            className="w-full bg-card border border-border rounded-full px-6 py-4 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all pr-12 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={subscribed}
            className="absolute right-2 top-2 bottom-2 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors disabled:bg-green-600"
          >
            {subscribed ? (
              <Check className="w-5 h-5" />
            ) : (
              <ArrowRightIcon className="w-5 h-5" />
            )}
          </button>
        </form>
        {subscribed && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-green-500 mt-4 text-sm"
          >
            Subscribed successfully!
          </motion.p>
        )}
      </div>
    </section>
  );
}

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);
