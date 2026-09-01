import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './FilterButton.module.css';

export interface FilterButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean;
  children: ReactNode;
  count?: number;
}

export function FilterButton({
  active,
  children,
  count,
  className = '',
  disabled = false,
  type = 'button',
  ...restProps
}: FilterButtonProps) {
  const combinedClassName = [
    styles.filterButton,
    active ? styles.active : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={combinedClassName}
      aria-pressed={active}
      disabled={disabled}
      {...restProps}
    >
      {active && <span className={styles.activeIndicator} aria-hidden="true" />}
      <span>{children}</span>
      {typeof count === 'number' && (
        <span className={styles.countBadge} aria-label={`${count} items`}>
          {count}
        </span>
      )}
    </button>
  );
}
