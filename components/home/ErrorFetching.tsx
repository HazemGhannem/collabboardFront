'use client';

import { RefreshCw } from 'lucide-react';
import Button from '../ui/Button';

interface ErrorFetchingProps {
  message?: string;
  onRetry: () => void;
}

export default function ErrorFetching({
  message,
  onRetry,
}: ErrorFetchingProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 py-8 text-center">
      <p className="text-sm text-zinc-400">
        {message ?? "Couldn't load your boards."}
      </p>
      <Button
        onClick={onRetry}
        className="flex items-center gap-2 rounded-lg bg-zinc-800 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-zinc-700"
        icon={<RefreshCw size={13} />}
      >
        Retry
      </Button>
    </div>
  );
}
