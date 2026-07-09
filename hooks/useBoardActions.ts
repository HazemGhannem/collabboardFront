'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import type { IBoardResponse } from '@/types/type';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setBoard as setBoardAction,
  setColumns,
  setMemberData,
} from '@/store/slices/boardSlice';

export function useBoardActions() {
  const dispatch = useAppDispatch();
  const board = useAppSelector((s) => s.board.board);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch board from API → store in Redux only, no IndexedDB
  const getBoardById = async (
    boardId: string,
  ): Promise<IBoardResponse | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get<IBoardResponse>(`/boards/${boardId}`);
      // console.log(data.data.board.columns, '=====');
      dispatch(setBoardAction(data.data.board));
      dispatch(setMemberData(data.data.member));
      dispatch(setColumns(data.data.board.columns));
      return data;
    } catch (err: any) {
      console.log(err.response);
      setError(err.response ?? 'Something went wrong. Try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getBoardById,
    board,
    loading,
    error,
    setError,
  };
}
