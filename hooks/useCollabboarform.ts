'use client';

import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useMemberActions } from './useMemberActions';

async function createBoardRequest(name: string) {
  const { data } = await api.post('/boards', { name });
  return data;
}

export function useCollabBoardForm() {
  const router = useRouter();
  const { joinMember, createInviteError,joining } = useMemberActions();
  const [boardName, setBoardName] = useState('');
  const [joinValue, setJoinValue] = useState('');

  const canCreate = boardName.trim().length > 0;
  const canJoin = joinValue.trim().length > 0;

  const createMutation = useMutation({
    mutationFn: () => createBoardRequest(boardName),
    onSuccess: (response) => {
      if (response.success) router.push(`/board/${response.data._id}`);
    },
  });

  const handleCreate = () => {
    if (!canCreate) return;
    createMutation.mutate();
  };

  const handleJoin = async () => {
    if (!canJoin) return;
    const response = await joinMember(joinValue);
    if (response?.success) {
      router.push(`/board/${response.data.boardId}`); // now works correctly
      setJoinValue('');
    }
  };

  const error = createMutation.error
    ? ((createMutation.error as any).response ??
      'Something went wrong. Try again.')
    : null;

  return {
    boardName,
    setBoardName,
    joinValue,
    setJoinValue,
    canCreate,
    canJoin,
    error,
    loading: createMutation.isPending,
    handleCreate,
    handleJoin,
    createInviteError,
    joining,
  };
}
