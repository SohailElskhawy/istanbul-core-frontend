import type { ReactNode } from 'react';
import styles from './ImageGrid.module.css';

export interface ImageGridProps {
  children: ReactNode;
  className?: string;
}

export function ImageGrid({ children, className = '' }: ImageGridProps) {
  const combinedClassName = [styles.grid, className].filter(Boolean).join(' ');

  return <div className={combinedClassName}>{children}</div>;
}
