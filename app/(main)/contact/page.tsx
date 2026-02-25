import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";

export const metadata = {
  title: "Contact Us | Eventia",
  description:
    "Reach out to us for support, partnerships, or general questions.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background py-25 lg:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-size-[14px_24px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
          <div className="w-[400px] h-[400px] rounded-full bg-primary/20 blur-3xl opacity-50" />
        </div>
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3">
          <div className="w-[300px] h-[300px] rounded-full bg-primary/20 blur-3xl opacity-50 dark:bg-primary/10" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-500/80">
              Touch
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground">
            Have questions about Eventia? We&apos;re here to help you with
            support, partnerships, or any general inquiries.
          </p>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="container mx-auto px-4 md:px-6 py-12 lg:py-20 flex-1">
        <div className="grid gap-12 lg:grid-cols-3 lg:gap-16 items-start">
          {/* Info Cards Side */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-2">
                Contact Information
              </h2>
              <p className="text-muted-foreground mb-8 text-sm">
                Reach out to us directly through any of these channels.
              </p>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:border-primary/50 group">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Email Us</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Our team typically responds within 24 hours.
                </p>
                <a
                  href="mailto:support@eventia.com"
                  className="text-sm font-medium text-primary mt-2 inline-block hover:underline"
                >
                  support@eventia.com
                </a>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:border-primary/50 group">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Phone className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Call Us</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Available Mon-Fri, 9am to 6pm EST.
                </p>
                <a
                  href="tel:+15551234567"
                  className="text-sm font-medium text-primary mt-2 inline-block hover:underline"
                >
                  +1 (555) 123-4567
                </a>
              </div>
            </div>

            <div className="flex gap-4 p-5 rounded-2xl border bg-card/50 backdrop-blur-sm shadow-sm transition-all hover:shadow-md hover:border-primary/50 group">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Our Location</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  HQ in Tech Hub.
                </p>
                <span className="text-sm font-medium mt-2 inline-block text-foreground/80">
                  123 Innovation Drive
                  <br />
                  San Francisco, CA 94103
                </span>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-2 lg:mt-[92px]">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-16 lg:py-24 border-t">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Quick answers to common questions about our platform.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                How do I create a new event?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                You can easily create an event by registering an account and
                navigating to your dashboard where you will find the
                &quot;Create Event&quot; button.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Is Eventia free to use?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Yes, creating general events is completely free. We also offer
                premium features for large-scale enterprise events.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                How can I manage my attendees?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Once an event is published, you gain access to an attendee
                management portal in your dashboard to track registrations and
                check-ins.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="font-semibold text-lg mb-2 text-foreground">
                Can I customize my event page?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Absolutely! You can upload custom banners, write detailed
                descriptions, and configure custom ticket types matching your
                brand.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
