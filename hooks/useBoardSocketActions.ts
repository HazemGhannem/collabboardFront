'use client';

import { useRef } from 'react';
import { useAppSelector } from '@/store/hooks';
import socket from '@/utils/socket';

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
    options?: { color?: any; description?: string },
  ) => {
    socket.emit('card:add', {
      boardId,
      columnId,
      title,
      ...options,
    });
  };

  const emitDeleteCard = (columnId: string, cardId: string) => {
    socket.emit('card:delete', {
      boardId,
      columnId,
      cardId,
    });
  };

  const emitUpdateCard = (
    columnId: string,
    cardId: string,
    data: Record<string, any>,
  ) => {
    socket.emit('card:update', {
      boardId,
      columnId,
      cardId,
      data,
    });
  };

  const emitAddColumn = (title: string) => {
    socket.emit('column:add', {
      boardId,
      title,
    });
  };

  const emitCursorMove = (x: number, y: number) => {
    if (!boardId || !user) return;

    const now = Date.now();

    if (now - lastEmitRef.current < 40) return;

    lastEmitRef.current = now;

    socket.emit('cursor:move', {
      boardId,
      userId: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      x,
      y,
    });
  };
const emitLeaveBoard = () => {
  if (!boardId) return;

  socket.emit('board:leave', boardId);
};
  return {
    emitMoveCard,
    emitAddCard,
    emitDeleteCard,
    emitUpdateCard,
    emitAddColumn,
    emitCursorMove,
    emitLeaveBoard,
  };
}
