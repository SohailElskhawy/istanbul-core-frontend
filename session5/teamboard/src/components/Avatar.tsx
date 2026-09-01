import type { User } from "../types";

export function Avatar({ user, size }: { user: User; size?: number }) {
    return (
        <span
            className="avatar"
            title={`${user.name} · ${user.role}`}
            style={{ background: user.avatarColor, width: size ?? 28, height: size ?? 28 }}
        >
            {user.initials}
        </span>
    );
}

export function AvatarStack({ members }: { members: User[] }) {
    return (
        <span className="avatar-stack">
            {members.map((m) => (
                <Avatar key={m.id} user={m} />
            ))}
        </span>
    );
}
