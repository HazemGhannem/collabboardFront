import { Clock, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
interface BoardSummary {
  _id: string;
  name: string;
  createdBy: { _id: string; firstName: string; lastName: string };
  columns: { cards: unknown[] }[];
  createdAt: string;
  role: 'owner' | 'member';
}
export default function BoardCard({
  board,
  role,
  totalCards,
  formatDate,
}: {
  board: BoardSummary;
  role: 'owner' | 'member';
  totalCards: number;
  formatDate: (iso: string) => string;
}) {
  const initials = (b: BoardSummary) =>
    `${b.createdBy.firstName[0]}${b.createdBy.lastName[0]}`.toUpperCase();

  return (
    <Link
      href={`/board/${board._id}`}
      className="group flex flex-col gap-3 p-4 rounded-xl border border-[var(--border)] bg-[var(--surface-2)] hover:border-[var(--border-accent)] hover:bg-[var(--surface-1)] transition-all"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
          <LayoutDashboard size={15} className="text-blue-500" />
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            role === 'owner'
              ? 'bg-blue-500/10 text-blue-500'
              : 'bg-[var(--surface-1)] text-[var(--text-muted)] border border-[var(--border)]'
          }`}
        >
          {role === 'owner' ? 'Owner' : 'Member'}
        </span>
      </div>

      {/* Name */}
      <div>
        <h3 className="text-sm font-medium text-[var(--text-primary)] group-hover:text-blue-500 transition-colors line-clamp-1">
          {board.name}
        </h3>
        <p className="text-xs text-[var(--text-muted)] mt-0.5">
          {board.columns.length} column{board.columns.length !== 1 ? 's' : ''} ·{' '}
          {totalCards} card{totalCards !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-[var(--border)]">
        {/* Creator avatar */}
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[9px] font-medium text-white">
            {initials(board)}
          </div>
          <span className="text-xs text-[var(--text-muted)]">
            {board.createdBy.firstName}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
          <Clock size={11} />
          {formatDate(board.createdAt)}
        </div>
      </div>
    </Link>
  );
}
