'use client';

import { useAppSelector } from '@/store/hooks';

const ROLE_RANK = {
  viewer: 0,
  editor: 1,
  owner: 2,
} as const;

type Role = keyof typeof ROLE_RANK;

export function usePermissions() {
  const role = useAppSelector((s) => s.board.memberData?.role);
  const hasAtLeast = (required: Role): boolean =>
    role != null && ROLE_RANK[role] >= ROLE_RANK[required];

  return {
    role,
    isViewer: role != null,
    isEditor: hasAtLeast('editor'),
    isOwner: role === 'owner',

    // Named permissions — adjust the required rank per action as needed
    canEditColumns: hasAtLeast('editor'),
    canDeleteColumns: hasAtLeast('editor'),
    canAddCards: hasAtLeast('viewer'),
    canDeleteBoard: role === 'owner',
    canManageMembers: hasAtLeast('editor'),
  };
}
