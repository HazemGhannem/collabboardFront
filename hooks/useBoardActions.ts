'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import type { IBoard } from '@/types/type';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setBoard as setBoardAction,
} from '@/store/slices/boardSlice';

export function useBoardActions() {
  const dispatch = useAppDispatch();
  const board = useAppSelector((s) => s.board.board);
  const columns = useAppSelector((s) => s.board.columns);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch board from API → store in Redux only, no IndexedDB
  const getBoardById = async (boardId: string): Promise<IBoard | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<IBoard>(`/boards/${boardId}`);
      dispatch(setBoardAction(data));
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong. Try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  return {
    getBoardById,
    board,
    columns,
    loading,
    error,
    setError,
  };
}
