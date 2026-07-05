'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
  moveCard,
  setColumns,
  addCard,
  deleteCard,
  updateCardInColumn,
} from '@/store/slices/boardSlice';
import type { ColumnData } from '@/utils/ComponentsProps';
import socket from '@/utils/socket';

function mapApiColumnsToColumnData(apiColumns: any[]): ColumnData[] {
  // same mapping helper as before — centralised here so Board.tsx is clean
  return apiColumns.map((col) => ({
    id: col._id,
    name: col.title,
    cards: col.cards.map((card: any) => ({
      id: card._id,
      title: card.title,
      category: card.category ?? '',
      user: card.assigneeId ?? '',
      blur: false,
      color: card.color ?? { textColor: '', bgColor: '', borderColor: '' },
    })),
  }));
}

/**
 * Handles ALL board socket events for a given boardId.
 * The component just calls this hook — no socket imports, no emit calls,
 * no event listener cleanup needed in the component itself.
 *
 * Emitters are returned so the component (or other hooks) can trigger
 * actions without knowing anything about the socket layer.
 */
export function useBoardSocket(boardId: string | undefined) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!boardId) return;
    if (!socket.connected) socket.connect();

    socket.emit('board:join', boardId);

    // ── Incoming events from other users ─────────────────────────────────────

    socket.on(
      'card:moved',
      (payload: {
        boardId: string;
        cardId: string;
        fromColumnId: string;
        toColumnId: string;
        toIndex: number;
      }) => {
        dispatch(moveCard(payload));
      },
    );

    socket.on(
      'card:added',
      (payload: { columnId: string; card: ColumnData['cards'][0] }) => {
        dispatch(addCard(payload));
      },
    );

    socket.on(
      'card:deleted',
      (payload: { columnId: string; cardId: string }) => {
        dispatch(deleteCard(payload));
      },
    );

    socket.on(
      'card:updated',
      (payload: { columnId: string; cardId: string; card: any }) => {
        dispatch(updateCardInColumn(payload));
      },
    );

    socket.on('board:updated', (apiColumns: any[]) => {
      dispatch(setColumns(mapApiColumnsToColumnData(apiColumns)));
    });

    // ── Cleanup — leave room and remove listeners when board unmounts ─────────

    return () => {
      socket.emit('board:leave', boardId);
      socket.off('card:moved');
      socket.off('card:added');
      socket.off('card:deleted');
      socket.off('card:updated');
      socket.off('board:updated');
    };
  }, [boardId]);

  // ── Emitters — call these instead of using socket directly in components ───

  const emitMoveCard = (payload: {
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
    toIndex: number;
  }) => {
    console.log('emitting card:move', payload, boardId);
    socket.emit('card:move', { boardId, ...payload }, (err: string | null) => {
      if (err) console.error('card:move failed:', err);
    });
  };

  const emitAddCard = (
    columnId: string,
    title: string,
    options?: { color?: any; description?: string },
  ) => {
    socket.emit(
      'card:add',
      { boardId, columnId, title, ...options },
      (err: string | null, card?: any) => {
        if (err) console.error('card:add failed:', err);
      },
    );
  };

  const emitDeleteCard = (columnId: string, cardId: string) => {
    socket.emit(
      'card:delete',
      { boardId, columnId, cardId },
      (err: string | null) => {
        if (err) console.error('card:delete failed:', err);
      },
    );
  };

  const emitUpdateCard = (
    columnId: string,
    cardId: string,
    data: Record<string, any>,
  ) => {
    socket.emit(
      'card:update',
      { boardId, columnId, cardId, data },
      (err: string | null) => {
        if (err) console.error('card:update failed:', err);
      },
    );
  };

  return { emitMoveCard, emitAddCard, emitDeleteCard, emitUpdateCard };
}
