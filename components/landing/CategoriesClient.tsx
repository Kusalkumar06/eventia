"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";

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

export default function CategoriesClient({
  categories,
}: {
  categories: {
    _id: string;
    name: string;
    slug: string;
    icon: string;
    color: string;
  }[];
}) {
  const router = useRouter();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="grid grid-cols-2 md:grid-cols-4 gap-6"
    >
      {categories.map((cat, idx) => {
        const iconName = cat.icon as keyof typeof Icons;
        const IconComponent =
          (Icons[iconName] as React.ElementType) || Icons.Calendar;

        return (
          <motion.div
            key={idx}
            variants={itemVariants}
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push(`/events?category=${cat.slug}`)}
            className="group relative h-40 rounded-2xl bg-card border border-border transition-all duration-300 overflow-hidden cursor-pointer"
          >
            <div
              className={`absolute inset-0 bg-linear-to-br ${cat.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
            />

            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="p-4 rounded-full bg-secondary group-hover:bg-primary transition-colors">
                <IconComponent className="w-8 h-8 text-foreground group-hover:text-primary-foreground transition-colors duration-300" />
              </div>
              <span className="font-semibold text-lg">{cat.name}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
