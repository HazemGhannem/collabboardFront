'use client';

import { useState } from 'react';

interface UseCollabBoardFormOptions {
  onCreate: (boardName: string) => void;
  onJoin: (boardLinkOrId: string) => void;
  defaultBoardName?: string;
}

/**
 * Holds the two independent inputs on the CollabBoard card — the new-board
 * name and the join-existing field — and validates before calling out.
 */
export function useCollabBoardForm({
  onCreate,
  onJoin,
  defaultBoardName = '',
}: UseCollabBoardFormOptions) {
  const [boardName, setBoardName] = useState(defaultBoardName);
  const [joinValue, setJoinValue] = useState('');

  const canCreate = boardName.trim().length > 0;
  const canJoin = joinValue.trim().length > 0;

  const handleCreate = () => {
    if (!canCreate) return;
    onCreate(boardName.trim());
  };

  const handleJoin = () => {
    if (!canJoin) return;
    onJoin(joinValue.trim());
  };

  return {
    boardName,
    setBoardName,
    joinValue,
    setJoinValue,
    canCreate,
    canJoin,
    handleCreate,
    handleJoin,
  };
}
