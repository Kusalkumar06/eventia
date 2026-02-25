import { Facebook, Instagram, Twitter, Linkedin, Github } from "lucide-react";
import Link from "next/link";

const socialLinks = [
  { icon: Twitter, href: "#" },
  { icon: Instagram, href: "#" },
  { icon: Facebook, href: "#" },
  { icon: Linkedin, href: "#" },
  { icon: Github, href: "#" },
];

const footerLinks = [
  {
    title: "Product",
    links: ["Features", "Pricing", "API", "Integrations"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security", "Cookies"],
  },
];

export default function Footer() {
  return (
    <footer className="bg-black text-white pt-24 pb-12 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-1">
            <Link
              href="/"
              className="text-2xl font-black tracking-tighter mb-6 block"
            >
              EVENTIA
            </Link>
            <p className="text-zinc-500 mb-6">
              The next generation event management platform for immersive
              experiences.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, idx) => (
                <Link
                  key={idx}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-400 hover:bg-primary hover:text-white transition-all duration-300"
                >
                  <social.icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
          </div>

          {footerLinks.map((column, idx) => (
            <div key={idx}>
              <h4 className="font-bold mb-6 text-lg">{column.title}</h4>
              <ul className="space-y-4">
                {column.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href="#"
                      className="text-zinc-500 hover:text-primary transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Eventia Inc. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
