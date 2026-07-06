'use client';

import { api } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useMemberActions } from './useMemberActions';

export function useCollabBoardForm() {
  const router = useRouter();
  const { addMember,error:memberError } = useMemberActions();
  const [boardName, setBoardName] = useState('');
  const [joinValue, setJoinValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canCreate = boardName.trim().length > 0;
  const canJoin = joinValue.trim().length > 0;

  const handleCreate = async () => {
    if (!canCreate) return;
    setLoading(true);
    setError(null);

    try {
      const { data: response } = await api.post('/boards', {
        name: boardName,
      });
      if (response.success) return router.push(`/board/${response.data._id}`);
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    if (!canJoin) return;
    console.log(joinValue);
    await addMember(joinValue);
  };

  return {
    boardName,
    setBoardName,
    joinValue,
    setJoinValue,
    canCreate,
    canJoin,
    error,
    loading,
    handleCreate,
    handleJoin,
    memberError,
  };
}
