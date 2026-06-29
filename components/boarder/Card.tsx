import { CardProps } from '@/utils/ComponentsProps';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const Card = ({
  id,
  title,
  category,
  color,
  user,
  coumId,
  blur = false,
}: CardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`h-40 rounded-lg  bg-zinc-800 p-4 transition cursor-grab active:cursor-grabbing touch-none
        ${blur ? 'opacity-50' : ''} ${coumId === 'inprogress' ? `${color.borderColor} border-l-4` : ''}
        ${isDragging ? 'opacity-30 border border-dashed border-zinc-600' : ''}
      `}
    >
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between">
          <h3 className="font-medium text-white">{title}</h3>
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
