import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import './Card.css';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'gradient' | 'glass' | 'elevated';
  hoverable?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  children: ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'default',
      hoverable = false,
      interactive = false,
      padding = 'md',
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses = 'ui-card';
    const variantClass = `ui-card--${variant}`;
    const hoverClass = hoverable || interactive ? 'ui-card--hoverable' : '';
    const interactiveClass = interactive ? 'ui-card--interactive' : '';
    const paddingClass = `ui-card--padding-${padding}`;

    const classes = [
      baseClasses,
      variantClass,
      hoverClass,
      interactiveClass,
      paddingClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardHeader = ({ className = '', children, ...props }: CardHeaderProps) => {
  return (
    <div className={`ui-card__header ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardBody = ({ className = '', children, ...props }: CardBodyProps) => {
  return (
    <div className={`ui-card__body ${className}`} {...props}>
      {children}
    </div>
  );
};

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export const CardFooter = ({ className = '', children, ...props }: CardFooterProps) => {
  return (
    <div className={`ui-card__footer ${className}`} {...props}>
      {children}
    </div>
  );
};
