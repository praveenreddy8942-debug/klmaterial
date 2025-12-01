import './Loading.css';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  text?: string;
  fullScreen?: boolean;
}

export const Loading = ({
  size = 'md',
  variant = 'spinner',
  text,
  fullScreen = false,
}: LoadingProps) => {
  const containerClass = fullScreen
    ? 'ui-loading__container ui-loading__container--fullscreen'
    : 'ui-loading__container';

  return (
    <div className={containerClass}>
      <div className={`ui-loading ui-loading--${size}`}>
        {variant === 'spinner' && (
          <svg className="ui-loading__spinner" viewBox="0 0 50 50">
            <circle
              className="ui-loading__spinner-path"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
            />
          </svg>
        )}

        {variant === 'dots' && (
          <div className="ui-loading__dots">
            <div className="ui-loading__dot"></div>
            <div className="ui-loading__dot"></div>
            <div className="ui-loading__dot"></div>
          </div>
        )}

        {variant === 'pulse' && (
          <div className="ui-loading__pulse">
            <div className="ui-loading__pulse-ring"></div>
            <div className="ui-loading__pulse-ring"></div>
            <div className="ui-loading__pulse-ring"></div>
          </div>
        )}
      </div>

      {text && <p className="ui-loading__text">{text}</p>}
    </div>
  );
};
