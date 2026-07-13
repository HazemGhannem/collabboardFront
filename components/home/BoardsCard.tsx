import { COLORS, getColorIndexForUser } from '@/utils/utils';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import Button from '../ui/Button';

export interface BoardSummary {
  _id: string;
  name: string;
  createdBy: { _id: string; firstName: string; lastName: string };
  columns: { cards: unknown[] }[];
  createdAt: string;
}

function initialsOf(firstName: string, lastName: string) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function totalCards(board: BoardSummary) {
  return board.columns.reduce((acc, col) => acc + col.cards.length, 0);
}

interface BoardCardProps {
  board: BoardSummary;
  role: string;
  onDelete?: () => void;
}

export default function BoardsCard({ board, role, onDelete }: BoardCardProps) {
  const roleHandler = () => {
    if (role === 'owner') return 'bg-blue-600/15 text-blue-400';
    if (role === 'editor') return 'bg-emerald-600/15 text-emerald-400';
    if (role === 'viewer') return 'bg-zinc-800 text-zinc-400';
  };

  const colorIndex = getColorIndexForUser(board.createdBy._id);
  const router = useRouter();

  const handleNavigation = () => {
    router.push(`/board/${board._id}`);
  };

  const onDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.();
  };

  return (
    <div
      className="group flex flex-col gap-3 rounded-xl bg-zinc-900 p-4 transition-colors hover:bg-zinc-800 cursor-pointer relative"
      onClick={handleNavigation}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white line-clamp-1">{board.name}</h3>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${COLORS[colorIndex]}`}
          title={`${board.createdBy.firstName} ${board.createdBy.lastName}`}
        >
          {initialsOf(board.createdBy.firstName, board.createdBy.lastName)}
        </span>
      </div>

      <div className="flex items-center gap-3 text-xs text-zinc-400">
        <span>{totalCards(board)} cards</span>
        <span>·</span>
        <span>{formatDate(board.createdAt)}</span>
      </div>

      <div className="mt-1 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${roleHandler()}`}
          >
            {role}
          </span>

          {role === 'owner' && (
            <Button
              onClick={onDeleteClick}
              className="rounded p-1 text-zinc-500 hover:bg-zinc-800 hover:text-red-400 transition-colors cursor-pointer"
              title="Delete board"
              icon={<Trash2 size={14} />}
            />
          )}
        </div>

        <span className="text-xs text-zinc-500 opacity-0 transition-opacity group-hover:opacity-100">
          Open →
        </span>
      </div>
    </div>
  );
}
