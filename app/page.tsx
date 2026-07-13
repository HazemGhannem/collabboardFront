'use client';

import BoardsCard from '@/components/home/BoardsCard';
import BoardsSkeleton from '@/components/home/BoardsSkeleton';
import Section from '@/components/home/Section';
import { useUserBoards } from '@/hooks/useUserBoards';
import { LayoutDashboard, Plus, Users } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useBoardActions } from '@/hooks/useBoardActions';

export default function Home() {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();
  const { handleDelete } = useBoardActions();

  const {
    memberBoards,
    loading,
    memberPagination,
    nextMemberPage,
    nextOwnerPage,
    ownerBoards,
    ownerFetching,
    memberFetching,
    ownerPagination,
    prevMemberPage,
    prevOwnerPage,
    isFetching,
    ownerError, 
    memberError, 
    ownerRefetch, 
    memberRefetch, 
  } = useUserBoards(4);

  const total = (memberPagination?.total ?? 0) + (ownerPagination?.total ?? 0);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-10">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-medium text-white">
            Good to see you, {user?.firstName ?? 'there'} 👋
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            {loading
              ? 'Loading boards…'
              : `${total} board${total !== 1 ? 's' : ''} total${isFetching ? ' · updating…' : ''}`}
          </p>
        </div>

        <Button
          onClick={() => router.push('/board/')}
          className="flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          icon={<Plus size={15} />}
        >
          New board
        </Button>
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      {loading ? (
        <BoardsSkeleton />
      ) : (
        <div className="flex w-full flex-col gap-10">
          {/* My Boards */}
          <Section
            title="My Boards"
            icon={<LayoutDashboard size={15} />}
            count={ownerPagination?.total ?? 0}
            empty="You haven't created any boards yet."
            isFetching={ownerFetching}
            showPrev={ownerPagination?.page > 1}
            showNext={ownerPagination?.page < ownerPagination?.totalPages}
            onPrev={prevOwnerPage}
            onNext={nextOwnerPage}
            error={ownerError}
            onRetry={ownerRefetch}
          >
            {ownerBoards.map((owner) => (
              <BoardsCard
                key={owner._id}
                board={owner.board}
                role={owner.role}
                onDelete={() => handleDelete(owner.board._id)}
              />
            ))}
          </Section>

          {/* Member Of */}
          <Section
            title="Member Of"
            icon={<Users size={15} />}
            count={memberPagination?.total ?? 0}
            empty="You haven't joined any boards yet."
            isFetching={memberFetching}
            showPrev={memberPagination?.page > 1}
            showNext={memberPagination?.page < memberPagination?.totalPages}
            onPrev={prevMemberPage}
            onNext={nextMemberPage}
            error={memberError}
            onRetry={memberRefetch}
          >
            {memberBoards.map((member) => (
              <BoardsCard
                key={member._id}
                board={member.board}
                role={member.role}
              />
            ))}
          </Section>
        </div>
      )}
    </main>
  );
}
