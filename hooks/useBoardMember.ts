'use client';

import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';

async function fetchBoardMembers(boardId: string) {
  const { data } = await api.get(`/invite/${boardId}/get-members`);
  return data;
}

export function useBoardMember(boardId?: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['boardMembers', boardId],
    queryFn: () => fetchBoardMembers(boardId!),
    enabled: !!boardId,
    staleTime: 1000 * 30,
  });

  return {
    members: data?.data ?? null,
    loading: isLoading,
    error,
    refetch,
  };
}
