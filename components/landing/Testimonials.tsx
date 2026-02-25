"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Quote } from "lucide-react";
import EventImage from "@/components/shared/EventImage";

const testimonials = [
  {
    name: "Alex Johnson",
    role: "Event Organizer",
    quote:
      "Eventia transformed how we manage our tech conferences. The platform is intuitive and powerful.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Sarah Williams",
    role: "Music Producer",
    quote:
      "The best place to discover underground artists and gigs. Totally changed my weekends.",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "David Chen",
    role: "Startup Founder",
    quote:
      "Networking made easy. I met my co-founder at an event I found here. Highly recommended!",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974&auto=format&fit=crop",
  },
];

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  image: string;
}

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent) {
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const xPct = (clientX - left) / width - 0.5;
    const yPct = (clientY - top) / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]),
        rotateY: useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]),
      }}
      className="bg-card border border-border p-8 rounded-2xl relative h-full flex flex-col justify-between transform-gpu transition-colors duration-300"
    >
      <Quote className="w-10 h-10 text-primary/20 absolute top-6 right-6" />
      <p className="text-foreground/80 text-lg mb-6 italic relative z-10">
        &quot;{testimonial.quote}&quot;
      </p>

      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
          <EventImage
            src={testimonial.image}
            alt={testimonial.name}
            fill
            sizes="48px"
          />
        </div>
        <div>
          <h4 className="font-bold text-foreground">{testimonial.name}</h4>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default function Testimonials() {
  return (
    <section className="py-24 bg-background text-foreground transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">
            What People Say
          </h2>
          <p className="text-muted-foreground">
            Join thousands of satisfied users.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <TestimonialCard key={idx} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
