'use client';
import AddColumn from '@/components/boarder/AddColum';
import Card from '@/components/boarder/Card';
import Column from '@/components/boarder/Column';
import CursorOverlay from '@/components/boarder/CursorOverlay';
import ErrorFetching from '@/components/error/ErrorFetching';
import Spinner from '@/components/ui/Spinner';
import { useBoardActions } from '@/hooks/useBoardActions';
import { useBoardDnd } from '@/hooks/useBoardDnd';
import { useBoardSocket } from '@/hooks/useBoardSocket';
import { useBoardSocketActions } from '@/hooks/useBoardSocketActions';
import { usePermissions } from '@/hooks/usePermissions';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setColumns } from '@/store/slices/boardSlice';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { useParams } from 'next/navigation';
import { useCallback, useRef } from 'react';

const Page = () => {
  const { isEditor } = usePermissions();
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  // ← passes id, React Query fetches automatically — no useEffect needed
  const { refetch, loading, error } = useBoardActions(id);

  const columns = useAppSelector((s) => s.board.columns);
  const currentUserId = useAppSelector((s) => s.auth.user?._id);
  const { cursors } = useBoardSocket(id);
  const { emitCursorMove, emitMoveCard } = useBoardSocketActions(id);

  const { sensors, activeCard, onDragStart, onDragOver, onDragEnd } =
    useBoardDnd({
      columns,
      isEditor,
      setColumns: (next) => dispatch(setColumns(next)),
      emitMoveCard,
    });

  const boardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isEditor) return;
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;
      emitCursorMove(e.clientX - rect.left, e.clientY - rect.top);
    },
    [isEditor, emitCursorMove],
  );

  if (loading)
    return (
      <div className="flex min-h-[50vh] w-full items-center justify-center p-6">
        <Spinner className="h-10 w-10 animate-spin rounded-full border-2 border-solid border-amber-600 border-t-transparent" />
      </div>
    );

  if (error) return <ErrorFetching error={error} onRetry={() => refetch()} />;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      <div
        ref={boardRef}
        onMouseMove={handleMouseMove}
        className="relative w-full h-[calc(100vh-100px)] overflow-x-auto overflow-y-hidden"
      >
        <div className="flex items-start gap-6 p-6 min-w-max h-full">
          {columns.map((col) => (
            <div key={col._id} className="w-[280px] shrink-0">
              <Column {...col} boardId={id} />
            </div>
          ))}
          {isEditor && (
            <div className="w-[280px] shrink-0">
              <AddColumn boardId={id} />
            </div>
          )}
        </div>
        <CursorOverlay cursors={cursors} currentUserId={currentUserId} />
      </div>

      <DragOverlay>
        {activeCard && (
          <div className="rotate-2 scale-105 opacity-90">
            <Card {...activeCard} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
};

export default Page;
