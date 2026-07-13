'use client';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import ErrorFetching from './ErrorFetching';

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  empty: string;
  children: React.ReactNode;
  isFetching?: boolean;
  showPrev?: boolean;
  showNext?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  error?: unknown; // ← new
  onRetry?: () => void; // ← new
}

export default function Section({
  title,
  icon,
  count,
  empty,
  children,
  isFetching = false,
  showPrev = false,
  showNext = false,
  onPrev,
  onNext,
  error,
  onRetry,
}: SectionProps) {
  return (
    <section className="flex w-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-zinc-400">{icon}</span>
          <h2 className="text-sm font-medium text-white">{title}</h2>
          <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-xs text-zinc-400">
            {count}
          </span>
          {isFetching && !error && (
            <Loader2 size={13} className="animate-spin text-zinc-500" />
          )}
        </div>

        {!error && (showPrev || showNext) && (
          <div className="flex items-center gap-1">
            <button
              onClick={onPrev}
              disabled={!showPrev}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={onNext}
              disabled={!showNext}
              className="flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      {error ? (
        <ErrorFetching
          message={(error as any)?.userMessage}
          onRetry={onRetry ?? (() => {})}
        />
      ) : count === 0 ? (
        <p className="pl-1 text-sm text-zinc-500">{empty}</p>
      ) : (
        <div
          className={`grid gap-4 transition-opacity ${isFetching ? 'opacity-60' : 'opacity-100'}
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-4
          `}
        >
          {children}
        </div>
      )}
    </section>
  );
}
