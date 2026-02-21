export type EventDTO = {
  _id: string;

  title: string;
  slug: string;
  description: string;
  shortDescription?: string;

  category: {
    _id: string;
    name: string;
    slug: string;
  };

  otherCategoryLabel?: string;

  tags?: string[];

  mode: "online" | "offline";

  location?: {
    venue?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };

  onlineURL?: string;

  startDate: string;   
  endDate: string;     

  status: "draft" | "published" | "cancelled" | "completed" | "rejected";

  organizer: {
    _id: string
    name: string
    email: string
  },

  isRegistrationRequired: boolean;
  maxRegistrations?: number;
  registrationsCount: number;

  createdAt: string;    
  updatedAt: string;   
};
