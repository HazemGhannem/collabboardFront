'use client';

import { useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import socket from '@/utils/socket';
import { ICard, IColumn } from '@/types/type';

export function useBoardSocketActions(boardId?: string) {
  const user = useAppSelector((s) => s.auth.user);
  const lastEmitRef = useRef(0);

  const emitMoveCard = (payload: {
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
    toIndex: number;
  }) => {
    socket.emit('card:move', { boardId, ...payload });
  };

  const emitAddCard = (
    columnId: string,
    title: string,
    options?: { description: string; category: string },
  ): Promise<ICard | null> => {
    return new Promise((resolve) => {
      socket.emit(
        'card:add',
        { boardId, columnId, title, assigneeId: user?._id, ...options },
        (err: string | null, card?: ICard) => {
          if (err) {
            console.error('card:add failed:', err);
            resolve(null);
            return;
          }
          // State update now comes solely from the 'card:added' broadcast
          // in useBoardSocket.ts — no local dispatch here.
          resolve(card ?? null);
        },
      );
    });
  };

  const emitDeleteCard = (columnId: string, cardId: string) => {
    socket.emit('card:delete', { boardId, columnId, cardId });
  };

  const emitUpdateCard = (
    columnId: string,
    cardId: string,
    data: Record<string, any>,
  ) => {
    socket.emit('card:update', { boardId, columnId, cardId, data });
  };

  const emitCursorMove = (x: number, y: number) => {
    if (!boardId || !user) return;

    const now = Date.now();
    if (now - lastEmitRef.current < 40) return;
    lastEmitRef.current = now;

    socket.emit('cursor:move', {
      boardId,
      x,
      y,
    });
  };

  const emitLeaveBoard = () => {
    if (!boardId) return;
    socket.emit('board:leave', boardId);
  };

  const emitUpdateColumn = (
    columnId: string,
    title: string,
    ack?: (err: string | null) => void,
  ) => {
    if (!boardId) return;
    socket.emit(
      'column:update',
      { boardId, columnId, title },
      (err: string | null) => {
        if (err) console.error('column:update failed:', err);
        ack?.(err);
      },
    );
  };

  const emitAddColumn = (
    title: string,
    ack?: (err: string | null, column?: IColumn) => void,
  ) => {
    if (!boardId) return;
    socket.emit(
      'column:add',
      { boardId, title },
      (err: string | null, column?: IColumn) => {
        if (err) console.error('column:add failed:', err);
        ack?.(err, column);
      },
    );
  };

  const emitDeleteColumn = (
    columnId: string,
    ack?: (err: string | null) => void,
  ) => {
    if (!boardId) return;
    socket.emit(
      'column:delete',
      { boardId, columnId },
      (err: string | null) => {
        if (err) console.error('column:delete failed:', err);
        ack?.(err);
      },
    );
  };
  const emitDisconnectSocket = () => {
    if (socket.connected) socket.disconnect();
  };

  return {
    emitMoveCard,
    emitAddCard,
    emitDeleteCard,
    emitUpdateCard,
    emitAddColumn,
    emitCursorMove,
    emitLeaveBoard,
    emitUpdateColumn,
    emitDeleteColumn,
    emitDisconnectSocket,
  };
}
