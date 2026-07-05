'use client';

import { useBoardSocket } from '@/hooks/useBoardSocket';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteCard } from '@/store/slices/boardSlice';
import { IBoard } from '@/types/type';
import { CardProps } from '@/utils/ComponentsProps';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

const Card = ({
  id,
  title,
  category,
  color,
  user,
  columName,
  blur = false,
  columId,
}: CardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  const dispatch = useAppDispatch();

  const boardId = useAppSelector((s) => (s.board.board as IBoard)?.data?._id);
  const { emitDeleteCard } = useBoardSocket(boardId);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    if (!columId || !boardId) return;
    dispatch(deleteCard({ columnId: columId, cardId: id }));
    emitDeleteCard(columId, id);
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`h-40 rounded-lg bg-zinc-800 p-4 transition
        ${blur ? 'opacity-50' : ''}
        ${columName === 'In Progress' ? `${color.borderColor} border-l-4` : ''}
        ${isDragging ? 'opacity-30 border border-dashed border-zinc-600' : ''}
      `}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          {/* Drag handle — only this triggers drag, not the whole card */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing touch-none flex items-center gap-2 flex-1"
          >
            <GripVertical size={16} className="text-zinc-500 shrink-0" />
            <h3 className="font-medium text-white">{title}</h3>
          </div>

          {/* Delete — stopPropagation keeps drag listeners from swallowing it */}
          <X
            size={16}
            className="text-zinc-400 hover:text-white cursor-pointer shrink-0 ml-2"
            onClick={handleDelete}
          />
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`rounded-full bg-[#e1f5ee] px-2 py-1 text-xs ${color.textColor}`}
          >
            {category}
          </span>
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white ${color.bgColor}`}
          >
            {user}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
