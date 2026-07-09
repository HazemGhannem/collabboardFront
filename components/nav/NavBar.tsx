'use client';
import { Kanban, Settings } from 'lucide-react';
import Button from '../ui/Button';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useAppSelector } from '@/store/hooks';
import InviteDropdown from '../inviteDropdown/InviteDropdown';
import { useBoardActions } from '@/hooks/useBoardActions';
import { usePermissions } from '@/hooks/usePermissions';
import { COLORS, getColorIndexForUser } from '@/utils/utils';

interface NavbarProps {
  title?: string;
  status?: string;
  href?: string;
}

export default function NavBar({ status = 'Public', href = '/' }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();
  const { logout } = useAuthActions();
  const { board } = useBoardActions();
  const { isEditor } = usePermissions();

  const { user } = useAppSelector((s) => s.auth);
  const onlineUsers = useAppSelector((s) => s.board.onlineUsers);
  const isBoardPage = pathname.startsWith('/board/');
  const capitalize = (text: string) =>
    text.charAt(0).toUpperCase() + text.slice(1);
  const handleNavigation = () => {
    router.push('/login');
  };

  return (
    <nav className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e6f4f5] bg-zinc-800 p-4 shadow-sm">
      <a href={href} className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
          <Kanban size={20} />
        </div>
        {isBoardPage && board && user && (
          <>
            <div className="min-w-0">
              <h1 className="truncate font-semibold text-white">
                {capitalize(board.name)}
              </h1>
            </div>
            <span className="hidden rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300 sm:block">
              {status}
            </span>
          </>
        )}
      </a>
      {/* Right */}

      {user && (
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {/* Presence avatars */}

            {isBoardPage &&
              isEditor &&
              onlineUsers.map((u) => (
                <div
                  key={u.userId}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900 text-sm font-semibold text-white ${COLORS[getColorIndexForUser(u.userId)]}`}
                  title={`${u.firstName} ${u.lastName}`}
                >
                  {u.firstName[0]}
                  {u.lastName[0]}
                </div>
              ))}
          </div>
          {/* Invite button — only on board pages */}
          {isBoardPage && isEditor && <InviteDropdown boardId={id} />}

          <Button
            className="rounded-md bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700 sm:px-4"
            onClick={logout}
          >
            <div className="flex items-center gap-2">
              <Settings size={18} />
              <span className="hidden sm:inline">Logout</span>
            </div>
          </Button>
        </div>
      )}
      {!user && (
        <Button
          className="rounded-md bg-blue-600 px-3 py-2 text-white transition-colors hover:bg-blue-700 sm:px-4"
          onClick={handleNavigation}
        >
          <div className="flex items-center gap-2">
            <Settings size={18} />
            <span className="hidden sm:inline">Login</span>
          </div>
        </Button>
      )}
    </nav>
  );
}
