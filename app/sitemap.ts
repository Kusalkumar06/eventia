import { MetadataRoute } from 'next';
import { connectDb } from "@/lib/db";
import { EventModel } from "@/models/event.model";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Important static pages
  const staticPages = [
    '',
    '/events',
    '/contact',
    '/signin',
    '/signup'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  try {
    // Dynamic Event Pages
    await connectDb();
    const events = await EventModel.find({ status: 'published' }).select('slug updatedAt');

    const eventPages = events.map((event) => ({
      url: `${baseUrl}/events/${event.slug}`,
      lastModified: event.updatedAt || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticPages, ...eventPages];
  } catch (error) {
    console.error("Error generating sitemap for events:", error);
    // Return static pages as fallback
    return staticPages;
  }
}
