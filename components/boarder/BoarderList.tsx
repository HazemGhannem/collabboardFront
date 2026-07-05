'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Plus, Users, Loader2 } from 'lucide-react';
import BoardCard from './BoardCard';
import Section from './Section';

interface BoardSummary {
  _id: string;
  name: string;
  createdBy: { _id: string; firstName: string; lastName: string };
  columns: { cards: unknown[] }[];
  createdAt: string;
  role: 'owner' | 'member';
}

export default function BorderList() {
  const authLoading = false;
  const token = 'false';
  const user = { firstName: 'hello', _id: 'azeaze' };
  const router = useRouter();
  const MOCK_BOARDS: BoardSummary[] = [
    {
      _id: '1',
      name: 'CollabBoard — Sprint 1',
      createdBy: {
        _id: '123',
        firstName: 'Hazem',
        lastName: 'Ghannem',
      },
      columns: [{ cards: [{}, {}, {}] }, { cards: [{}, {}] }, { cards: [{}] }],
      createdAt: '2026-06-01T10:00:00.000Z',
      role: 'owner',
    },
    {
      _id: '2',
      name: 'TalentMatch — Feature Planning',
      createdBy: {
        _id: '123',
        firstName: 'Hazem',
        lastName: 'Ghannem',
      },
      columns: [{ cards: [{}, {}] }, { cards: [{}] }, { cards: [] }],
      createdAt: '2026-06-15T08:30:00.000Z',
      role: 'owner',
    },
    {
      _id: '3',
      name: 'Design System',
      createdBy: {
        _id: user?._id ?? '6a44f77d2b044e7b8459160a',
        firstName: 'Hazem',
        lastName: 'Ghannem',
      },
      columns: [{ cards: [] }, { cards: [] }, { cards: [] }],
      createdAt: '2026-06-28T14:00:00.000Z',
      role: 'owner',
    },
    {
      _id: '4',
      name: 'Marketing Q3 Roadmap',
      createdBy: { _id: 'other-1', firstName: 'Sara', lastName: 'Ahmed' },
      columns: [
        { cards: [{}, {}, {}, {}] },
        { cards: [{}, {}] },
        { cards: [{}, {}, {}] },
      ],
      createdAt: '2026-05-20T09:00:00.000Z',
      role: 'member',
    },
    {
      _id: '5',
      name: 'Backend API — v2',
      createdBy: { _id: 'other-2', firstName: 'Omar', lastName: 'Ben Ali' },
      columns: [{ cards: [{}] }, { cards: [{}, {}] }, { cards: [] }],
      createdAt: '2026-06-10T11:00:00.000Z',
      role: 'member',
    },
  ];
  const [boards, setBoards] = useState<BoardSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading]);

  useEffect(() => {
    if (!user) return;
    // Simulate network delay
    setTimeout(() => {
      setBoards(MOCK_BOARDS);
      setLoading(false);
    }, 800);
  }, [user]);
  const handleCreate = async () => {
    if (!newName.trim() || !token) return;
    setCreating(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/boards`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ name: newName.trim() }),
        },
      );
      const board = await res.json();
      router.push(`/board/${board._id}`);
    } finally {
      setCreating(false);
    }
  };

  const myBoards = boards.filter((b) => b.createdBy._id === user?._id);
  const memberBoards = boards.filter((b) => b.createdBy._id !== user?._id);

  const totalCards = (board: BoardSummary) =>
    board.columns.reduce((acc, col) => acc + col.cards.length, 0);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  if (authLoading || loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <Loader2 size={20} className="animate-spin text-[var(--text-muted)]" />
      </div>
    );
  }

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-[var(--text-primary)]">
            Good to see you, {user?.firstName} 👋
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">
            {boards.length} board{boards.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setShowForm((p) => !p)}
          className="h-9 px-4 flex items-center gap-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition-colors"
        >
          <Plus size={15} />
          New board
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div className="flex gap-2">
          <input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Board name..."
            className="flex-1 h-9 px-3 text-sm rounded-lg border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-accent)] transition-colors"
          />
          <button
            onClick={handleCreate}
            disabled={!newName.trim() || creating}
            className="h-9 px-4 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 transition-colors"
          >
            {creating ? 'Creating...' : 'Create'}
          </button>
          <button
            onClick={() => {
              setShowForm(false);
              setNewName('');
            }}
            className="h-9 px-4 text-sm rounded-lg border border-[var(--border)] text-[var(--text-muted)] hover:bg-[var(--surface-2)] transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* My boards */}
      <Section
        title="My Boards"
        icon={<LayoutDashboard size={15} />}
        count={myBoards.length}
        empty="You haven't created any boards yet."
      >
        {myBoards.map((board) => (
          <BoardCard
            key={board._id}
            board={board}
            role="owner"
            totalCards={totalCards(board)}
            formatDate={formatDate}
          />
        ))}
      </Section>

      {/* Member boards */}
      <Section
        title="Member Of"
        icon={<Users size={15} />}
        count={memberBoards.length}
        empty="You haven't joined any boards yet."
      >
        {memberBoards.map((board) => (
          <BoardCard
            key={board._id}
            board={board}
            role="member"
            totalCards={totalCards(board)}
            formatDate={formatDate}
          />
        ))}
      </Section>
    </main>
  );
}
