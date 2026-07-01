import { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  Icon?: LucideIcon;
  iconSize?: number;
  ButtonClick?: () => void;
}

export default function Input({
  label,
  Icon,
  className = '',
  disabled,
  iconSize = 18,
  ButtonClick,
  ...rest
}: InputProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
          {label}
        </label>
      )}
      <div className="board-input-wrap flex items-center relative">
        <input
          className={`board-input w-full ${className}`.trim()}
          disabled={disabled}
          {...rest}
        />
        {Icon && (
          <span className="absolute right-2">
            <Icon
              size={iconSize}
              className="cursor-pointer"
              onClick={ButtonClick}
            />
          </span>
        )}
      </div>
    </div>
  );
}
