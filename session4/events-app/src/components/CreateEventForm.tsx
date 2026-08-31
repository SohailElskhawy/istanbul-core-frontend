import React, { useRef, useState, useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventSchema } from "../schemas/create-event.schema";
import type {
  CreateEventFormData,
  CreatedMockEvent,
} from "../schemas/create-event.schema";
import { EVENT_CATEGORIES } from "../data/event-categories";

let eventCounter = 1000;
const generateEventId = () => {
  eventCounter += 1;
  return `EVT-${eventCounter}`;
};

interface CreateEventFormProps {
  onEventCreated: (event: CreatedMockEvent) => void;
  formRef?: React.MutableRefObject<{
    fillSample: (sample: Partial<CreateEventFormData>) => void;
    resetForm: () => void;
  } | null>;
  onFormChange?: (values: Partial<CreateEventFormData>) => void;
}

export const CreateEventForm: React.FC<CreateEventFormProps> = ({
  onEventCreated,
  formRef,
  onFormChange,
}) => {
  const [isSubmittingSimulated, setIsSubmittingSimulated] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, submitCount, isDirty },
  } = useForm<CreateEventFormData>({
    resolver: zodResolver(createEventSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      email: "",
      category: undefined,
      eventDate: "",
      description: "",
    },
  });

  const watchedValues = useWatch({ control });

  useEffect(() => {
    if (onFormChange) {
      onFormChange(watchedValues);
    }
  }, [watchedValues, onFormChange]);

  // Expose fill and reset methods to parent ref
  useEffect(() => {
    if (formRef) {
      formRef.current = {
        fillSample: (sample) => {
          if (sample.title !== undefined) setValue("title", sample.title, { shouldValidate: true, shouldDirty: true });
          if (sample.email !== undefined) setValue("email", sample.email, { shouldValidate: true, shouldDirty: true });
          if (sample.category !== undefined) setValue("category", sample.category, { shouldValidate: true, shouldDirty: true });
          if (sample.eventDate !== undefined) setValue("eventDate", sample.eventDate, { shouldValidate: true, shouldDirty: true });
          if (sample.description !== undefined) setValue("description", sample.description, { shouldValidate: true, shouldDirty: true });
        },
        resetForm: () => {
          reset();
        },
      };
    }
  }, [formRef, setValue, reset]);

  // Focus error summary when submission fails with errors
  useEffect(() => {
    if (submitCount > 0 && Object.keys(errors).length > 0) {
      errorSummaryRef.current?.focus();
    }
  }, [submitCount, errors]);

  const onSubmit = async (data: CreateEventFormData) => {
    setIsSubmittingSimulated(true);

    // Simulate short network delay for realistic frontend UX
    await new Promise((resolve) => setTimeout(resolve, 400));

    const newEvent: CreatedMockEvent = {
      id: generateEventId(),
      title: data.title,
      email: data.email,
      category: data.category,
      eventDate: data.eventDate,
      description: data.description,
      createdAt: new Date().toISOString(),
    };

    // Log submitted object for demonstration as requested
    console.log("Mock event created:", newEvent);

    onEventCreated(newEvent);
    reset({
      title: "",
      email: "",
      category: undefined,
      eventDate: "",
      description: "",
    });
    setIsSubmittingSimulated(false);
  };

  const handleResetClick = () => {
    reset();
  };

  const errorKeys = Object.keys(errors) as (keyof CreateEventFormData)[];
  const descLength = (watchedValues.description || "").length;
  const titleLength = (watchedValues.title || "").length;

  return (
    <div className="form-container brutal-card">
      <div className="card-header-bar bar-orange">
        <div className="card-header-flex">
          <h2 className="card-header-title">FORGE A NEW EVENT</h2>
          <span className="brutal-badge badge-white">
            {isDirty ? "UNSAVED CHANGES" : "FORM PRISTINE"}
          </span>
        </div>
      </div>

      <div className="form-body-wrapper">
        {/* Focusable Accessible Error Summary */}
        {errorKeys.length > 0 && submitCount > 0 && (
          <div
            ref={errorSummaryRef}
            tabIndex={-1}
            role="alert"
            aria-labelledby="error-summary-title"
            className="error-summary brutal-card"
          >
            <div className="error-summary-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <h3 id="error-summary-title" className="error-summary-title">
                {errorKeys.length} {errorKeys.length === 1 ? "ERROR" : "ERRORS"} DETECTED
              </h3>
            </div>
            <p className="error-summary-desc">
              Please resolve the following issues before forging your event:
            </p>
            <ul className="error-summary-list">
              {errorKeys.map((key) => {
                const message = errors[key]?.message;
                return (
                  <li key={key}>
                    <a
                      href={`#${key}`}
                      className="error-summary-link"
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById(key);
                        el?.focus();
                        el?.scrollIntoView({ behavior: "smooth", block: "center" });
                      }}
                    >
                      <strong>{key.toUpperCase()}:</strong> {message}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="create-event-form">
          {/* FIELD 1: TITLE */}
          <div className="brutal-input-group">
            <div className="brutal-label">
              <label htmlFor="title">
                EVENT TITLE <span className="required-indicator" aria-hidden="true">*</span>
              </label>
              <span className="char-meter font-mono" aria-hidden="true">
                {titleLength} / 3 min
              </span>
            </div>
            <input
              id="title"
              type="text"
              className="brutal-input"
              placeholder="e.g. React Istanbul Meetup"
              aria-required="true"
              aria-invalid={!!errors.title}
              aria-describedby={`${errors.title ? "title-error" : ""} title-hint`.trim()}
              {...register("title")}
            />
            <span id="title-hint" className="brutal-helper-text">
              Must be at least 3 characters long.
            </span>
            {errors.title && (
              <p id="title-error" role="alert" className="brutal-error-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errors.title.message}
              </p>
            )}
          </div>

          {/* FIELD 2: EMAIL */}
          <div className="brutal-input-group">
            <div className="brutal-label">
              <label htmlFor="email">
                ORGANIZER EMAIL <span className="required-indicator" aria-hidden="true">*</span>
              </label>
              <span className="font-mono text-xs text-muted" aria-hidden="true">
                RFC-5322
              </span>
            </div>
            <input
              id="email"
              type="email"
              className="brutal-input"
              placeholder="e.g. organizer@example.com"
              aria-required="true"
              aria-invalid={!!errors.email}
              aria-describedby={`${errors.email ? "email-error" : ""} email-hint`.trim()}
              {...register("email")}
            />
            <span id="email-hint" className="brutal-helper-text">
              Enter a valid email address for event coordination.
            </span>
            {errors.email && (
              <p id="email-error" role="alert" className="brutal-error-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errors.email.message}
              </p>
            )}
          </div>

          {/* FIELD 3: CATEGORY */}
          <div className="brutal-input-group">
            <div className="brutal-label">
              <label htmlFor="category">
                EVENT CATEGORY <span className="required-indicator" aria-hidden="true">*</span>
              </label>
              <span className="font-mono text-xs text-muted" aria-hidden="true">
                LOCAL MOCK ENUM
              </span>
            </div>
            <select
              id="category"
              className="brutal-select"
              aria-required="true"
              aria-invalid={!!errors.category}
              aria-describedby={`${errors.category ? "category-error" : ""} category-hint`.trim()}
              {...register("category")}
            >
              <option value="">-- SELECT A CATEGORY --</option>
              {EVENT_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label} ({cat.value})
                </option>
              ))}
            </select>
            <span id="category-hint" className="brutal-helper-text">
              Select the primary archetype that fits your event.
            </span>
            {errors.category && (
              <p id="category-error" role="alert" className="brutal-error-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errors.category.message}
              </p>
            )}
          </div>

          {/* FIELD 4: EVENT DATE */}
          <div className="brutal-input-group">
            <div className="brutal-label">
              <label htmlFor="eventDate">
                EVENT DATE <span className="required-indicator" aria-hidden="true">*</span>
              </label>
              <span className="font-mono text-xs text-muted" aria-hidden="true">
                YYYY-MM-DD
              </span>
            </div>
            <input
              id="eventDate"
              type="date"
              className="brutal-input"
              aria-required="true"
              aria-invalid={!!errors.eventDate}
              aria-describedby={`${errors.eventDate ? "eventDate-error" : ""} eventDate-hint`.trim()}
              {...register("eventDate")}
            />
            <span id="eventDate-hint" className="brutal-helper-text">
              Select the planned calendar date for this gathering.
            </span>
            {errors.eventDate && (
              <p id="eventDate-error" role="alert" className="brutal-error-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errors.eventDate.message}
              </p>
            )}
          </div>

          {/* FIELD 5: DESCRIPTION */}
          <div className="brutal-input-group">
            <div className="brutal-label">
              <label htmlFor="description">
                EVENT DESCRIPTION <span className="required-indicator" aria-hidden="true">*</span>
              </label>
              <span
                className={`char-meter font-mono ${descLength >= 10 ? "text-success" : "text-pending"}`}
                aria-live="polite"
              >
                {descLength} / 10 min chars
              </span>
            </div>
            <textarea
              id="description"
              rows={4}
              className="brutal-textarea"
              placeholder="e.g. A meetup for React developers in Istanbul to explore state management, UI architectures, and modern patterns."
              aria-required="true"
              aria-invalid={!!errors.description}
              aria-describedby={`${errors.description ? "description-error" : ""} description-hint`.trim()}
              {...register("description")}
            ></textarea>
            <div className="desc-meter-bar">
              <div
                className="desc-meter-fill"
                style={{ width: `${Math.min(100, (descLength / 10) * 100)}%` }}
                aria-hidden="true"
              ></div>
            </div>
            <span id="description-hint" className="brutal-helper-text">
              Minimum 10 characters required. Provide an engaging summary.
            </span>
            {errors.description && (
              <p id="description-error" role="alert" className="brutal-error-text">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                  <polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"></polygon>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                {errors.description.message}
              </p>
            )}
          </div>

          {/* FORM ACTIONS */}
          <div className="form-action-bar">
            <button
              type="submit"
              disabled={isSubmittingSimulated}
              className="brutal-button-primary btn-forge"
              aria-label="Forge event locally"
            >
              {isSubmittingSimulated ? (
                <>
                  <svg className="spinner-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                    <line x1="12" y1="2" x2="12" y2="6"></line>
                    <line x1="12" y1="18" x2="12" y2="22"></line>
                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                    <line x1="2" y1="12" x2="6" y2="12"></line>
                    <line x1="18" y1="12" x2="22" y2="12"></line>
                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
                  </svg>
                  FORGING EVENT...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
                  </svg>
                  FORGE EVENT [SUBMIT]
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetClick}
              disabled={isSubmittingSimulated}
              className="brutal-button-secondary"
              aria-label="Reset all form fields"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <polyline points="1 4 1 10 7 10"></polyline>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              </svg>
              RESET
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
