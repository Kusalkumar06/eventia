"use server";
import { connectDb } from "@/lib/db";
import { EventModel, IEvent } from "@/models/event.model";
import { requireAdmin } from "@/lib/auth-guards";
import { EventDTO } from "@/types/types";
import { CategoryModel } from "@/models/category.model";
import { RegistrationModel } from "@/models/registration.model";
import mongoose from "mongoose";

type EventWithCategoryAndOrganizer = Omit<IEvent, "category" | "organizer"> & {
  category: {
    _id: mongoose.Types.ObjectId;
    name: string;
    slug: string;
  };
  organizer: {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
  };
};

const mapEventToDTO = (event: EventWithCategoryAndOrganizer): EventDTO => ({
  _id: event._id.toString(),
  title: event.title,
  slug: event.slug,
  description: event.description,
  shortDescription: event.shortDescription,
  category: {
    _id: event.category._id.toString(),
    name: event.category.name,
    slug: event.category.slug,
  },
  otherCategoryLabel: event.otherCategoryLabel,
  tags: event.tags,
  mode: event.mode,
  location: event.location,
  onlineURL: event.onlineURL,
  startDate: event.startDate.toISOString(),
  endDate: event.endDate.toISOString(),
  status: event.status,
  organizer: {
    _id: event.organizer._id.toString(),
    name: event.organizer.name,
    email: event.organizer.email,
  },
  isRegistrationRequired: event.isRegistrationRequired,
  maxRegistrations: event.maxRegistrations,
  registrationsCount: event.registrationsCount,
  createdAt: event.createdAt.toISOString(),
  updatedAt: event.updatedAt.toISOString(),
});

export async function getPendingEvents(): Promise<EventDTO[]> {
  await connectDb();
  await requireAdmin();

  const events = await EventModel.find({ status: "draft" })
    .populate("organizer", "name email")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean<EventWithCategoryAndOrganizer[]>();

  return events.map(mapEventToDTO);
}

export async function getPublishedEvents(): Promise<EventDTO[]> {
  await connectDb();
  await requireAdmin();

  const events = await EventModel.find({ status: "published" })
    .populate("organizer", "name email")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean<EventWithCategoryAndOrganizer[]>();

  return events.map(mapEventToDTO);
}

export async function getRejectedEvents(): Promise<EventDTO[]> {
  await connectDb();
  await requireAdmin();

  const events = await EventModel.find({ status: "rejected" })
    .populate("organizer", "name email")
    .populate("category", "name slug")
    .sort({ createdAt: -1 })
    .lean<EventWithCategoryAndOrganizer[]>();

  return events.map(mapEventToDTO);
}

type EventFilter = {
  status: "published";
  $or?: Array<
    | { title: { $regex: string; $options: string } }
    | { description: { $regex: string; $options: string } }
  >;
  category?: mongoose.Types.ObjectId;
};

export async function getEvents(searchParams: { search?: string; category?: string } = {}): Promise<EventDTO[]> {
  await connectDb();

  const { search, category: categorySlug } = searchParams;

  const filter: EventFilter = { status: "published" };

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  if (categorySlug) {
    const category = await CategoryModel.findOne({
      slug: categorySlug,
      isActive: true,
    });

    if (!category) {
      return [];
    }

    filter.category = category._id;
  }

  const events = await EventModel.find(filter)
    .populate("category", "name slug")
    .populate("organizer", "name email")
    .sort({ startDate: 1 })
    .lean<EventWithCategoryAndOrganizer[]>();

  return events.map(mapEventToDTO);
}

export async function getEventsBySlug(slug: string): Promise<EventDTO | null> {
  await connectDb();

  const event = await EventModel.findOne({ slug })
    .populate("category", "name slug")
    .populate("organizer", "name email")
    .lean<EventWithCategoryAndOrganizer>();

  if (!event) return null;

  return mapEventToDTO(event);
}

export async function getEventRegistrations(eventId: string) {
  await connectDb();
  await requireAdmin();

  type PopulatedRegistration = {
    _id: mongoose.Types.ObjectId;
    createdAt: Date | string;
    user: {
      _id: mongoose.Types.ObjectId;
      name: string;
      email: string;
      image?: string;
    };
  };

  const registrations = await RegistrationModel.find({ event: eventId })
    .populate("user", "name email image _id")
    .sort({ createdAt: -1 })
    .lean<PopulatedRegistration[]>();

  return registrations.map((reg) => {
    return {
      _id: reg._id.toString(),
      user: {
        _id: reg.user._id.toString(),
        name: reg.user.name,
        email: reg.user.email,
        image: reg.user.image || null,
      },
      createdAt: reg.createdAt instanceof Date ? reg.createdAt.toISOString() : reg.createdAt,
    };
  });
}
