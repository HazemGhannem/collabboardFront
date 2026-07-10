'use client';

import { useState } from 'react';
import { Copy, Check, UserPlus } from 'lucide-react';
import Button from '../ui/Button';
import { useMemberActions } from '@/hooks/useMemberActions';

interface InviteDropdownProps {
  boardId: string;
}

export default function InviteDropdown({ boardId }: InviteDropdownProps) {
  const [open, setOpen] = useState(false);
  const [role, setRole] = useState<'viewer' | 'editor'>('viewer');
  const [inviteCode, setInviteCode] = useState('');
  const [inviteLink, setinviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const { createInvite, error, loading } = useMemberActions();
  const generateCode = async () => {
    const { code, inviteLink } = await createInvite(boardId, role);

    if (code && inviteLink) {
      setInviteCode(code);
      setinviteLink(inviteLink);
      setCopied(false);
    }
  };

  const copy = async () => {
    if (!inviteCode) return;

    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Unable to copy invite code.');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center cursor-pointer gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 text-sm text-zinc-300 transition hover:bg-zinc-700 hover:text-white"
      >
        <UserPlus size={15} />
        <span className="hidden sm:block ">Invite</span>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-zinc-700 bg-zinc-900 p-4 shadow-xl">
          <h3 className="mb-4 text-sm font-semibold text-white">
            Invite Member
          </h3>

          <label className="mb-1 block text-xs text-zinc-400">Permission</label>

          <select
            value={role}
            onChange={(e) => {
              setRole(e.target.value as 'viewer' | 'editor');
              setInviteCode('');
              setinviteLink('');
            }}
            className="mb-4 w-full rounded-lg border cursor-pointer border-zinc-700 bg-zinc-800 px-3 py-2 text-white"
          >
            <option value="viewer" className="cursor-pointer">
              Viewer
            </option>
            <option value="editor" className="cursor-pointer">
              Editor
            </option>
          </select>

          <Button
            onClick={generateCode}
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 cursor-pointer text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate Invite Code'}
          </Button>

          {inviteCode && (
            <div className="mt-4">
              <label className="mb-1 block text-xs text-zinc-400">
                Invite Code
              </label>

              <div className="flex gap-2">
                <input
                  readOnly
                  value={inviteCode}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                />

                <Button
                  onClick={copy}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 hover:bg-zinc-800"
                >
                  {copied ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <Copy size={18} />
                  )}
                </Button>
              </div>
            </div>
          )}
          {inviteLink && (
            <div className="mt-4">
              <label className="mb-1 block text-xs text-zinc-400">
                Invite Code
              </label>

              <div className="flex gap-2">
                <input
                  readOnly
                  value={inviteLink}
                  className="flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white"
                />

                <Button
                  onClick={copy}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 hover:bg-zinc-800"
                >
                  {copied ? (
                    <Check size={18} className="text-green-400" />
                  ) : (
                    <Copy size={18} />
                  )}
                </Button>
              </div>
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-400">{error.data.error}</p>}
        </div>
      )}
    </div>
  );
}
