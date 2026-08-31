import React from "react";

export const Header: React.FC = () => {
  return (
    <header className="header-container" role="banner">
      <div className="header-top-strip">
        <div className="strip-left">
          <span className="live-dot" aria-hidden="true"></span>
          <span className="mono-tag">SESSION: LOCAL_ONLY</span>
          <span className="mono-tag-separator" aria-hidden="true">//</span>
          <span className="mono-tag">ZERO_PERSISTENCE</span>
          <span className="mono-tag-separator" aria-hidden="true">//</span>
          <span className="mono-tag">NO_BACKEND</span>
        </div>
        <div className="strip-right">
          <span className="mono-tag">ENGINE: REACT 19 + ZOD 4</span>
        </div>
      </div>

      <div className="header-main">
        <div className="header-title-block">
          <div className="header-badge-row">
            <span className="brutal-badge badge-violet">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
              </svg>
              CLIENT WORKSPACE
            </span>
            <span className="brutal-badge badge-yellow">BRUTALIST V1.0</span>
          </div>
          <h1 className="header-title">EVENT FORGE</h1>
          <p className="header-subtitle">
            Create, validate, and simulate mock events with React Hook Form and Zod.
          </p>
        </div>

        <div className="header-spec-box" aria-label="System Constraints">
          <div className="spec-item">
            <span className="spec-label">RUNTIME</span>
            <span className="spec-value">BROWSER-ONLY</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">PERSISTENCE</span>
            <span className="spec-value">EPHEMERAL</span>
          </div>
          <div className="spec-item">
            <span className="spec-label">VALIDATION</span>
            <span className="spec-value">STRICT ZOD</span>
          </div>
        </div>
      </div>
    </header>
  );
};
