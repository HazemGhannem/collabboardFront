'use client';

import { useState } from 'react';
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
import { CardProps, ColumnData } from '@/utils/ComponentsProps';

const INITIAL_COLUMNS: ColumnData[] = [
  {
    id: 'todo',
    title: 'To Do',
    cards: [
      {
        id: 'card-1',
        title: 'Task 1',
        category: 'Design',
        color: {
          textColor: 'text-orange-500',
          bgColor: 'bg-orange-500',
          borderColor: 'border-l-orange-500',
        },
        user: 'AG',
      },
    ],
  },
  {
    id: 'inprogress',
    title: 'In Progress',
    cards: [
      {
        id: 'card-2',
        title: 'Task 2',
        category: 'Dev',
        color: {
          textColor: 'text-blue-500',
          bgColor: 'bg-blue-500',
          borderColor: 'border-l-blue-500',
        },
        user: 'AG',
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    cards: [
      {
        id: 'card-3',
        title: 'Task 6',
        category: 'QA',
        color: {
          textColor: 'text-green-500',
          bgColor: 'bg-green-500',
          borderColor: 'border-l-green-500',
        },
        user: 'AG',
      },
    ],
  },
];

// Find which column a card belongs to
function findColumnOfCard(columns: ColumnData[], cardId: string) {
  return columns.find((col) => col.cards.some((c) => c.id === cardId));
}

export default function Board() {
  const [columns, setColumns] = useState<ColumnData[]>(INITIAL_COLUMNS);
  const [activeCard, setActiveCard] = useState<CardProps | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require 5px movement before drag starts — prevents misfire on click
      activationConstraint: { distance: 5 },
    }),
  );

  const onDragStart = ({ active }: DragStartEvent) => {
    const col = findColumnOfCard(columns, active.id as string);
    const card = col?.cards.find((c) => c.id === active.id);
    if (card) setActiveCard(card);
  };

  const onDragOver = ({ active, over }: DragOverEvent) => {
    if (!over) return;

    const activeColId = findColumnOfCard(columns, active.id as string)?.id;
    // over.id can be a column id or a card id
    const overColId =
      columns.find((c) => c.id === over.id)?.id ??
      findColumnOfCard(columns, over.id as string)?.id;

    if (!activeColId || !overColId || activeColId === overColId) return;

    // Move card to new column immediately for smooth visual feedback
    setColumns((prev) => {
      const activeCol = prev.find((c) => c.id === activeColId)!;
      const overCol = prev.find((c) => c.id === overColId)!;
      const card = activeCol.cards.find((c) => c.id === active.id)!;

      const overIndex = overCol.cards.findIndex((c) => c.id === over.id);
      const insertAt = overIndex >= 0 ? overIndex : overCol.cards.length;

      return prev.map((col) => {
        if (col.id === activeColId) {
          return { ...col, cards: col.cards.filter((c) => c.id !== active.id) };
        }
        if (col.id === overColId) {
          const newCards = [...col.cards];
          newCards.splice(insertAt, 0, card);
          return { ...col, cards: newCards };
        }
        return col;
      });
    });
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveCard(null);
    if (!over) return;

    const activeColId = findColumnOfCard(columns, active.id as string)?.id;
    const overColId =
      columns.find((c) => c.id === over.id)?.id ??
      findColumnOfCard(columns, over.id as string)?.id;

    if (!activeColId || !overColId) return;

    // Same column — reorder
    if (activeColId === overColId) {
      setColumns((prev) =>
        prev.map((col) => {
          if (col.id !== activeColId) return col;
          const oldIndex = col.cards.findIndex((c) => c.id === active.id);
          const newIndex = col.cards.findIndex((c) => c.id === over.id);
          return { ...col, cards: arrayMove(col.cards, oldIndex, newIndex) };
        }),
      );
    }

    // TODO: emit socket event here when Socket.IO is wired
    // socket.emit('card:move', { boardId, cardId: active.id, fromColumnId: activeColId, toColumnId: overColId })
  };

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

      {/* Ghost card that follows the cursor while dragging */}
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
