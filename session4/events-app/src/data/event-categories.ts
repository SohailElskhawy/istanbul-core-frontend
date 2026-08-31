export interface EventCategoryItem {
  value: string;
  label: string;
}

export const EVENT_CATEGORIES = [
  { value: "conference", label: "Conference" },
  { value: "workshop", label: "Workshop" },
  { value: "meetup", label: "Meetup" },
  { value: "webinar", label: "Webinar" },
  { value: "networking", label: "Networking" },
  { value: "other", label: "Other" },
] as const;

export type EventCategoryValue = (typeof EVENT_CATEGORIES)[number]["value"];
