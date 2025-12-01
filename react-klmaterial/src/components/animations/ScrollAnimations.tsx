import { useRef, useEffect, Children } from 'react';
import { useScrollAnimation } from '../../hooks/useIntersectionObserver';
import './ScrollAnimations.css';

export interface ScrollAnimateProps {
  children: React.ReactNode;
  animation?:
    | 'fadeIn'
    | 'slideUp'
    | 'slideDown'
    | 'slideLeft'
    | 'slideRight'
    | 'zoomIn'
    | 'zoomOut'
    | 'rotateIn'
    | 'flipIn';
  delay?: number;
  duration?: number;
  threshold?: number;
  className?: string;
}

export const ScrollAnimate = ({
  children,
  animation = 'fadeIn',
  delay = 0,
  duration = 0.8,
  threshold = 0.1,
  className = '',
}: ScrollAnimateProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(ref, threshold);

  useEffect(() => {
    if (ref.current && isVisible) {
      ref.current.style.animationDelay = `${delay}s`;
      ref.current.style.animationDuration = `${duration}s`;
    }
  }, [isVisible, delay, duration]);

  return (
    <div
      ref={ref}
      className={`scroll-animate ${
        isVisible ? `scroll-animate--${animation} scroll-animate--visible` : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};

// Stagger children animations
export interface ScrollAnimateGroupProps {
  children: React.ReactNode;
  animation?: ScrollAnimateProps['animation'];
  stagger?: number;
  className?: string;
}

export const ScrollAnimateGroup = ({
  children,
  animation = 'slideUp',
  stagger = 0.1,
  className = '',
}: ScrollAnimateGroupProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useScrollAnimation(ref, 0.1);

  useEffect(() => {
    if (ref.current && isVisible) {
      const childElements = ref.current.children;
      Array.from(childElements).forEach((child, index) => {
        const element = child as HTMLElement;
        element.style.animationDelay = `${index * stagger}s`;
      });
    }
  }, [isVisible, stagger]);

  return (
    <div ref={ref} className={`scroll-animate-group ${className}`}>
      {isVisible &&
        Children.map(children, (child, index) => (
          <div
            key={index}
            className={`scroll-animate scroll-animate--${animation} scroll-animate--visible`}
          >
            {child}
          </div>
        ))}
      {!isVisible && children}
    </div>
  );
};
