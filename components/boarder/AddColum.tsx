'use client';

import { useState } from 'react';
import { Check, Plus, X } from 'lucide-react';
import Input from '../ui/Input';
import { useBoardActions } from '@/hooks/useBoardActions';

interface AddColumnProps {
  boardId:string
}

export default function AddColumn({ boardId }: AddColumnProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const { addColumToBoarder } = useBoardActions();
  const handleAdd = async () => {
    const value = name.trim();
    if (!value) return;

    await addColumToBoarder(boardId, value);
    setName('');
    setEditing(false);
  };

  return (
    <div className="rounded-xl bg-zinc-900 p-4">
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-white">
          {editing ? 'New Column' : 'Add Column'}
        </h2>
        {!editing && (
          <span className="flex items-center border h-[18px] w-[22px] rounded-full justify-center bg-[#a1a1aa] font-semibold text-[13px] text-[#232326]">
            <Plus size={14} />
          </span>
        )}
      </div>

      {!editing ? (
        <button
          onClick={() => setEditing(true)}
          className="flex w-full items-center justify-center gap-2 rounded-lg py-3 min-h-[40px] text-zinc-400 border border-dashed border-zinc-700 transition hover:bg-zinc-800 hover:text-white hover:border-zinc-500"
        >
          <Plus size={18} />
          <span className="font-medium">Add Column</span>
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <Input
            autoFocus
            placeholder="Column name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAdd();
              if (e.key === 'Escape') {
                setEditing(false);
                setName('');
              }
            }}
            Icon={Plus}
            iconSize={24}
            ButtonClick={handleAdd}
          />
        </div>
      )}
    </div>
  );
}
