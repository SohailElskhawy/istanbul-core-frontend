export const TaskSkeleton: React.FC = () => {
  return (
    <div className="skeleton-list" aria-label="Loading task items" aria-busy="true">
      <div className="skeleton-card" />
      <div className="skeleton-card" />
      <div className="skeleton-card" />
      <div className="skeleton-card" />
    </div>
  );
};