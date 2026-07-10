export default function BoardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-[104px] animate-pulse rounded-xl bg-zinc-900"
        />
      ))}
    </div>
  );
}
