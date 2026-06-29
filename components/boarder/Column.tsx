import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Card from './Card';
import Input from '../ui/Input';
import { Plus } from 'lucide-react';

interface CardData {
  id: string;
  title: string;
  category: string;
  color: { bgColor: String; textColor: string };
  user: string;
  blur?: boolean;
}

interface ColumnProps {
  id: string;
  title: string;
  cards: CardData[];
}

const Column = ({ id, title, cards }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      className={`rounded-xl p-4 transition-colors ${
        isOver ? 'bg-zinc-700' : 'bg-zinc-900'
      }`}
    >
      <div className="flex justify-between mb-4">
        <h2 className="font-semibold text-white">{title}</h2>
        <span className="flex items-center border h-[18px] w-[22px] rounded-full justify-center bg-[#a1a1aa] font-semibold text-[13px] text-[#232326]">
          {cards.length}
        </span>
      </div>

      <SortableContext
        id={id}
        items={cards.map((c) => c.id)}
        strategy={verticalListSortingStrategy}
      >
        <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[40px]">
          {cards.map((card) => (
            <Card key={card.id} {...card} blur={title === 'Done'} />
          ))}
          <Input placeholder={title} Icon={Plus} iconSize={24} />
        </div>
      </SortableContext>
    </div>
  );
};

export default Column;
