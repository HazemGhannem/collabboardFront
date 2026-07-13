export default function BoardsSkeleton() {
  return (
    <div className="flex w-full flex-col gap-10">
      <SkeletonSection cardCount={3} />
      <SkeletonSection cardCount={2} />
    </div>
  );
}

function SkeletonSection({ cardCount }: { cardCount: number }) {
  return (
    <section className="flex w-full flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 animate-pulse rounded bg-zinc-800" />
        <div className="h-4 w-24 animate-pulse rounded bg-zinc-800" />
        <div className="h-5 w-6 animate-pulse rounded-full bg-zinc-900" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: cardCount }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-zinc-900 p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-800" />
        <div className="h-7 w-7 shrink-0 animate-pulse rounded-full bg-zinc-800" />
      </div>
      <div className="flex items-center gap-3">
        <div className="h-3 w-14 animate-pulse rounded bg-zinc-800" />
        <div className="h-3 w-16 animate-pulse rounded bg-zinc-800" />
      </div>
      <div className="mt-1 flex items-center justify-between">
        <div className="h-4 w-12 animate-pulse rounded-full bg-zinc-800" />
        <div className="h-3 w-10 animate-pulse rounded bg-zinc-800" />
      </div>
    </div>
  );
}
