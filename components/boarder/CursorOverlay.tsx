import { HEX_COLORS, getColorIndexForUser } from '@/utils/utils';
import type { CursorPosition } from '@/utils/ComponentsProps';
import { MousePointer2 } from 'lucide-react';

interface CursorOverlayProps {
  cursors: Record<string, CursorPosition>;
  currentUserId?: string;
}

export default function CursorOverlay({
  cursors,
  currentUserId,
}: CursorOverlayProps) {
  return (
    <>
      {Object.values(cursors)
        .filter((c) => c.userId !== currentUserId)
        .map((c) => {
          const color = HEX_COLORS[getColorIndexForUser(c.userId)];
          return (
            <div
              key={c.userId}
              className="pointer-events-none absolute z-50 flex items-center gap-1.5 transition-[left,top] duration-75 ease-linear"
              style={{ left: c.x, top: c.y }}
            >
              <MousePointer2
                size={18}
                fill={color}
                color={color}
                strokeWidth={1.5}
              />
              <span
                className="rounded px-1.5 py-0.5 text-xs font-medium text-white whitespace-nowrap"
                style={{ backgroundColor: color }}
              >
                {c.firstName}
              </span>
            </div>
          );
        })}
    </>
  );
}
