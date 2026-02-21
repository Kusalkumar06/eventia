"use client";

import { motion } from "framer-motion";
import {
  Music,
  Mic,
  Palette,
  Briefcase,
  Dumbbell,
  Gamepad2,
  Plane,
  Utensils,
} from "lucide-react";

const categories = [
  { name: "Music", icon: Music, color: "from-pink-500 to-rose-500" },
  { name: "Comedy", icon: Mic, color: "from-amber-400 to-orange-500" },
  { name: "Art", icon: Palette, color: "from-indigo-400 to-cyan-400" },
  { name: "Business", icon: Briefcase, color: "from-emerald-400 to-green-500" },
  { name: "Sports", icon: Dumbbell, color: "from-blue-500 to-indigo-500" },
  { name: "Gaming", icon: Gamepad2, color: "from-purple-500 to-violet-500" },
  { name: "Travel", icon: Plane, color: "from-sky-400 to-blue-500" },
  { name: "Food", icon: Utensils, color: "from-red-400 to-pink-500" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function Categories() {
  return (
    <section className="py-24 bg-background text-foreground transition-colors duration-300 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            Explore Categories
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dive into a world of possibilities. Find events that match your
            passion.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="group relative h-40 rounded-2xl bg-card border border-border transition-all duration-300 overflow-hidden cursor-pointer"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <div className="p-4 rounded-full bg-secondary group-hover:bg-primary transition-colors">
                  <cat.icon className="w-8 h-8 text-foreground group-hover:text-primary-foreground transition-colors duration-300" />
                </div>
                <span className="font-semibold text-lg">{cat.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
