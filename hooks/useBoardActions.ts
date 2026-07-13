'use client';

import { useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
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
    meta: { pageLoad: true,silent:true },
  });
  return data;
}
async function updateBoardNameRequest(boardId: string, name: string) {
  const { data } = await api.put(`/boards/${boardId}`, { name });
  return data;
}
async function deleteBoardRequest(boardId: string) {
  const { data } = await api.delete(`/boards/${boardId}`);
  return data;
}
export function useBoardActions(boardId?: string) {
  const dispatch = useAppDispatch();
  const board = useAppSelector((s) => s.board.board);
  const queryClient = useQueryClient();
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
  // ── Update ────────────────────────────────────────────────────────────────
  const updateMutation = useMutation({
    mutationFn: (name: string) => updateBoardNameRequest(boardId!, name),
    onSuccess: (response) => {
      if (!response.success) return;
      dispatch(setBoardAction(response.data));
      queryClient.invalidateQueries({ queryKey: ['board', boardId] });
    },
  });

  const handleUpdateName = (name: string) => {
    if (!boardId || !name.trim()) return;
    updateMutation.mutate(name);
  };
  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBoardRequest(id!),
    onSuccess: (_, id) => {
      // ← second arg is the mutate() input
      queryClient.removeQueries({ queryKey: ['board', id] });
      queryClient.invalidateQueries({ queryKey: ['ownerBoards'] });
      queryClient.invalidateQueries({ queryKey: ['memberBoards'] });
    },
  });

  const handleDelete = (id:string) => {
    if (!id) return;
    deleteMutation.mutate(id);
  };
  return {
    refetch, // call to manually refetch (e.g. onRetry button)
    board,
    loading,
    // Filter out silent errors so ErrorFetching never renders for 401/403
    error: (error as any)?.silent ? null : error,
    // update
    handleUpdateName,
    updating: updateMutation.isPending,
    updateError: updateMutation.error,

    // delete
    handleDelete,
    deleting: deleteMutation.isPending,
    deleteError: deleteMutation.error,
  };
}
