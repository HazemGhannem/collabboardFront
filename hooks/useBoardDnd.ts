'use client';

import { useCallback, useRef, useState } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import {
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
} from '@dnd-kit/core';
import type { IColumn, ICard } from '@/types/type';

interface UseBoardDndArgs {
  columns: IColumn[];
  isEditor: boolean;
  setColumns: (columns: IColumn[]) => void;
  emitMoveCard: (payload: {
    cardId: string;
    fromColumnId: string;
    toColumnId: string;
    toIndex: number;
  }) => void;
}

function findColumnOfCard(columns: IColumn[], cardId: string) {
  return columns.find((col) => col.cards.some((c) => c._id === cardId));
}

export function useBoardDnd({
  columns,
  isEditor,
  setColumns,
  emitMoveCard,
}: UseBoardDndArgs) {
  const [activeCard, setActiveCard] = useState<ICard | null>(null);
  const dragFromColRef = useRef<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onDragStart = useCallback(
    ({ active }: DragStartEvent) => {
      if (!isEditor) return;
      const col = findColumnOfCard(columns, active.id as string);
      const card = col?.cards.find((c) => c._id === active.id);
      dragFromColRef.current = col?._id ?? null;
      if (card) setActiveCard(card);
    },
    [isEditor, columns],
  );

  const onDragOver = useCallback(
    ({ active, over }: DragOverEvent) => {
      if (!isEditor || !over) return;

      const fromCol = findColumnOfCard(columns, active.id as string);
      const toCol =
        columns.find((c) => c._id === over.id) ??
        findColumnOfCard(columns, over.id as string);

      if (!fromCol || !toCol || fromCol._id === toCol._id) return;

      const overCardIndex = toCol.cards.findIndex((c) => c._id === over.id);
      const toIndex = overCardIndex >= 0 ? overCardIndex : toCol.cards.length;
      const card = fromCol.cards.find((c) => c._id === active.id)!;

      setColumns(
        columns.map((col) => {
          if (col._id === fromCol._id)
            return {
              ...col,
              cards: col.cards.filter((c) => c._id !== active.id),
            };
          if (col._id === toCol._id) {
            const newCards = [...col.cards];
            newCards.splice(toIndex, 0, card);
            return { ...col, cards: newCards };
          }
          return col;
        }),
      );
    },
    [isEditor, columns, setColumns],
  );

  const onDragEnd = useCallback(
    ({ active, over }: DragEndEvent) => {
      setActiveCard(null);
      if (!isEditor || !over) return;

      const fromColId = dragFromColRef.current;
      dragFromColRef.current = null;

      const toCol =
        columns.find((c) => c._id === over.id) ??
        findColumnOfCard(columns, over.id as string);

      if (!fromColId || !toCol) return;

      // Same column — reorder
      if (fromColId === toCol._id) {
        const oldIndex = toCol.cards.findIndex((c) => c._id === active.id);
        const newIndex = toCol.cards.findIndex((c) => c._id === over.id);
        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          setColumns(
            columns.map((col) =>
              col._id === toCol._id
                ? { ...col, cards: arrayMove(col.cards, oldIndex, newIndex) }
                : col,
            ),
          );
        }
      }

      const toIndex = toCol.cards.findIndex((c) => c._id === over.id);

      emitMoveCard({
        cardId: active.id as string,
        fromColumnId: fromColId,
        toColumnId: toCol._id,
        toIndex: toIndex >= 0 ? toIndex : toCol.cards.length,
      });
    },
    [isEditor, columns, setColumns, emitMoveCard],
  );

  return { sensors, activeCard, onDragStart, onDragOver, onDragEnd };
}
