import { forwardRef, InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  Icon?: LucideIcon;
  Icon2?: LucideIcon;
  iconSize?: number;
  iconLabel?: string;
  icon2Label?: string;
  ButtonClick?: () => void;
  ButtonClick2?: () => void;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    Icon,
    Icon2,
    className = '',
    disabled,
    iconSize = 18,
    iconLabel = 'action',
    icon2Label = 'action',
    ButtonClick,
    ButtonClick2,
    ...rest
  },
  ref,
) {
  // Reserve room on the right so text doesn't run under the icon(s)
  const iconCount = [Icon, Icon2].filter(Boolean).length;
  const paddingRight =
    iconCount === 0 ? '' : iconCount === 1 ? 'pr-9' : 'pr-16';

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
          {label}
        </label>
      )}

      <div className="board-input-wrap flex items-center relative">
        <input
          ref={ref}
          className={`board-input w-full ${paddingRight} ${className}`.trim()}
          disabled={disabled}
          aria-invalid={!!error}
          {...rest}
        />

        {Icon && (
          <button
            type="button"
            aria-label={iconLabel}
            disabled={disabled}
            onClick={ButtonClick}
            className="absolute right-2 flex items-center justify-center text-current disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
          >
            <Icon size={iconSize} />
          </button>
        )}

        {Icon2 && (
          <button
            type="button"
            aria-label={icon2Label}
            disabled={disabled}
            onClick={ButtonClick2}
            className={`absolute flex items-center justify-center text-current disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer ${
              Icon ? 'right-9' : 'right-2'
            }`}
          >
            <Icon2 size={iconSize} />
          </button>
        )}
      </div>

      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
});

export default Input;
