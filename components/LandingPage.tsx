import dynamic from "next/dynamic";
import { Suspense } from "react";

// Dynamically import heavy landing components
const Hero = dynamic(() => import("@/components/landing/Hero"), { ssr: true });
const LiveEvents = dynamic(() => import("@/components/landing/LiveEvents"), {
  ssr: true,
});
const Categories = dynamic(() => import("@/components/landing/Categories"), {
  ssr: true,
});
const HowItWorks = dynamic(() => import("@/components/landing/HowItWorks"), {
  ssr: true,
});
const Stats = dynamic(() => import("@/components/landing/Stats"), {
  ssr: true,
});
const Testimonials = dynamic(
  () => import("@/components/landing/Testimonials"),
  { ssr: true },
);
const OrganizerCTA = dynamic(
  () => import("@/components/landing/OrganizerCTA"),
  { ssr: true },
);
const Newsletter = dynamic(() => import("@/components/landing/Newsletter"), {
  ssr: true,
});

// Skeletons
const SectionSkeleton = () => (
  <div className="w-full h-[400px] bg-zinc-900/50 animate-pulse rounded-3xl my-10" />
);

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen selection:bg-primary selection:text-white md:selection:text-primary-foreground overflow-hidden">
      <Suspense
        fallback={<div className="h-screen w-full bg-black animate-pulse" />}
      >
        <Hero />
      </Suspense>

      <div className="max-w-7xl mx-auto space-y-24 py-24">
        <Suspense fallback={<SectionSkeleton />}>
          <LiveEvents />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Categories />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <HowItWorks />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Stats />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Testimonials />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <OrganizerCTA />
        </Suspense>

        <Suspense fallback={<SectionSkeleton />}>
          <Newsletter />
        </Suspense>
      </div>
    </div>
  );
}
