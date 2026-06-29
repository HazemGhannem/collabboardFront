'use client';

import { useCollabBoardForm } from '@/hooks/useCollabboarform';
import { Kanban } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface LandingProps {
  onCreate: (boardName: string) => void;
  onJoin: (boardLinkOrId: string) => void;
}

export default function Landing({ onCreate, onJoin }: LandingProps) {
  const {
    boardName,
    setBoardName,
    joinValue,
    setJoinValue,
    canCreate,
    handleCreate,
    handleJoin,
  } = useCollabBoardForm({ onCreate, onJoin, defaultBoardName: 'Sprint 12' });

  return (
    <div className="board-card">
      <div className="board-content">
        <div className="board-icon">
          <Kanban size={24} />
        </div>

        <h1 className="board-title">CollabBoard</h1>
        <p className="board-subtitle">
          A shared board for your team. No account needed to join — just share
          the link.
        </p>

        <div className="board-row">
          <Input
            className="board-input"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Board name"
          />
          <Button
            className="board-btn"
            onClick={handleCreate}
            disabled={!canCreate}
          >
            Create board
          </Button>
        </div>

        <div className="board-divider">
          <span className="board-divider-text">or join an existing one</span>
        </div>

        <div className="board-row">
          <Input
            className="board-input"
            value={joinValue}
            onChange={(e) => setJoinValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            placeholder="Paste a board link or ID"
          />
          <Button
            className="board-btn "
            onClick={handleJoin}
            disabled={!canCreate}
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}
