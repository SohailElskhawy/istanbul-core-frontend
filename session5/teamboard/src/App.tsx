import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { CurrentUserProvider } from "./context/CurrentUserContext";
import { AppShell } from "./components/AppShell";
import { BoardsIndex } from "./components/pages/BoardsIndex";
import { BoardPage } from "./components/pages/BoardPage";
import { boards } from "./data/mockData";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

/**
 * Simple view switching instead of a router — the MVP focuses on state
 * management, not routing. `currentBoardId` is the only "URL" we need.
 */
export default function App() {
  const [currentBoardId, setCurrentBoardId] = useState<string | null>(null);
  const boardName = boards.find((b) => b.id === currentBoardId)?.name;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CurrentUserProvider>
          <AppShell
            title={boardName ?? "TeamBoard"}
            currentBoardId={currentBoardId}
            onOpenBoard={setCurrentBoardId}
            onGoHome={() => setCurrentBoardId(null)}
          >
            {currentBoardId ? (
              <BoardPage boardId={currentBoardId} />
            ) : (
              <BoardsIndex onOpenBoard={setCurrentBoardId} />
            )}
          </AppShell>
        </CurrentUserProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
