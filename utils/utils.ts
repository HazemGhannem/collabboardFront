import { IColumn } from '@/types/type';

const SECRET = process.env.NEXT_PUBLIC_CRYPTO_SECRET ?? 'change-this-secret';

export function encryptBoardLink(id: string): string {
  return btoa(
    id
      .split('')
      .map((c, i) =>
        String.fromCharCode(
          c.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length),
        ),
      )
      .join(''),
  )
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, ''); // URL-safe base64
}

export function decryptBoardLink(encoded: string): string {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(base64);
  return decoded
    .split('')
    .map((c, i) =>
      String.fromCharCode(
        c.charCodeAt(0) ^ SECRET.charCodeAt(i % SECRET.length),
      ),
    )
    .join('');
}

// utils/userColor.ts
export const COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-lime-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-pink-500',
];

// Hex versions for inline SVG/style use (cursor color can't rely on Tailwind bg-* since it's drawn via style, not className)
export const HEX_COLORS = [
  '#ef4444',
  '#f97316',
  '#f59e0b',
  '#84cc16',
  '#10b981',
  '#14b8a6',
  '#06b6d4',
  '#0ea5e9',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#d946ef',
  '#ec4899',
];

// Stable hash so the same userId always maps to the same color, across avatars + cursors
export function getColorIndexForUser(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return hash % COLORS.length;
}

export const CATEGORY_COLORS: Record<
  string,
  { textColor: string; bgColor: string; borderColor: string }
> = {
  Design: {
    textColor: 'text-orange-500',
    bgColor: 'bg-orange-500',
    borderColor: 'border-l-orange-500',
  },
  Dev: {
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-500',
    borderColor: 'border-l-blue-500',
  },
  QA: {
    textColor: 'text-green-500',
    bgColor: 'bg-green-500',
    borderColor: 'border-l-green-500',
  },
  Backend: {
    textColor: 'text-purple-500',
    bgColor: 'bg-purple-500',
    borderColor: 'border-l-purple-500',
  },
  Frontend: {
    textColor: 'text-cyan-500',
    bgColor: 'bg-cyan-500',
    borderColor: 'border-l-cyan-500',
  },
  Auth: {
    textColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    borderColor: 'border-l-yellow-500',
  },
  Default: {
    textColor: 'text-gray-500',
    bgColor: 'bg-gray-500',
    borderColor: 'border-l-gray-500',
  },
};

export function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Default;
}

export function findColumnOfCard(columns: IColumn[], cardId: string) {
  return columns.find((col) => col.cards.some((c) => c._id === cardId));
}
