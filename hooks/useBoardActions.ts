'use client';

import { useState } from 'react';
import { api } from '@/utils/api';
import type { IBoard, IColumn } from '@/types/type';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setBoard as setBoardAction,
  addColumn,
  deleteColumn,
  updateColumn,
} from '@/store/slices/boardSlice';
import { ColumnData } from '@/utils/ComponentsProps';

export function useBoardActions() {
  const dispatch = useAppDispatch();
  const board = useAppSelector((s) => s.board.board?.data.board);
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
  const addColumToBoarder = async (
    boardId: string,
    title: string,
  ): Promise<IColumn | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.post<any>(`/boards/${boardId}/columns`, {
        title,
      });

      const newColumn: ColumnData = {
        id: data.data._id,
        name: data.data.title,
        cards: [],
      };

      dispatch(addColumn(newColumn));
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong. Try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  const deleteColumFromBoarder = async (
    boardId: string,
    columnId: string,
  ): Promise<IColumn | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.delete(
        `/boards/${boardId}/${columnId}/columns`,
      );
      dispatch(deleteColumn({ columnId }));
      return data;
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong. Try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  const updateColumnTitle = async (
    boardId: string,
    columnId: string,
    title: string,
  ): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.put<any>(
        `/boards/${boardId}/${columnId}/columns`,
        { title },
      );
      dispatch(updateColumn({ columnId, name: data.data.title }));
    } catch (err: any) {
      setError(err.response?.data?.error ?? 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };
  return {
    getBoardById,
    addColumToBoarder,
    deleteColumFromBoarder,
    updateColumnTitle,
    board,
    columns,
    loading,
    error,
    setError,
  };
}
