import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Card from './Card';
import Input from '../ui/Input';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { ColumnProps } from '@/utils/ComponentsProps';
import { useBoardActions } from '@/hooks/useBoardActions';
import { usePermissions } from '@/hooks/usePermissions';
import { useState } from 'react';
import Button from '../ui/Button';

const Column = ({ id, name, cards, boardId }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });
  const { updateColumnTitle, deleteColumFromBoarder, loading } =
    useBoardActions();
  const { canEditColumns, canDeleteColumns } = usePermissions();

  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(name);

  const handleSave = async () => {
    const value = title.trim();
    if (!value || value === name) {
      setTitle(name);
      setEditing(false);
      return;
    }
    await updateColumnTitle(boardId, id, value);
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(name);
    setEditing(false);
  };

  const handleDelete = async () => {
    await deleteColumFromBoarder(boardId, id);
  };

  return (
    <div
      className={`rounded-xl p-4 transition-colors ${
        isOver ? 'bg-zinc-700' : 'bg-zinc-900'
      }`}
    >
      <div className="flex justify-between mb-4 items-center gap-2">
        {editing ? (
          <div className="flex flex-1 items-center gap-1">
            <Input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              className="flex-1 rounded bg-zinc-800 px-2 py-1 text-sm font-semibold text-white outline-none ring-1 ring-zinc-600 focus:ring-blue-500"
              Icon2={Check}
              ButtonClick2={handleSave}
              Icon={X}
              ButtonClick={handleCancel}
              iconSize={16}
            />
          </div>
        ) : (
          <h2
            onClick={() => canEditColumns && setEditing(true)}
            className={`font-semibold text-white ${
              canEditColumns
                ? 'cursor-pointer hover:text-zinc-300'
                : 'cursor-default'
            }`}
            title={canEditColumns ? 'Click to rename' : undefined}
          >
            {name}
          </h2>
        )}

        {!editing && (
          <div className="flex items-center gap-1.5">
            <span className="flex items-center border h-[18px] w-[22px] rounded-full justify-center bg-[#a1a1aa] font-semibold text-[13px] text-[#232326]">
              {cards.length}
            </span>

            {canDeleteColumns && (
              <Button
                icon={<Trash2 size={12} />}
                loading={loading}
                onClick={handleDelete}
                className="flex items-center justify-center rounded-full h-[18px] w-[18px] shrink-0 transition-colors cursor-pointer text-zinc-500 hover:text-red-400"
              />
            )}
          </div>
        )}
      </div>

      <SortableContext
        id={id}
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[40px]">
          {cards.map((card) => (
            <Card
              key={card.id}
              {...card}
              blur={name === 'Done'}
              columName={name}
              columId={id}
            />
          ))}
          {canEditColumns && (
            <Input placeholder={name} Icon={Plus} iconSize={24} />
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;
