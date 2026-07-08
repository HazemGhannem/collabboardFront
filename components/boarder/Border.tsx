'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import Column from './Column';
import Card from './Card';
import CursorOverlay from './CursorOverlay';
import { type CardProps, type ColumnData } from '@/utils/ComponentsProps';
import { useBoardActions } from '@/hooks/useBoardActions';
import { useBoardSocket } from '@/hooks/useBoardSocket';
import { useBoardSocketActions } from '@/hooks/useBoardSocketActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setColumns } from '@/store/slices/boardSlice';
import { useParams } from 'next/navigation';
import Spinner from '../ui/Spinner';
import ErrorFetching from '../error/ErrorFetching';
import AddColumn from './AddColum';
import { usePermissions } from '@/hooks/usePermissions';
import { findColumnOfCard, getCategoryColor } from '@/utils/utils';

export default function Board() {
  const [activeCard, setActiveCard] = useState<CardProps | null>(null);
  // Captures the original column at drag start — by the time onDragEnd fires,
  // Redux has already been mutated optimistically so findColumnOfCard is unreliable
  const dragFromColRef = useRef<string | null>(null);

  const { isEditor } = usePermissions();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { getBoardById, loading, error, board } = useBoardActions();
  const columns = useAppSelector((s) => s.board.columns);
  const currentUserId = useAppSelector((s) => s.auth.user?._id);

  const { cursors } = useBoardSocket(id);
  const { emitCursorMove, emitMoveCard } = useBoardSocketActions(id);

  const boardRef = useRef<HTMLDivElement>(null);

  // Viewers don't need to broadcast a cursor — skip the work entirely
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isEditor) return;
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;
      emitCursorMove(e.clientX - rect.left, e.clientY - rect.top);
    },
    [isEditor, emitCursorMove],
  );

  // ── Fetch board on mount ────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    getBoardById(id);
  }, [id]);

  // ── Map API response → Redux columns ───────────────────────────────────────

  useEffect(() => {
    if (!board?.columns) return;
    dispatch(
      setColumns(
        board.columns.map((col: any) => ({
          id: col._id,
          name: col.title,
          cards: col.cards.map((card: any) => ({
            id: card._id,
            title: card.title,
            category: card.category ?? '',
            user: card.assigneeId ?? '',
            blur: false,
            color: getCategoryColor(card.category ?? ''),
          })),
        })),
      ),
    );
  }, [board, dispatch]);

  // ── DnD ────────────────────────────────────────────────────────────────────

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      if (!isEditor) return;
      const col = findColumnOfCard(columns, active.id as string);
      const card = col?.cards.find((c) => c.id === active.id);
      dragFromColRef.current = col?.id ?? null;
      if (card) setActiveCard(card);
    },
    [isEditor, columns],
  );

  const onDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      if (!isEditor || !over) return;

      const fromCol = findColumnOfCard(columns, active.id as string);
      const toCol =
        columns.find((c) => c.id === over.id) ??
        findColumnOfCard(columns, over.id as string);

      if (!fromCol || !toCol || fromCol.id === toCol.id) return;

      const overCardIndex = toCol.cards.findIndex((c) => c.id === over.id);
      const toIndex = overCardIndex >= 0 ? overCardIndex : toCol.cards.length;

      // Optimistic UI update
      dispatch(
        setColumns(
          columns.map((col) => {
            if (col.id === fromCol.id)
              return {
                ...col,
                cards: col.cards.filter((c) => c.id !== active.id),
              };
            if (col.id === toCol.id) {
              const card = fromCol.cards.find((c) => c.id === active.id)!;
              const newCards = [...col.cards];
              newCards.splice(toIndex, 0, card);
              return { ...col, cards: newCards };
            }
            return col;
          }),
        ),
      );
    },
    [isEditor, columns, dispatch],
  );

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveCard(null);
      if (!isEditor || !over) return;

      const fromColId = dragFromColRef.current;
      dragFromColRef.current = null;

      const toCol =
        columns.find((c) => c.id === over.id) ??
        findColumnOfCard(columns, over.id as string);

      if (!fromColId || !toCol) return;

      // Same column — reorder
      if (fromColId === toCol.id) {
        const oldIndex = toCol.cards.findIndex((c) => c.id === active.id);
        const newIndex = toCol.cards.findIndex((c) => c.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          dispatch(
            setColumns(
              columns.map((col) =>
                col.id === toCol.id
                  ? { ...col, cards: arrayMove(col.cards, oldIndex, newIndex) }
                  : col,
              ),
            ),
          );
        }
      }

      const toIndex = toCol.cards.findIndex((c) => c.id === over.id);

      // Persist to DB + broadcast to other users via the hook
      emitMoveCard({
        cardId: active.id as string,
        fromColumnId: fromColId,
        toColumnId: toCol.id,
        toIndex: toIndex >= 0 ? toIndex : toCol.cards.length,
      });
    },
    [isEditor, columns, dispatch, emitMoveCard],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading)
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center p-6">
        <Spinner className="h-10 w-10 animate-spin rounded-full border-2 border-solid border-amber-600 border-t-transparent" />
      </div>
    );

  if (error)
    return (
      <ErrorFetching error={error} onRetry={() => id && getBoardById(id)} />
    );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div ref={boardRef} onMouseMove={handleMouseMove} className="relative">
        <div className="flex w-full items-start gap-6 overflow-x-auto p-6">
          {columns.map((col) => (
            <div key={col.id} className="min-w-[280px] flex-1">
              <Column {...col} boardId={id} />
            </div>
          ))}
          {isEditor && (
            <div className="min-w-[280px] flex-1">
              <AddColumn boardId={id} />
            </div>
          )}
        </div>

        <CursorOverlay cursors={cursors} currentUserId={currentUserId} />
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="rotate-2 scale-105 opacity-90">
            <Card {...activeCard} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
