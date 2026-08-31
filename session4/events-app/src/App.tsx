import { useState, useRef, useCallback } from "react";
import { Header } from "./components/Header";
import { InformationBoard } from "./components/InformationBoard";
import { CreateEventForm } from "./components/CreateEventForm";
import { EventCard } from "./components/EventCard";
import { SuccessBanner } from "./components/SuccessBanner";
import type {
  CreatedMockEvent,
  CreateEventFormData,
} from "./schemas/create-event.schema";
import "./App.css";

export function App() {
  const [createdEvents, setCreatedEvents] = useState<CreatedMockEvent[]>([]);
  const [latestEvent, setLatestEvent] = useState<CreatedMockEvent | null>(null);
  const [watchedValues, setWatchedValues] = useState<Partial<CreateEventFormData>>({});

  const formRef = useRef<{
    fillSample: (sample: Partial<CreateEventFormData>) => void;
    resetForm: () => void;
  } | null>(null);

  const handleEventCreated = (event: CreatedMockEvent) => {
    setCreatedEvents((prev) => [event, ...prev]);
    setLatestEvent(event);
  };

  const handleFormChange = useCallback((values: Partial<CreateEventFormData>) => {
    setWatchedValues(values);
  }, []);

  const handleFillSample = () => {
    formRef.current?.fillSample({
      title: "React Istanbul Meetup",
      email: "organizer@example.com",
      category: "meetup",
      eventDate: "2026-09-15",
      description:
        "A meetup for React developers in Istanbul to explore state management, UI architectures, and modern patterns.",
    });
  };

  const handleFillInvalidSample = () => {
    formRef.current?.fillSample({
      title: "ab",
      email: "invalid-email-address",
      category: undefined,
      eventDate: "",
      description: "too short",
    });
  };

  const handleDismissSuccess = () => {
    setLatestEvent(null);
  };

  const handleClearSessionLedger = () => {
    setCreatedEvents([]);
    setLatestEvent(null);
  };

  return (
    <div className="app-viewport">
      {/* Top Banner / Masthead */}
      <Header />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1}>
        {/* Success Banner (announced via aria-live) */}
        {latestEvent && (
          <section aria-label="Event Creation Status" style={{ marginBottom: "24px" }}>
            <SuccessBanner
              event={latestEvent}
              onDismiss={handleDismissSuccess}
            />
          </section>
        )}

        {/* 2-Column Workspace Grid */}
        <div className="workspace-grid">
          {/* Left Column: Rules & Live Validation Matrix */}
          <InformationBoard
            watchedValues={watchedValues}
            onFillSample={handleFillSample}
            onFillInvalidSample={handleFillInvalidSample}
            createdCount={createdEvents.length}
          />

          {/* Right Column: The Create Event Form */}
          <CreateEventForm
            onEventCreated={handleEventCreated}
            formRef={formRef}
            onFormChange={handleFormChange}
          />
        </div>

        {/* In-Session Events Ledger */}
        <section className="ledger-section" style={{ marginTop: "36px" }} aria-labelledby="ledger-title">
          <div className="ledger-header-row">
            <h2 id="ledger-title" className="ledger-heading">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <rect x="2" y="3" width="20" height="14" rx="0"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              IN-SESSION EVENT LEDGER
              <span className="brutal-badge badge-violet">
                {createdEvents.length} {createdEvents.length === 1 ? "EVENT" : "EVENTS"}
              </span>
            </h2>

            {createdEvents.length > 0 && (
              <button
                type="button"
                onClick={handleClearSessionLedger}
                className="brutal-button-secondary btn-compact"
                aria-label="Clear all events created in current session"
              >
                CLEAR SESSION LEDGER
              </button>
            )}
          </div>

          {createdEvents.length === 0 ? (
            <div className="empty-ledger brutal-card">
              <div className="empty-icon" aria-hidden="true">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="12" y1="18" x2="12" y2="12"></line>
                  <line x1="9" y1="15" x2="15" y2="15"></line>
                </svg>
              </div>
              <h3 className="empty-title">NO EVENTS FORGED YET</h3>
              <p className="empty-desc">
                Fill out the form above to forge your first mock event. All data is managed locally in frontend memory.
              </p>
              <button
                type="button"
                className="brutal-button-yellow btn-compact"
                onClick={handleFillSample}
              >
                TRY WITH SAMPLE DATA
              </button>
            </div>
          ) : (
            <div className="ledger-grid">
              {createdEvents.map((evt, idx) => (
                <EventCard
                  key={evt.id}
                  event={evt}
                  isLatest={idx === 0 && latestEvent?.id === evt.id}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="brutal-footer" role="contentinfo">
        <div>
          <strong>EVENT FORGE</strong> // FRONTEND-ONLY ARCHITECTURE (ZERO BACKEND / ZERO PERSISTENCE)
        </div>
        <div>
          VALIDATION: ZOD // STATE: REACT HOOK FORM // DESIGN: BRUTALISM
        </div>
      </footer>
    </div>
  );
}

export default App;
