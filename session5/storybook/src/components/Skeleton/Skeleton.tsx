import styles from './Skeleton.module.css';

export interface SkeletonProps {
  count?: number;
}

export function Skeleton({ count = 8 }: SkeletonProps) {
  return (
    <div className={styles.grid} aria-busy="true" aria-label="Loading gallery items">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={styles.card}>
          <div className={styles.imagePlaceholder} />
          <div className={styles.content}>
            <div className={styles.badgePlaceholder} />
            <div className={styles.titlePlaceholder} />
          </div>
        </div>
      ))}
    </div>
  );
}
