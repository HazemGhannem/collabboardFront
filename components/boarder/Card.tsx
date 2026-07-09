'use client';

import { useBoardSocketActions } from '@/hooks/useBoardSocketActions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { deleteCard } from '@/store/slices/boardSlice';
import { usePermissions } from '@/hooks/usePermissions';
import { CardProps } from '@/utils/ComponentsProps';
import { COLORS, getCategoryColor, getColorIndexForUser } from '@/utils/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

const Card = ({
  _id,
  title,
  category,
  color,
  assigneeId,
  columName,
  blur = false,
  columId,
}: CardProps) => {
  const { isEditor } = usePermissions();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: _id, disabled: !isEditor });
  const dispatch = useAppDispatch();
  // board.board is the IBoardData itself (already unwrapped) — not board.board.board
  const boardId = useAppSelector((s) => s.board.board?.board._id);
  const onlineUsers = useAppSelector((s) => s.board.onlineUsers);
  const { emitDeleteCard } = useBoardSocketActions(boardId);

  const defaultColor = getCategoryColor(category ?? '');
  // assigneeId can be either the populated user object or a raw id string
  const assignee =
    assigneeId && typeof assigneeId === 'object' ? assigneeId : null;
  const assigneeIdString =
    typeof assigneeId === 'string' ? assigneeId : assignee?._id;

  const isAssigneeOnline = onlineUsers.some(
    (u) => u.userId === assigneeIdString,
  );

  const resolvedColor =
    isAssigneeOnline && assigneeIdString
      ? {
          bgColor: COLORS[getColorIndexForUser(assigneeIdString)],
          textColor: defaultColor.textColor,
          borderColor: defaultColor.borderColor,
        }
      : (color ?? defaultColor);

  const initials = assignee
    ? `${assignee.firstName?.[0] ?? ''}${assignee.lastName?.[0] ?? ''}`
    : '';
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!columId || !boardId) return;
    dispatch(deleteCard({ columnId: columId, cardId: _id }));
    emitDeleteCard(columId, _id);
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
        ${columName === 'In Progress' ? `${resolvedColor.borderColor} border-l-4` : ''}
        ${isDragging ? 'opacity-30 border border-dashed border-zinc-600' : ''}
      `}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <div
            {...(isEditor ? attributes : {})}
            {...(isEditor ? listeners : {})}
            className={`flex items-center gap-2 flex-1 ${
              isEditor ? 'cursor-grab active:cursor-grabbing touch-none' : ''
            }`}
          >
            {isEditor && (
              <GripVertical size={16} className="text-zinc-500 shrink-0" />
            )}
            <h3 className="font-medium text-white">{title}</h3>
          </div>

          {isEditor && (
            <X
              size={16}
              className="text-zinc-400 hover:text-white cursor-pointer shrink-0 ml-2"
              onClick={handleDelete}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <span
            className={`rounded-full bg-[#e1f5ee] px-2 py-1 text-xs ${defaultColor.textColor}`}
          >
            {category}
          </span>
          {isEditor && assigneeIdString && (
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold text-white transition-colors ${resolvedColor.bgColor}`}
              title={
                assignee
                  ? `${assignee.firstName} ${assignee.lastName}${isAssigneeOnline ? ' (online)' : ' (offline)'}`
                  : ''
              }
            >
              {initials}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
