"use client";

import { motion, useInView, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef } from "react";

const stats = [
  { label: "Users", value: 10000, suffix: "+" },
  { label: "Events Hosted", value: 500, suffix: "+" },
  { label: "Cities", value: 30, suffix: "+" },
  { label: "Satisfaction", value: 95, suffix: "%" },
];

const Counter = ({ value, suffix }: { value: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const springValue = useSpring(0, { duration: 3000, bounce: 0 });

  useEffect(() => {
    if (inView) {
      springValue.set(value);
    }
  }, [inView, value, springValue]);

  const displayValue = useTransform(springValue, (latest) =>
    Math.floor(latest),
  );

  return (
    <span ref={ref} className="text-5xl md:text-6xl font-black text-foreground">
      <motion.span>{displayValue}</motion.span>
      {suffix}
    </span>
  );
};

export default function Stats() {
  return (
    <section className="py-24 bg-background relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-secondary to-background z-0" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <Counter value={stat.value} suffix={stat.suffix} />
              <span className="text-zinc-500 uppercase tracking-widest text-sm font-semibold">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
