'use client';

import { useEffect, useRef, useState } from 'react';
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
import { type CardProps, type ColumnData } from '@/utils/ComponentsProps';
import { useBoardActions } from '@/hooks/useBoardActions';
import { useBoardSocket } from '@/hooks/useBoardSocket';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setColumns } from '@/store/slices/boardSlice';
import { useParams } from 'next/navigation';
import Spinner from '../ui/Spinner';
import ErrorFetching from '../error/ErrorFetching';

// ─── Category → Tailwind color map ───────────────────────────────────────────

const CATEGORY_COLORS: Record<
  string,
  { textColor: string; bgColor: string; borderColor: string }
> = {
  Design: {
    textColor: 'text-orange-500',
    bgColor: 'bg-orange-500',
    borderColor: 'border-l-orange-500',
  },
  Dev: {
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-500',
    borderColor: 'border-l-blue-500',
  },
  QA: {
    textColor: 'text-green-500',
    bgColor: 'bg-green-500',
    borderColor: 'border-l-green-500',
  },
  Backend: {
    textColor: 'text-purple-500',
    bgColor: 'bg-purple-500',
    borderColor: 'border-l-purple-500',
  },
  Frontend: {
    textColor: 'text-cyan-500',
    bgColor: 'bg-cyan-500',
    borderColor: 'border-l-cyan-500',
  },
  Auth: {
    textColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    borderColor: 'border-l-yellow-500',
  },
  Default: {
    textColor: 'text-gray-500',
    bgColor: 'bg-gray-500',
    borderColor: 'border-l-gray-500',
  },
};

function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Default;
}

function findColumnOfCard(columns: ColumnData[], cardId: string) {
  return columns.find((col) => col.cards.some((c) => c.id === cardId));
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Board() {
  const [activeCard, setActiveCard] = useState<CardProps | null>(null);

  // Captures the original column at drag start — by the time onDragEnd fires,
  // Redux has already been mutated optimistically so findColumnOfCard is unreliable
  const dragFromColRef = useRef<string | null>(null);

  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { getBoardById, loading, error, board } = useBoardActions();
  const columns = useAppSelector((s) => s.board.columns);

  // ← Only socket system — no socketRef, no io() in this file
  const { emitMoveCard } = useBoardSocket(id);

  // ── Fetch board on mount ────────────────────────────────────────────────────

  useEffect(() => {
    if (!id) return;
    getBoardById(id);
  }, [id]);

  // ── Map API response → Redux columns ───────────────────────────────────────

  useEffect(() => {
    if (!board?.data?.columns) return;
    dispatch(
      setColumns(
        board.data.columns.map((col: any) => ({
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
  }, [board]);

  // ── DnD ────────────────────────────────────────────────────────────────────

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onDragStart = ({ active }: DragStartEvent) => {
    const col = findColumnOfCard(columns, active.id as string);
    const card = col?.cards.find((c) => c.id === active.id);
    dragFromColRef.current = col?.id ?? null;
    if (card) setActiveCard(card);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

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
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null);
    if (!over) return;

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
  };

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
      <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
        {columns.map((col) => (
          <Column key={col.id} {...col} />
        ))}
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="rotate-2 scale-105 opacity-90">
            <Card {...activeCard}  />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}
