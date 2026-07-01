'use client';
import { Kanban, Settings } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  title?: string;
  status?: string;
  href?: string;
}

const COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-500',
  'bg-lime-500',
  'bg-emerald-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-sky-500',
  'bg-blue-500',
  'bg-indigo-500',
  'bg-violet-500',
  'bg-fuchsia-500',
  'bg-pink-500',
];

const users = [
  {
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    firstName: 'Test',
    lastName: 'Doe',
  },
  {
    firstName: 'Bow',
    lastName: 'Doe',
  },
];

export default function NavBar({
  title = 'Sprint 12',
  status = 'Public',
  href = '/',
}: NavbarProps) {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const handleNavigation = () => {
    router.push('/login');
  };

  return (
    <nav className="mx-4 mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e6f4f5] bg-zinc-800 p-4 shadow-sm">
      <a href={href} className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-800">
          <Kanban size={20} />
        </div>
        {user && (
          <>
            <div className="min-w-0">
              <h1 className="truncate font-semibold text-white">{title}</h1>
            </div>
            <span className="hidden rounded-full border border-zinc-700 bg-zinc-800 px-3 py-1 text-xs text-zinc-300 sm:block">
              {status}
            </span>
          </>
        )}
      </a>

      {user && (
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {users.map((user, index) => (
              <div
                key={`${user.firstName}-${user.lastName}`}
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-zinc-900 text-sm font-semibold text-white ${COLORS[index % COLORS.length]}`}
              >
                {user.firstName[0]}
                {user.lastName[0]}
              </div>
            ))}
          </div>

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
