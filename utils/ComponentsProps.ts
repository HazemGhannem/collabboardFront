import type { ICard, IColumn } from '@/types/type';

// ─── Card Component ───────────────────────────────────────────────────────────
// Extends ICard with UI-only fields (blur, columName, columId, color)

export interface CardProps extends ICard {
  color?: { bgColor: string; textColor: string; borderColor: string };
  blur?: boolean;
  columName?: string;
  columId?: string;
}

// ─── Column Component ─────────────────────────────────────────────────────────
// Extends IColumn with boardId for actions

export interface ColumnProps extends IColumn {
  boardId: string;
}

// ─── Socket ───────────────────────────────────────────────────────────────────

export interface PresenceUser {
  userId: string;
  firstName: string;
  lastName: string;
}

export interface CursorPosition {
  userId: string;
  firstName: string;
  lastName: string;
  x: number;
  y: number;
}
