import Hero from "@/components/landing/Hero";
import LiveEvents from "@/components/landing/LiveEvents";
import Categories from "@/components/landing/Categories";
import HowItWorks from "@/components/landing/HowItWorks";
import Stats from "@/components/landing/Stats";
import Testimonials from "@/components/landing/Testimonials";
import OrganizerCTA from "@/components/landing/OrganizerCTA";
import Newsletter from "@/components/landing/Newsletter";

export default function LandingPage() {
  return (
    <div className="bg-background text-foreground min-h-screen selection:bg-primary selection:text-white md:selection:text-primary-foreground overflow-hidden">
      <Hero />
      <LiveEvents />
      <Categories />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <OrganizerCTA />
      <Newsletter />
    </div>
  );
}
