import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Mail,
  ArrowLeft,
  User,
  Tag,
} from "lucide-react";
import { getEventsBySlug } from "@/utilities/server/eventActions";
import RegisterButton from "@/components/RegisterButton";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { RegistrationModel } from "@/models/registration.model";
import { connectDb } from "@/lib/db";

export async function generateMetadata(props: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const params = await props.params;
  const slug = params.slug;
  const eventSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
  const event = await getEventsBySlug(eventSlug);

  if (!event) {
    return {
      title: "Event Not Found",
    };
  }

  const { title, shortDescription, description } = event;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let plainDescription = shortDescription || description || "Event details...";
  if (plainDescription.length > 160) {
    plainDescription = plainDescription.substring(0, 157) + "...";
  }

  return {
    title: title,
    description: plainDescription,
    openGraph: {
      title: title,
      description: plainDescription,
      url: `${baseUrl}/events/${eventSlug}`,
      siteName: "Eventia",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: plainDescription,
    },
  };
}

const EventDetailsPage = async (props: {
  params: Promise<{ slug: string[] }>;
}) => {
  const params = await props.params;
  const slug = params.slug;
  const eventSlug = Array.isArray(slug) ? slug[slug.length - 1] : slug;
  const [event, session] = await Promise.all([
    getEventsBySlug(eventSlug),
    getServerSession(authOptions),
  ]);

  let initialIsRegistered = false;
  if (event && session?.user?.id && event.isRegistrationRequired) {
    await connectDb();
    const existingRegistration = await RegistrationModel.findOne({
      user: session.user.id,
      event: event._id,
    });
    initialIsRegistered = !!existingRegistration;
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Event Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The event you&apos;re looking for doesn&apos;t exist or has been
          removed.
        </p>
        <Link
          href="/events"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const {
    title,
    category,
    shortDescription,
    description,
    startDate,
    endDate,
    location,
    organizer,
    registrationsCount,
    maxRegistrations,
    tags,
  } = event;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl pt-24">
      <Link
        href="/events"
        className="inline-flex items-center text-primary hover:underline mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Events
      </Link>

      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <h1 className="text-4xl font-bold text-foreground leading-tight">
            {title}
          </h1>
          <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium self-start md:self-auto whitespace-nowrap">
            {category.name}
          </span>
        </div>
        {shortDescription && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {shortDescription}
          </p>
        )}
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Calendar className="w-5 h-5" />
                <span>Date</span>
              </div>
              <p className="text-xl font-medium mt-auto">
                {formatDate(startDate)}
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm flex flex-col items-start gap-3">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <Clock className="w-5 h-5" />
                <span>Time</span>
              </div>
              <p className="text-xl font-medium mt-auto">
                {formatTime(startDate)} – {formatTime(endDate)}
              </p>
            </div>
          </div>

          {event.mode === "online" ? (
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <MapPin className="w-5 h-5" />
                <span>Location</span>
              </div>
              <div>
                <p className="text-xl font-bold mb-1">Online Event</p>
              </div>
            </div>
          ) : location ? (
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-foreground font-semibold">
                <MapPin className="w-5 h-5" />
                <span>Location</span>
              </div>
              <div>
                <p className="text-xl font-bold mb-1">
                  {location.city}, {location.state}
                </p>
                <p className="text-muted-foreground">
                  {location.venue}
                  {location.city ? `, ${location.state}` : ""}
                </p>
              </div>
            </div>
          ) : null}

          <section className="bg-card border border-border p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-xl font-bold text-foreground">
              About This Event
            </h2>
            <div className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {description}
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {tags && tags.length > 0 && (
            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 font-semibold mb-4 text-foreground">
                <Tag className="w-5 h-5" />
                <h3 className="text-lg">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-2">
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="text-primary font-medium hover:underline cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 font-semibold mb-4">
              <User className="w-5 h-5" />
              <h3>Organizer</h3>
            </div>
            <div className="space-y-3">
              <p className="font-medium text-lg">{organizer.name}</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <a
                    href={`mailto:${organizer.email}`}
                    className="hover:text-primary transition-colors"
                  >
                    {organizer.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-2 font-semibold mb-4 text-foreground">
              <Users className="w-5 h-5" />
              <h3 className="text-lg">Attendance</h3>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {registrationsCount}{" "}
                {maxRegistrations ? `/ ${maxRegistrations}` : ""} people
                attending
              </p>
              <RegisterButton
                key={`${event._id.toString()}-${registrationsCount}-${initialIsRegistered}`}
                eventId={event._id}
                endDate={endDate}
                isRegistrationRequired={event.isRegistrationRequired}
                maxRegistrations={maxRegistrations}
                registrationsCount={registrationsCount}
                initialIsRegistered={initialIsRegistered}
              />
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default EventDetailsPage;
