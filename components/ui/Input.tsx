import { InputHTMLAttributes } from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  Icon?: LucideIcon;
  iconSize?: number;
  ButtonClick?: () => void;
}

export default function Input({
  Icon,
  className = '',
  disabled,
  iconSize = 18,
  ButtonClick,
  ...rest
}: InputProps) {
  return (
    <div className="board-input-wrap flex items-center">
      <input
        className={`board-input  ${className}`.trim()}
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
  );
}
