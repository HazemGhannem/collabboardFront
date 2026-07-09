import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Card from './Card';
import Input from '../ui/Input';
import { Check, Plus, Trash2, X } from 'lucide-react';
import { ColumnProps } from '@/utils/ComponentsProps';
import { usePermissions } from '@/hooks/usePermissions';
import { useState } from 'react';
import Button from '../ui/Button';
import { useBoardSocketActions } from '@/hooks/useBoardSocketActions';

const Column = ({ _id, title, cards, boardId }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id: _id });

  const { canEditColumns, canDeleteColumns } = usePermissions();
  const { emitAddCard, emitUpdateColumn, emitDeleteColumn } =
    useBoardSocketActions(boardId);
  const [editing, setEditing] = useState(false);
  const [columnTitle, setColumnTitle] = useState(title);
  const [cardTitle, setCardTitle] = useState('');
  const handleSave = async () => {
    const value = columnTitle.trim();
    if (!value || value === title) {
      setColumnTitle(title);
      setEditing(false);
      return;
    }
    await emitUpdateColumn(_id, value);
    setEditing(false);
  };

  const handleAddCard = async () => {
    const value = cardTitle.trim();
    if (!value) return;
    await emitAddCard(_id, value);
    setCardTitle('');
  };

  const handleCancel = () => {
    setColumnTitle(title);
    setEditing(false);
  };

  const handleDelete = async () => {
    await emitDeleteColumn(_id);
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
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
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
            {title}
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
                onClick={handleDelete}
                className="flex items-center justify-center rounded-full h-[18px] w-[18px] shrink-0 transition-colors cursor-pointer text-zinc-500 hover:text-red-400"
              />
            )}
          </div>
        )}
      </div>

      <SortableContext
        id={_id}
        items={cards.map((c) => c._id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[40px]">
          {cards.map((card) => (
            <Card
              key={card._id}
              {...card}
              blur={title === 'Done'}
              columName={columnTitle}
              columId={_id}
            />
          ))}
          {canEditColumns && (
            <Input
              placeholder={title}
              Icon={Plus}
              iconSize={24}
              ButtonClick={handleAddCard}
              value={cardTitle}
              onChange={(e) => setCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddCard();
              }}
            />
          )}
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;
