import React from "react";
import type { CreateEventFormData } from "../schemas/create-event.schema";

interface InformationBoardProps {
  watchedValues: Partial<CreateEventFormData>;
  onFillSample: () => void;
  onFillInvalidSample: () => void;
  createdCount: number;
}

export const InformationBoard: React.FC<InformationBoardProps> = ({
  watchedValues,
  onFillSample,
  onFillInvalidSample,
  createdCount,
}) => {
  const title = (watchedValues.title || "").trim();
  const email = (watchedValues.email || "").trim();
  const category = watchedValues.category || "";
  const eventDate = watchedValues.eventDate || "";
  const description = (watchedValues.description || "").trim();

  // Simple email regex for visual checklist indicator
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const checks = [
    {
      id: "check-title",
      label: "Title min 3 chars",
      current: `${title.length} chars`,
      isMet: title.length >= 3,
    },
    {
      id: "check-email",
      label: "Valid email address",
      current: email ? (isEmailValid ? "valid" : "invalid") : "empty",
      isMet: isEmailValid,
    },
    {
      id: "check-category",
      label: "Category chosen",
      current: category || "none",
      isMet: Boolean(category),
    },
    {
      id: "check-date",
      label: "Event date set",
      current: eventDate || "none",
      isMet: Boolean(eventDate),
    },
    {
      id: "check-desc",
      label: "Description min 10 chars",
      current: `${description.length}/10`,
      isMet: description.length >= 10,
    },
  ];

  const metCount = checks.filter((c) => c.isMet).length;
  const isReady = metCount === checks.length;

  return (
    <aside className="info-board brutal-card" aria-label="Event Forge Rules and Live Matrix">
      <div className="card-header-bar bar-purple">
        <h2 className="card-header-title">VALIDATION MATRIX</h2>
        <span className="brutal-badge badge-white">
          {metCount} / {checks.length} MET
        </span>
      </div>

      <div className="info-board-body">
        <p className="info-intro">
          Zod schema validation actively monitors each field on blur and submission.
        </p>

        <ul className="live-checklist" aria-label="Real-time validation criteria">
          {checks.map((check) => (
            <li
              key={check.id}
              className={`checklist-item ${check.isMet ? "met" : "unmet"}`}
            >
              <span className="check-icon-box" aria-hidden="true">
                {check.isMet ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                )}
              </span>
              <div className="check-text">
                <span className="check-label">{check.label}</span>
                <span className="check-detail">[{check.current}]</span>
              </div>
            </li>
          ))}
        </ul>

        <div className="matrix-status-banner">
          <div className={`status-pill ${isReady ? "ready" : "pending"}`}>
            <span className="pill-dot"></span>
            <span>{isReady ? "STATUS: READY TO FORGE" : "STATUS: CRITERIA PENDING"}</span>
          </div>
        </div>

        <div className="quick-actions-box">
          <span className="quick-actions-label">QUICK TEST PRESETS</span>
          <div className="quick-actions-buttons">
            <button
              type="button"
              className="brutal-button-yellow"
              onClick={onFillSample}
              aria-label="Fill valid sample event data into form"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              FILL VALID SAMPLE
            </button>
            <button
              type="button"
              className="brutal-button-secondary btn-compact"
              onClick={onFillInvalidSample}
              aria-label="Fill invalid sample data into form to test validation errors"
            >
              FILL INVALID SAMPLE
            </button>
          </div>
        </div>

        <div className="session-counter-box">
          <div className="counter-item">
            <span className="counter-num">{createdCount}</span>
            <span className="counter-text">MOCK EVENTS CREATED THIS SESSION</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
