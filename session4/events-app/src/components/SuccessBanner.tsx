import React from "react";
import type { CreatedMockEvent } from "../schemas/create-event.schema";

interface SuccessBannerProps {
  event: CreatedMockEvent;
  onDismiss: () => void;
}

export const SuccessBanner: React.FC<SuccessBannerProps> = ({ event, onDismiss }) => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="success-banner brutal-card"
    >
      <div className="success-banner-left">
        <div className="success-icon-box" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </div>
        <div className="success-text-content">
          <span className="success-heading">EVENT CREATED SUCCESSFULLY!</span>
          <p className="success-detail">
            Mock event <strong className="font-mono">"{event.title}"</strong> has been forged in local frontend state.
          </p>
        </div>
      </div>

      <div className="success-banner-right">
        <button
          type="button"
          className="brutal-button-secondary btn-compact"
          onClick={onDismiss}
          aria-label="Dismiss success notification"
        >
          DISMISS
        </button>
      </div>
    </div>
  );
};
