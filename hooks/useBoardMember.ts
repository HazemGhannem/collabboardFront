'use client';

import { useState } from 'react';
import { api } from '@/utils/api';

export function useBoardMember() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBoardMember = async (boardId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/invite/${boardId}/get-members`);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong. Try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getBoardMember,
    loading,
    error,
    setError,
  };
}
