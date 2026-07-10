'use client';

import BoardsCard from '@/components/home/BoardsCard';
import BoardsSkeleton from '@/components/home/BoardsSkeleton';
import Section from '@/components/home/Section';
import { useUserBoards } from '@/hooks/useUserBoards';
import { LayoutDashboard, Plus, Users } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import HorizontalScroller from '@/components/home/HorizontalScroller';

export default function Home() {
  const user = useAppSelector((s) => s.auth.user);
  const router = useRouter();

  const handleNavigation = () => {
    router.push(`/board/`);
  };
  const {
    goToMemberPage,
    goToOwnerPage,
    memberBoards,
    memberError,
    loading,
    memberPagination,
    nextMemberPage,
    nextOwnerPage,
    ownerBoards,
    ownerError,
    ownerFetching,
    memberFetching,
    ownerPagination,
    prevMemberPage,
    prevOwnerPage,
    isFetching,
  } = useUserBoards(4);
  const total = memberPagination.total + ownerPagination?.total;
  console.log(ownerPagination);
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-4 py-10 w-full">
      <div className="flex items-center justify-between">
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
          onClick={handleNavigation}
          className="flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          icon={<Plus />}
        >
          New board
        </Button>
      </div>

      {loading ? (
        <BoardsSkeleton />
      ) : (
        <div className="w-full">
          <Section
            title="My Boards"
            icon={<LayoutDashboard size={15} />}
            count={ownerPagination.total}
            empty="You haven't created any boards yet."
          >
            <HorizontalScroller
              onNext={nextOwnerPage}
              onPrev={prevOwnerPage}
              isFetching={ownerFetching}
              showArrowsRight={
                ownerPagination.page < ownerPagination.totalPages
              }
              showArrowsLeft={ownerPagination.page > 1}
            >
              {ownerBoards.map((owner) => (
                <div
                  key={owner._id}
                  className="shrink-0 snap-start"
                  style={{ flexBasis: 'calc((100% - 3 * 1rem) / 4)' }}
                >
                  <BoardsCard board={owner.board} role={owner.role} />
                </div>
              ))}
            </HorizontalScroller>
          </Section>

          <Section
            title="Member Of"
            icon={<Users size={15} />}
            count={memberPagination.total}
            empty="You haven't joined any boards yet."
          >
            <HorizontalScroller
              onNext={nextMemberPage}
              onPrev={prevMemberPage}
              isFetching={memberFetching}
              showArrowsRight={
                memberPagination.page < memberPagination.totalPages
              }
              showArrowsLeft={memberPagination.page > 1}
            >
              {memberBoards.map((member) => (
                <div
                  key={member._id}
                  className="shrink-0 snap-start"
                  style={{ flexBasis: 'calc((100% - 3 * 1rem) / 4)' }}
                >
                  <BoardsCard board={member.board} role={member.role} />
                </div>
              ))}
            </HorizontalScroller>
          </Section>
        </div>
      )}
    </main>
  );
}
