interface TaskSummaryProps {
  total: number;
  completed: number;
  remaining: number;
}

export function TaskSummary({ total, completed, remaining }: TaskSummaryProps) {
  return (
    <section className="task-summary" aria-label="Task Summary Statistics">
      <div className="summary-card total">
        <span className="summary-label">Total Tasks</span>
        <span className="summary-value">{total}</span>
      </div>

      <div className="summary-card completed">
        <span className="summary-label">Completed</span>
        <span className="summary-value">{completed}</span>
      </div>

      <div className="summary-card remaining">
        <span className="summary-label">Remaining</span>
        <span className="summary-value">{remaining}</span>
      </div>
    </section>
  );
}