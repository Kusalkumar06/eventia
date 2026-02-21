"use client";

import { motion } from "framer-motion";
import { Search, UserPlus, Ticket } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover Events",
    description:
      "Browse through thousands of events tailored to your interests.",
  },
  {
    icon: UserPlus,
    title: "Register Easily",
    description: "Sign up in seconds and secure your spot with a single click.",
  },
  {
    icon: Ticket,
    title: "Attend & Connect",
    description: "Experience the vibe and network with like-minded people.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-32 bg-black text-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            How Eventia Works
          </h2>
          <p className="text-zinc-400">
            Your journey to unforgettable experiences starts here.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-12 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-zinc-800 z-0" />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="relative z-10 flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 mb-6 rounded-full bg-zinc-900 border-4 border-black flex items-center justify-center group-hover:border-primary transition-colors duration-500 relative">
                <step.icon className="w-10 h-10 text-white group-hover:text-primary transition-colors duration-300" />
                <div className="absolute inset-0 rounded-full bg-primary/20 opacity-0 group-hover:opacity-100 animate-ping" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
              <p className="text-zinc-400 leading-relaxed max-w-xs">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
