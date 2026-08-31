# Event Forge: Product and System Design

## Goal

Event Forge is a small, client-only event-management workspace. People can browse a useful event inventory, narrow it with filters, add a new event, and update an existing event. There is no authentication, backend, or real persistence in this version; realistic TypeScript mock data is the source of truth for a running session.

## Product scope

### Included

- Event list with a result count and a clearly differentiated empty state.
- Keyword search across title, category, organizer email, and description.
- Category filter and inclusive start/end date filters.
- One form used for both creating and editing events.
- Client-side validation using React Hook Form and Zod.
- Immediate in-session updates after create or edit.
- Responsive, keyboard-accessible interface.

### Excluded

- Authentication, roles, registrations, attendee management, media uploads, remote API calls, and durable storage.
- Event deletion. It is intentionally deferred to avoid accidental destructive behavior in the first version.

## Experience and visual direction

The application uses a purposeful Brutalism Design System rather than a generic dashboard treatment:

- **Voice:** editorial, assertive, utilitarian, and slightly playful. Page copy uses plain language such as “Make something happen.”
- **Canvas:** warm off-white (`#FAF5FF`) with a faint square-grid texture.
- **Structure:** near-black 3–4px borders, no rounded cards, visible layout divisions, asymmetric header composition, and compact boxed labels.
- **Colour:** violet is the navigation and structural colour; orange is reserved for the primary commitment action (add/save). Destructive red is only reserved for errors.
- **Type:** Inter for readable UI text and a bold mono face for labels, counts, and form metadata. Headings are oversized and tightly tracked.
- **Motion:** short opacity/background changes only; no essential animation. Respect `prefers-reduced-motion`.

The design remains usable rather than performatively rough: controls are native semantic elements, body contrast meets WCAG AA, focus rings are prominent, and small-screen layouts stack without horizontal scrolling.

## Pages and routes

| Route | Purpose | Primary interaction |
| --- | --- | --- |
| `/events` | Default workspace and event inventory | Search/filter; open an event for editing |
| `/events/new` | Create-event page | Validate and add an event |
| `/events/:eventId/edit` | Edit-event page | Pre-fill, validate, and update an event |
| `*` | Friendly not-found page | Return to the event inventory |

### Event list

The list page has a bold masthead (“EVENT FORGE / OPEN AGENDA”), an `ADD EVENT` action, and an always-visible filter control strip. At desktop width, filters sit in an asymmetric two-column frame beside a results ledger; at smaller widths they become a one-column stack.

Each event is a bordered row/card with date block, title, category tag, organizer email, shortened description, and an `EDIT` action. The date is visually dominant so the list can be scanned quickly. The filter state stays in the URL query string where practical (`q`, `category`, `from`, `to`) so a filtered view can be shared or refreshed without ambiguity.

### Create and edit form

Create and edit use the same `EventForm` component and differ only in heading, initial values, submit label, and action. The page is arranged as an information board: intro and rules on the left, fields in a bordered form panel on the right. On mobile, the information board appears above the form.

Fields are:

- Event title — required, minimum 3 characters.
- Organizer email — required, valid email address.
- Category — required predefined selection.
- Event date — required ISO date, using a native date input.
- Description — required, minimum 10 characters, with character feedback.

Validation runs on blur and on submit. A failed submit presents a focusable error summary with links to invalid inputs, while each individual field retains its own connected inline error. A successful create returns to the filtered event list with a concise success notice; a successful edit returns to the event list with the updated record visible.

## Data model

```ts
type EventCategory = 'Technology' | 'Business' | 'Arts' | 'Community' | 'Wellness'

type Event = {
  id: string
  title: string
  organizerEmail: string
  category: EventCategory
  eventDate: string // YYYY-MM-DD
  description: string
  createdAt: string // ISO timestamp
  updatedAt: string // ISO timestamp
}
```

The `src/data/events.ts` module supplies a varied seeded array and exports the fixed category list. Values are typed, deterministic, and include enough future and past dates to exercise filtering and empty states.

## Client system design

```text
Routes
  ├─ EventsPage ─ FilterBar + EventList + EventCard
  ├─ CreateEventPage ─ EventForm
  └─ EditEventPage ─ EventForm
                         │
                    EventsProvider
                         │
       ┌─────────────────┴─────────────────┐
       │                                   │
Events service/state                   Zod schema
(seed, create, update, find)      (shared form validation)
       │
Typed mock events
```

`EventsProvider` owns only the mutable event collection and exposes `events`, `createEvent`, `updateEvent`, and `getEvent`. It initializes from the mock collection for each browser session. Components never mutate mock data directly.

`EventsPage` owns the small, URL-synchronised filter-input state. Filtered events and result counts are derived during render—never duplicated in state or calculated in effects. Search input can use React’s `useDeferredValue` to keep filtering responsive if the collection grows.

`EventForm` owns only form mechanics through React Hook Form. The Zod schema is the single validation contract, and the page that renders it supplies the initial data and success action. This keeps create and edit flows consistent without coupling them to list UI.

## Behaviour rules and edge cases

- Search is case-insensitive and matches event title, organizer email, category, and description.
- Category "All categories" means no category constraint.
- A missing date boundary is open-ended; when both exist, the range is inclusive.
- A date range with an end before its start is rejected with a specific filter error and does not silently change results.
- `eventId` not found on the edit route shows a recovery state with a link back to `/events`.
- Submitting while data is invalid never changes the event collection.
- New IDs and timestamps are generated in the state layer, not by form components.
- Success feedback is visible and announced without relying on colour alone.

## Component boundaries

| Component/module | Responsibility |
| --- | --- |
| `App` | Router and provider composition |
| `EventsProvider` | In-session event collection and create/update actions |
| `events.ts` | Event types, categories, and seeded data |
| `eventSchema.ts` | Zod schema and inferred form type |
| `FilterBar` | Accessible filter inputs and clear action |
| `EventList` | Result/empty-state orchestration |
| `EventCard` | Event summary and edit link |
| `EventForm` | Shared create/edit inputs, error summary, and submit handling |
| Route pages | Page copy, data lookup, and navigation outcome |

## Quality plan

- Unit-test Zod validation and pure filter logic, especially inclusive date boundaries and invalid ranges.
- Component-test form errors, successful create/update paths, category and search filtering, and missing event recovery.
- Verify the principal flow at 375px, 768px, 1024px, and 1440px.
- Keyboard-test the filter controls, create/edit navigation, error summary links, and visible focus state.
- Run TypeScript build and ESLint before delivery.

## Future API migration

When a backend is introduced, replace the provider’s seeded initializer and create/update functions with an `EventsRepository` implementation. The `Event` type, schema, route page contracts, filters, and visual components remain unchanged. Authentication and deletion should be introduced as separate, explicitly scoped features.
