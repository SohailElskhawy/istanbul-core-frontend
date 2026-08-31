import React, { useState } from "react";
import type { CreatedMockEvent } from "../schemas/create-event.schema";
import { EVENT_CATEGORIES } from "../data/event-categories";

interface EventCardProps {
  event: CreatedMockEvent;
  isLatest?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, isLatest = false }) => {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);

  const categoryObj = EVENT_CATEGORIES.find((c) => c.value === event.category);
  const categoryLabel = categoryObj ? categoryObj.label : event.category;

  const handleCopyJson = () => {
    const rawData = {
      title: event.title,
      email: event.email,
      category: event.category,
      eventDate: event.eventDate,
      description: event.description,
    };
    navigator.clipboard.writeText(JSON.stringify(rawData, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <article className={`event-card brutal-card ${isLatest ? "latest-event" : ""}`}>
      {isLatest && (
        <div className="latest-tag" aria-label="Newly forged event">
          JUST FORGED
        </div>
      )}

      <div className="event-card-header">
        <div className="event-card-badges">
          <span className="brutal-badge badge-category">
            {categoryLabel}
          </span>
          <span className="brutal-badge badge-date">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="0" ry="0"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            {event.eventDate}
          </span>
        </div>
        <span className="event-id-tag">#{event.id}</span>
      </div>

      <div className="event-card-body">
        <h3 className="event-card-title">{event.title}</h3>

        <div className="event-card-meta">
          <div className="meta-row">
            <span className="meta-label">ORGANIZER:</span>
            <span className="meta-value font-mono">{event.email}</span>
          </div>
          <div className="meta-row">
            <span className="meta-label">CREATED:</span>
            <span className="meta-value font-mono">{new Date(event.createdAt).toLocaleTimeString()}</span>
          </div>
        </div>

        <p className="event-card-desc">{event.description}</p>
      </div>

      <div className="event-card-footer">
        <button
          type="button"
          className="brutal-button-secondary btn-mini"
          onClick={() => setShowJson(!showJson)}
          aria-expanded={showJson}
          aria-controls={`payload-${event.id}`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          {showJson ? "HIDE JSON PAYLOAD" : "INSPECT OBJECT"}
        </button>

        {showJson && (
          <button
            type="button"
            className="brutal-button-yellow btn-mini"
            onClick={handleCopyJson}
            aria-label="Copy mock event JSON payload"
          >
            {copied ? "✓ COPIED!" : "COPY RAW JSON"}
          </button>
        )}
      </div>

      {showJson && (
        <div id={`payload-${event.id}`} className="event-payload-viewer">
          <pre className="payload-code">
            <code>
              {JSON.stringify(
                {
                  title: event.title,
                  email: event.email,
                  category: event.category,
                  eventDate: event.eventDate,
                  description: event.description,
                },
                null,
                2
              )}
            </code>
          </pre>
        </div>
      )}
    </article>
  );
};
