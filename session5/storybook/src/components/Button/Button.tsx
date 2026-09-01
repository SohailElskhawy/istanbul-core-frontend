import type { ButtonHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

export type ButtonVariant = 'primary' | 'secondary' | 'danger';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  children,
  className = '',
  disabled = false,
  type = 'button',
  ...restProps
}: ButtonProps) {
  const combinedClassName = [
    styles.button,
    styles[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </button>
  );
}
