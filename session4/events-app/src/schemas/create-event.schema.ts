import { z } from "zod";
import { EVENT_CATEGORIES } from "../data/event-categories";

const categoryValues = EVENT_CATEGORIES.map((c) => c.value) as [
  (typeof EVENT_CATEGORIES)[number]["value"],
  ...(typeof EVENT_CATEGORIES)[number]["value"][]
];

export const createEventSchema = z.object({
  title: z
    .string({ message: "Title is required" })
    .trim()
    .min(1, { message: "Title is required" })
    .min(3, { message: "Title must be at least 3 characters" }),
  email: z
    .string({ message: "Organizer email is required" })
    .trim()
    .min(1, { message: "Organizer email is required" })
    .email({ message: "Please enter a valid email address" }),
  category: z.enum(categoryValues, {
    message: "Please select an event category",
  }),
  eventDate: z
    .string({ message: "Event date is required" })
    .min(1, { message: "Event date is required" }),
  description: z
    .string({ message: "Description is required" })
    .trim()
    .min(1, { message: "Description is required" })
    .min(10, { message: "Description must be at least 10 characters" }),
});

export type CreateEventFormData = z.infer<typeof createEventSchema>;

export interface CreatedMockEvent {
  id: string;
  title: string;
  email: string;
  category: (typeof EVENT_CATEGORIES)[number]["value"];
  eventDate: string;
  description: string;
  createdAt: string;
}
