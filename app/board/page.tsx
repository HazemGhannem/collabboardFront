'use client';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCollabBoardForm } from '@/hooks/useCollabboarform';
import { Kanban } from 'lucide-react';

export default function Home() {
  const {
    boardName,
    setBoardName,
    joinValue,
    setJoinValue,
    canCreate,
    canJoin,
    handleCreate,
    handleJoin,
    memberError,
  } = useCollabBoardForm();
  // console.log(memberError);
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
            placeholder="Paste a board link or ID"
          />
          <Button
            className="board-btn "
            onClick={handleJoin}
            disabled={!canJoin}
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}
