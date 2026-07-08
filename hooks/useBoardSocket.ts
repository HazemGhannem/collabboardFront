'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  moveCard,
  setColumns,
  addCard,
  deleteCard,
  updateCardInColumn,
  setOnlineUsers,
} from '@/store/slices/boardSlice';
import type { ColumnData, CursorPosition } from '@/utils/ComponentsProps';
import socket from '@/utils/socket';

function mapApiColumnsToColumnData(apiColumns: any[]): ColumnData[] {
  return apiColumns.map((col) => ({
    id: col._id,
    name: col.title,
    cards: col.cards.map((card: any) => ({
      id: card._id,
      title: card.title,
      category: card.category ?? '',
      user: card.assigneeId ?? '',
      blur: false,
      color: card.color ?? {
        textColor: '',
        bgColor: '',
        borderColor: '',
      },
    })),
  }));
}

export function useBoardSocket(boardId?: string) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);

  const [cursors, setCursors] = useState<Record<string, CursorPosition>>({});

  const joinedBoard = useRef<string | null>(null);

  useEffect(() => {
    if (!boardId || !user) return;

    if (!socket.connected) socket.connect();

    if (joinedBoard.current !== boardId) {
      if (joinedBoard.current) {
        socket.emit('board:leave', joinedBoard.current);
      }

      joinedBoard.current = boardId;

      socket.emit('board:join', {
        boardId,
        user: {
          userId: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      });

      socket.emit('presence:sync', { boardId });
    }

    const onCardMoved = (payload: any) => dispatch(moveCard(payload));

    const onCardAdded = (payload: any) => dispatch(addCard(payload));

    const onCardDeleted = (payload: any) => dispatch(deleteCard(payload));

    const onCardUpdated = (payload: any) =>
      dispatch(updateCardInColumn(payload));

    const onBoardUpdated = (columns: any[]) =>
      dispatch(setColumns(mapApiColumnsToColumnData(columns)));

    const onPresenceUpdate = (users: any) => dispatch(setOnlineUsers(users));

    const onCursorMoved = (payload: CursorPosition) => {
      setCursors((prev) => ({
        ...prev,
        [payload.userId]: payload,
      }));
    };

    const onCursorLeft = ({ userId }: { userId: string }) => {
      setCursors((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    };

    socket.on('card:moved', onCardMoved);
    socket.on('card:added', onCardAdded);
    socket.on('card:deleted', onCardDeleted);
    socket.on('card:updated', onCardUpdated);
    socket.on('board:updated', onBoardUpdated);
    socket.on('presence:update', onPresenceUpdate);
    socket.on('cursor:moved', onCursorMoved);
    socket.on('cursor:left', onCursorLeft);

    return () => {
      socket.off('card:moved', onCardMoved);
      socket.off('card:added', onCardAdded);
      socket.off('card:deleted', onCardDeleted);
      socket.off('card:updated', onCardUpdated);
      socket.off('board:updated', onBoardUpdated);
      socket.off('presence:update', onPresenceUpdate);
      socket.off('cursor:moved', onCursorMoved);
      socket.off('cursor:left', onCursorLeft);
    };
  }, [boardId, user, dispatch]);

  useEffect(() => {
    return () => {
      if (joinedBoard.current) {
        socket.emit('board:leave', joinedBoard.current);
        joinedBoard.current = null;
      }
    };
  }, []);

  return { cursors };
}
