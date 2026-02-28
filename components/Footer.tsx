"use client";

import { Linkedin, Github, Mail, ArrowUp } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const socialLinks = [
  {
    icon: Linkedin,
    href: "https://www.linkedin.com/in/kusalkumar-amaravathi/",
  },
  { icon: Github, href: "https://github.com/Kusalkumar06/" },
  { icon: Mail, href: "mailto:kusal.projects.dev@gmail.com" },
];

const popupContent: Record<string, { title: string; points: string[] }> = {
  about: {
    title: "About Eventia",
    points: [
      "Our Mission: Empowering creators to host unforgettable events.",
      "The Team: Built by passionate event professionals and engineers.",
      "History: Founded to solve the complexities of modern ticketing.",
      "Culture: We value innovation, transparency, and community.",
      "Vision: To become the global standard for immersive experiences.",
    ],
  },
  blog: {
    title: "Eventia Blog",
    points: [
      "Industry Insights: Stay ahead with the latest event trends.",
      "Creator Spotlights: Learn from top event organizers.",
      "Platform Updates: Be the first to know about new features.",
      "Guides: Step-by-step tutorials for mastering event management.",
      "Community Stories: See how others are using Eventia.",
    ],
  },
  careers: {
    title: "Careers (Coming Soon)",
    points: [
      "Open Roles: We will be hiring across engineering and marketing.",
      "Benefits: Competitive salary, health, and wellness perks.",
      "Remote First: Work from anywhere in the world.",
      "Growth: Continuous learning and development opportunities.",
      "Culture: Join a fast-paced, collaborative team.",
    ],
  },
  contact: {
    title: "Contact Us",
    points: [
      "Support: Get help with your account or ticketing issues.",
      "Sales: Reach out for enterprise and custom solutions.",
      "Press: For media inquiries and brand assets.",
      "Response Time: We aim to respond within 24 business hours.",
      "Location: Headquartered digitally, serving globally.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    points: [
      "Data Collection: What we collect and why we need it.",
      "Data Usage: How your information powers the platform.",
      "Third Parties: We do not sell your personal data.",
      "Your Rights: You can request account deletion at any time.",
      "Updates: We will notify you of any policy changes.",
    ],
  },
  terms: {
    title: "Terms of Service",
    points: [
      "User Guidelines: Acceptable behavior on the platform.",
      "Ticketing Policy: Rules regarding sales and refunds.",
      "Content Ownership: You retain rights to your event data.",
      "Termination: Grounds for account suspension or removal.",
      "Liability: Limitations of Eventia's responsibility.",
    ],
  },
  security: {
    title: "Security & Compliance",
    points: [
      "Infrastructure: Hosted on enterprise-grade cloud providers.",
      "Encryption: All data is encrypted in transit and at rest.",
      "Payment Processing: Handled securely via PCI-compliant gateways.",
      "Audits: Regular security reviews and penetration testing.",
      "Reporting: Found a bug? Contact our security team.",
    ],
  },
  cookies: {
    title: "Cookie Policy",
    points: [
      "Essential Cookies: Required for core platform functionality.",
      "Analytics: Helping us understand how you use Eventia.",
      "Preferences: Saving your language and theme choices.",
      "Third-Party: Used for integrated services and support.",
      "Management: You can control cookies via your browser.",
    ],
  },
};

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activePopup, setActivePopup] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <footer className="bg-black text-white pt-24 pb-12 border-t border-zinc-900 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <Link
                href="/"
                className="text-2xl font-black tracking-tighter mb-6 block"
              >
                EVENTIA
              </Link>
              <p className="text-zinc-500 mb-6 font-medium">
                The next generation event management platform for immersive
                experiences.
              </p>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => (
                  <Link
                    key={idx}
                    href={social.href}
                    target="_blank"
                    className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300 shadow-sm"
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Company</h4>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => setActivePopup("about")}
                    className="text-zinc-500 hover:text-primary transition-colors cursor-pointer transform inline-block text-left"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePopup("blog")}
                    className="text-zinc-500 hover:text-primary transition-colors cursor-pointer transform inline-block text-left"
                  >
                    Blog
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePopup("careers")}
                    className="text-zinc-500 hover:text-primary transition-colors cursor-pointer transform inline-block text-left"
                  >
                    Careers
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePopup("contact")}
                    className="text-zinc-500 hover:text-primary transition-colors cursor-pointer transform inline-block text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Legal</h4>
              <ul className="space-y-4">
                <li>
                  <button
                    onClick={() => setActivePopup("privacy")}
                    className="text-zinc-500 hover:text-primary transition-colors cursor-pointer transform inline-block text-left"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePopup("terms")}
                    className="text-zinc-500 hover:text-primary transition-colors cursor-pointer transform inline-block text-left"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePopup("security")}
                    className="text-zinc-500 hover:text-primary transition-colors cursor-pointer transform inline-block text-left"
                  >
                    Security
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActivePopup("cookies")}
                    className="text-zinc-500 hover:text-primary transition-colors cursor-pointer transform inline-block text-left"
                  >
                    Cookies
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-lg">Quick Links</h4>
              <ul className="space-y-4">
                <li>
                  <Link
                    href="/"
                    className="text-zinc-500 hover:text-primary transition-colors cursor-pointer transform inline-block"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/events"
                    className="text-zinc-500 hover:text-primary transition-colors cursor-pointer transform inline-block"
                  >
                    Explore Events
                  </Link>
                </li>
                <li>
                  <Link
                    href="/create-event"
                    className="text-zinc-500 hover:text-primary transition-colors hover:translate-x-1 transform inline-block"
                  >
                    Host an Event
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-sm">
            <p>
              &copy; {new Date().getFullYear()} Eventia Inc. Developed by{" "}
              <a
                href="https://github.com/Kusalkumar06/"
                target="_blank"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Kusal Kumar
              </a>
              . All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Popups */}
      {activePopup && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setActivePopup(null)}
        >
          <div
            className="bg-background text-foreground border border-border rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6">
              {popupContent[activePopup].title}
            </h3>
            <ul className="space-y-4 text-muted-foreground mb-8">
              {popupContent[activePopup].points.map((point, idx) => {
                const [boldText, rest] = point.split(": ");
                return (
                  <li key={idx} className="flex gap-2 leading-relaxed">
                    <span className="text-primary shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>
                      <strong className="text-foreground">{boldText}:</strong>{" "}
                      {rest || ""}
                    </span>
                  </li>
                );
              })}
            </ul>
            <button
              onClick={() => setActivePopup(null)}
              className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Floating Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-40 w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-110 active:scale-95 ${
          showScrollTop
            ? "translate-y-0 opacity-100"
            : "translate-y-16 opacity-0"
        }`}
        aria-label="Scroll to top"
      >
        <ArrowUp className="w-6 h-6" />
      </button>
    </>
  );
}
