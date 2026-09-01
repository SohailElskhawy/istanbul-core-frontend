export type ColumnId = "todo" | "in-progress" | "review" | "done";

export interface User {
    id: string;
    name: string;
    avatarColor: string;
    initials: string;
    role: string;
}

export interface Comment {
    id: string;
    taskId: string;
    authorId: string;
    body: string;
    createdAt: string;
}

export interface Task {
    id: string;
    boardId: string;
    columnId: ColumnId;
    title: string;
    description: string;
    assigneeId: string | null;
    labels: string[];
    dueDate: string | null;
    priority: "low" | "medium" | "high";
    order: number;
    createdAt: string;
}

export interface Board {
    id: string;
    name: string;
    description: string;
    emoji: string;
    color: string;
    memberIds: string[];
}

export interface Activity {
    id: string;
    boardId: string;
    actorId: string;
    action: string;
    target: string;
    createdAt: string;
}

export interface BoardDetail {
    board: Board;
    tasks: Task[];
    comments: Comment[];
    activity: Activity[];
}
