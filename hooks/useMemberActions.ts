'use client';

import { useState } from 'react';
import { api } from '@/utils/api';

export function useMemberActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMember = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/boards/${code}/join`);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong. Try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (boardId: string, targetUserId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/boards/${boardId}/members/${targetUserId}`);
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMembers = async (boardId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/boards/${boardId}/members`);
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong. Try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    addMember,
    removeMember,
    getMembers,
    loading,
    error,
    setError,
  };
}
