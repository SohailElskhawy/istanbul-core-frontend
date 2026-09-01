import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LayoutGrid as BoardIcon, Moon, Plus, Sun } from "lucide-react";
import type { BoardDetail } from "../types";
import { useBoards, queryKeys } from "../hooks/useBoard";
import { useUiStore } from "../store/uiStore";
import { useTheme } from "../context/themeContext";

interface Command {
  id: string;
  section: string;
  label: string;
  icon: React.ReactNode;
  run: () => void;
}

interface CommandPaletteProps {
  onOpenBoard: (boardId: string) => void;
}

/**
 * ZUSTAND-powered global feature: opened via Ctrl+K from anywhere
 * (Header button, keyboard shortcut), needs data from multiple queries,
 * and triggers navigation + theme + actions — none of which belong to
 * any single component. This is the "many unrelated parts need complex
 * client state" case.
 */
export function CommandPalette({ onOpenBoard }: CommandPaletteProps) {
  const { paletteOpen, closePalette, toggleSidebar, pushToast } = useUiStore();
  const { theme, toggleTheme } = useTheme();
  const { data: boards } = useBoards();
  const queryClient = useQueryClient();

  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset search state each time the palette opens (adjust state during
  // render instead of an effect — avoids cascading renders)
  const [lastOpen, setLastOpen] = useState(paletteOpen);
  if (lastOpen !== paletteOpen) {
    setLastOpen(paletteOpen);
    if (paletteOpen) {
      setQuery("");
      setActiveIndex(0);
    }
  }

  // Global keyboard shortcut — registered once, works anywhere
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        useUiStore.getState().togglePalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Search tasks across ALL boards using only the query cache (no fetches)
  const taskHits = useMemo(() => {
    if (!boards || query.trim().length < 2) return [];
    const q = query.toLowerCase();
    return boards.flatMap((b) => {
      const cached = queryClient.getQueryData<BoardDetail>(queryKeys.board(b.id));
      return (cached?.tasks ?? [])
        .filter((t) => t.title.toLowerCase().includes(q))
        .slice(0, 4)
        .map((t) => ({ boardId: b.id, boardName: b.name, taskId: t.id, title: t.title }));
    });
  }, [boards, query, queryClient]);

  const commands: Command[] = useMemo(
    () => [
      {
        id: "toggle-theme",
        section: "Actions",
        label: theme === "dark" ? "Switch to light theme" : "Switch to dark theme",
        icon: theme === "dark" ? <Sun size={16} /> : <Moon size={16} />,
        run: toggleTheme,
      },
      {
        id: "toggle-sidebar",
        section: "Actions",
        label: "Toggle sidebar",
        icon: <BoardIcon size={16} />,
        run: toggleSidebar,
      },
      {
        id: "new-task-hint",
        section: "Actions",
        label: "New task — use the “Add task” button on any column",
        icon: <Plus size={16} />,
        run: () => pushToast("Open a board, then click “Add task” on a column", "info"),
      },
      ...(boards ?? []).map((b) => ({
        id: `board-${b.id}`,
        section: "Boards",
        label: `${b.emoji}  ${b.name}`,
        icon: <BoardIcon size={16} />,
        run: () => onOpenBoard(b.id),
      })),
    ],
    [theme, boards, toggleTheme, toggleSidebar, onOpenBoard, pushToast],
  );

  const filtered = commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase()));
  const sections = [...new Set(filtered.map((c) => c.section))];

  if (!paletteOpen) return null;

  function runCommand(cmd: Command | undefined) {
    if (!cmd) return;
    closePalette();
    cmd.run();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") closePalette();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      runCommand(filtered[activeIndex]);
    }
  }

  let flatIndex = -1;

  return (
    <div className="palette-overlay" onClick={closePalette}>
      <div className="palette" onClick={(e) => e.stopPropagation()} onKeyDown={onKeyDown}>
        <input
          autoFocus
          className="palette-input"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(0);
          }}
          placeholder="Type a command or search tasks…"
        />

        <div className="palette-list">
          {taskHits.length > 0 && (
            <>
              <div className="palette-section">Tasks</div>
              {taskHits.map((hit) => (
                <button
                  key={hit.taskId}
                  className="palette-item"
                  onClick={() => {
                    closePalette();
                    onOpenBoard(hit.boardId);
                    pushToast(`Opening "${hit.title}" on ${hit.boardName}`, "info");
                  }}
                >
                  🔍 {hit.title}
                  <span className="kbd">{hit.boardName}</span>
                </button>
              ))}
            </>
          )}

          {filtered.length === 0 && taskHits.length === 0 ? (
            <div className="palette-empty">No results for “{query}”</div>
          ) : (
            sections.map((section) => (
              <div key={section}>
                <div className="palette-section">{section}</div>
                {filtered
                  .filter((c) => c.section === section)
                  .map((cmd) => {
                    flatIndex += 1;
                    const isActive = flatIndex === activeIndex;
                    return (
                      <button
                        key={cmd.id}
                        className={`palette-item ${isActive ? "active" : ""}`}
                        onClick={() => runCommand(cmd)}
                        onMouseEnter={() => setActiveIndex(filtered.indexOf(cmd))}
                      >
                        {cmd.icon}
                        {cmd.label}
                      </button>
                    );
                  })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
