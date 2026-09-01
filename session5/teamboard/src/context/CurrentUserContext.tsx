import { useMemo, useState } from "react";
import type { User } from "../types";
import { users } from "../data/mockData";
import { CurrentUserContext } from "./currentUserContext";

export function CurrentUserProvider({ children }: { children: React.ReactNode }) {
    const [currentUser, setCurrentUser] = useState<User>(users[0]);
    const value = useMemo(() => ({ currentUser, setCurrentUser }), [currentUser]);
    return <CurrentUserContext.Provider value={value}>{children}</CurrentUserContext.Provider>;
}
