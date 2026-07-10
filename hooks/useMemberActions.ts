'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import { ApiResponseError } from '@/types/type';

export function useMemberActions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiResponseError | null>(null);

  const joinMember = async (code: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/invite/${code}/join`);
      return data;
    } catch (err: any) {
      setError(err.response ?? 'Something went wrong. Try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  const createInvite = async (boardId: string, body: any) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post(`/invite/${boardId}/create-invite-code`, {
        body,
      });
      return data;
    } catch (err: any) {
      setError(err.response ?? 'Something went wrong. Try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (boardId: string, targetUserId: string) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/member/${boardId}/members/${targetUserId}`);
    } catch (err: any) {
      setError(err.response ?? 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMembers = async (boardId: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get(`/member/${boardId}/members`);
      return data;
    } catch (err: any) {
      setError(err.response ?? 'Something went wrong. Try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    joinMember,
    removeMember,
    getMembers,
    loading,
    error,
    setError,
    createInvite,
  };
}
