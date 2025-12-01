import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import './Button.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon,
      iconPosition = 'left',
      loading = false,
      fullWidth = false,
      className = '',
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'ui-button';
    const variantClass = `ui-button--${variant}`;
    const sizeClass = `ui-button--${size}`;
    const fullWidthClass = fullWidth ? 'ui-button--full-width' : '';
    const loadingClass = loading ? 'ui-button--loading' : '';
    const disabledClass = disabled || loading ? 'ui-button--disabled' : '';

    const classes = [
      baseClasses,
      variantClass,
      sizeClass,
      fullWidthClass,
      loadingClass,
      disabledClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="ui-button__spinner" aria-label="Loading">
            <svg className="ui-button__spinner-icon" viewBox="0 0 24 24">
              <circle
                className="ui-button__spinner-circle"
                cx="12"
                cy="12"
                r="10"
                fill="none"
                strokeWidth="3"
              />
            </svg>
          </span>
        )}
        {!loading && icon && iconPosition === 'left' && (
          <span className="ui-button__icon ui-button__icon--left">{icon}</span>
        )}
        <span className="ui-button__content">{children}</span>
        {!loading && icon && iconPosition === 'right' && (
          <span className="ui-button__icon ui-button__icon--right">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
