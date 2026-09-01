import type { Activity, Board, Comment, Task, User } from "../types";

export const users: User[] = [
    { id: "u1", name: "Sohail", avatarColor: "#6366f1", initials: "SO", role: "Tech Lead" },
    { id: "u2", name: "Amina", avatarColor: "#ec4899", initials: "AM", role: "Frontend Dev" },
    { id: "u3", name: "Karim", avatarColor: "#f59e0b", initials: "KA", role: "Backend Dev" },
    { id: "u4", name: "Layla", avatarColor: "#10b981", initials: "LA", role: "Designer" },
];

export const boards: Board[] = [
    {
        id: "b1",
        name: "Website Redesign",
        description: "Marketing site revamp for Q3 launch",
        emoji: "🎨",
        color: "#6366f1",
        memberIds: ["u1", "u2", "u4"],
    },
    {
        id: "b2",
        name: "Mobile App v2",
        description: "Next iteration of the iOS & Android app",
        emoji: "📱",
        color: "#10b981",
        memberIds: ["u1", "u3"],
    },
    {
        id: "b3",
        name: "DevOps & Infra",
        description: "CI/CD, monitoring and platform work",
        emoji: "⚙️",
        color: "#f59e0b",
        memberIds: ["u3"],
    },
];

let taskSeq = 100;
const nextTaskId = () => `t${++taskSeq}`;

const mkTask = (
    boardId: string,
    columnId: Task["columnId"],
    order: number,
    title: string,
    description: string,
    assigneeId: string | null,
    labels: string[],
    priority: Task["priority"],
    dueDate: string | null = null,
): Task => ({
    id: nextTaskId(),
    boardId,
    columnId,
    order,
    title,
    description,
    assigneeId,
    labels,
    priority,
    dueDate,
    createdAt: new Date(Date.now() - order * 86400000).toISOString(),
});

export const tasks: Task[] = [
    // ---- Website Redesign ----
    mkTask("b1", "todo", 0, "Audit current site content", "Go through every page and flag outdated copy, broken links and missing meta tags.", "u4", ["research"], "medium", "2026-09-10"),
    mkTask("b1", "todo", 1, "Design new hero section", "Three concepts for the landing hero with animation notes.", "u4", ["design"], "high", "2026-09-14"),
    mkTask("b1", "todo", 2, "Choose typography system", "Compare Inter vs. Geist for headings and body.", null, ["design"], "low"),
    mkTask("b1", "in-progress", 0, "Build responsive nav bar", "Sticky header with mobile drawer. Needs focus-trap for a11y.", "u2", ["frontend", "a11y"], "high", "2026-09-05"),
    mkTask("b1", "in-progress", 1, "Set up design tokens", "CSS variables for colors, spacing and radii shared with the app.", "u2", ["frontend"], "medium"),
    mkTask("b1", "review", 0, "Pricing page copy", "New copy drafted by marketing — needs legal review.", "u1", ["content"], "medium"),
    mkTask("b1", "done", 0, "Kickoff meeting notes", "Notes and recording shared in the team drive.", "u1", [], "low"),
    mkTask("b1", "done", 1, "Competitor analysis", "Compared 6 competitor sites. Summary in Notion.", "u4", ["research"], "medium"),

    // ---- Mobile App v2 ----
    mkTask("b2", "todo", 0, "Offline mode spike", "Investigate SQLite vs. WatermelonDB for local cache.", "u3", ["spike"], "high", "2026-09-20"),
    mkTask("b2", "todo", 1, "Push notification service", "Evaluate FCM vs. OneSignal. Budget for vendor is $200/mo.", null, ["backend"], "medium"),
    mkTask("b2", "in-progress", 0, "Biometric login", "FaceID + fingerprint via native modules. Fallback to PIN.", "u3", ["security"], "high", "2026-09-08"),
    mkTask("b2", "review", 0, "Onboarding flow mockups", "3-screen carousel with progress dots.", "u4", ["design"], "medium"),
    mkTask("b2", "done", 0, "Crash reporting setup", "Sentry wired up for both platforms.", "u3", ["infra"], "low"),

    // ---- DevOps & Infra ----
    mkTask("b3", "todo", 0, "Migrate CI to GitHub Actions", "Currently on Jenkins. Need parity for all 12 pipelines.", "u3", ["infra"], "high", "2026-09-30"),
    mkTask("b3", "in-progress", 0, "Add staging environment", "Ephemeral preview envs per PR would be ideal.", "u3", ["infra"], "medium"),
    mkTask("b3", "done", 0, "Set up uptime monitoring", "BetterUptime with Slack alerts.", "u3", ["infra"], "low"),
];

export const comments: Comment[] = [
    { id: "c1", taskId: "t104", authorId: "u1", body: "Nice progress! Remember the drawer needs to close on Escape too.", createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "c2", taskId: "t104", authorId: "u2", body: "Good catch — adding it now.", createdAt: new Date(Date.now() - 1800000).toISOString() },
    { id: "c3", taskId: "t108", authorId: "u4", body: "Analysis is in Notion, ping me if you want the raw screenshots.", createdAt: new Date(Date.now() - 86400000).toISOString() },
];

export const activity: Activity[] = [
    { id: "a1", boardId: "b1", actorId: "u2", action: "moved", target: "Build responsive nav bar → In Progress", createdAt: new Date(Date.now() - 7200000).toISOString() },
    { id: "a2", boardId: "b1", actorId: "u4", action: "created", target: "Design new hero section", createdAt: new Date(Date.now() - 14400000).toISOString() },
    { id: "a3", boardId: "b1", actorId: "u1", action: "commented on", target: "Build responsive nav bar", createdAt: new Date(Date.now() - 3600000).toISOString() },
    { id: "a4", boardId: "b2", actorId: "u3", action: "completed", target: "Crash reporting setup", createdAt: new Date(Date.now() - 172800000).toISOString() },
    { id: "a5", boardId: "b3", actorId: "u3", action: "created", target: "Migrate CI to GitHub Actions", createdAt: new Date(Date.now() - 259200000).toISOString() },
];
