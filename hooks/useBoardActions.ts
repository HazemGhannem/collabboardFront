'use client';

import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/utils/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setBoard as setBoardAction,
  setColumns,
  setMemberData,
} from '@/store/slices/boardSlice';
import type { IBoardResponse } from '@/types/type';

async function fetchBoard(boardId: string): Promise<IBoardResponse> {
  const { data } = await api.get<IBoardResponse>(`/boards/${boardId}`, {
    meta: { pageLoad: true },
  });
  return data;
}

export function useBoardActions(boardId?: string) {
  const dispatch = useAppDispatch();
  const board = useAppSelector((s) => s.board.board);

  const {
    data,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['board', boardId],
    queryFn: () => fetchBoard(boardId!),
    enabled: !!boardId, // only runs when boardId is available
    retry: false, // don't retry on 403/404
    staleTime: 1000 * 30, // treat data as fresh for
  });

  // Sync fetched data into Redux when it arrives
  useEffect(() => {
    if (!data?.data) return;
    dispatch(setBoardAction(data.data.board));
    dispatch(setMemberData(data.data.member));
    dispatch(setColumns(data.data.board.columns));
  }, [data, dispatch]);

  return {
    refetch, // call to manually refetch (e.g. onRetry button)
    board,
    loading,
    // Filter out silent errors so ErrorFetching never renders for 401/403
    error: (error as any)?.silent ? null : error,
  };
}
