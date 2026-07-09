'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  moveCard,
  addCard,
  deleteCard,
  updateCardInColumn,
  setOnlineUsers,
  addColumn,
  updateColumn,
  deleteColumn,
} from '@/store/slices/boardSlice';
import type { CursorPosition } from '@/utils/ComponentsProps';
import socket from '@/utils/socket';
import { IColumn } from '@/types/type';

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
    const onColumnAdded = (payload: { column: IColumn }) =>
      dispatch(addColumn(payload.column));

    const onColumnUpdated = (payload: { column: IColumn }) =>
      dispatch(
        updateColumn({
          columnId: payload.column._id,
          title: payload.column.title,
        }),
      );

    const onColumnDeleted = (payload: { column: IColumn }) =>
      dispatch(deleteColumn({ columnId: payload.column._id }));
    const onCardMoved = (payload: any) => dispatch(moveCard(payload));

    const onCardAdded = (payload: any) => dispatch(addCard(payload));

    const onCardDeleted = (payload: any) => dispatch(deleteCard(payload));

    const onCardUpdated = (payload: any) =>
      dispatch(updateCardInColumn(payload));
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
    socket.on('presence:update', onPresenceUpdate);
    socket.on('cursor:moved', onCursorMoved);
    socket.on('cursor:left', onCursorLeft);
    socket.on('column:added', onColumnAdded);
    socket.on('column:updated', onColumnUpdated);
    socket.on('column:deleted', onColumnDeleted);

    return () => {
      socket.off('card:moved', onCardMoved);
      socket.off('card:added', onCardAdded);
      socket.off('card:deleted', onCardDeleted);
      socket.off('card:updated', onCardUpdated);
      socket.off('presence:update', onPresenceUpdate);
      socket.off('cursor:moved', onCursorMoved);
      socket.off('cursor:left', onCursorLeft);
      socket.off('column:added', onColumnAdded);
      socket.off('column:updated', onColumnUpdated);
      socket.off('column:deleted', onColumnDeleted);
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
