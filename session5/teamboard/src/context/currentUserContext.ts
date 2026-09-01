import { createContext, useContext } from "react";
import type { User } from "../types";

export interface CurrentUserContextValue {
    currentUser: User;
    setCurrentUser: (user: User) => void;
}

/**
 * CONTEXT layer: the "signed in" user is needed across the whole app
 * (avatars, comments, command palette) but never changes per-component.
 * In a real app this would come from auth — here it's mock data with a
 * switcher so you can see different identities in the UI.
 */
export const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

export function useCurrentUser() {
    const ctx = useContext(CurrentUserContext);
    if (!ctx) throw new Error("useCurrentUser must be used inside CurrentUserProvider");
    return ctx;
}
