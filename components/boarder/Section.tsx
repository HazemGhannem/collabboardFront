export default function Section({
  title,
  icon,
  count,
  empty,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <span className="text-[var(--text-muted)]">{icon}</span>
        <h2 className="text-sm font-medium text-[var(--text-primary)]">
          {title}
        </h2>
        <span className="text-xs text-[var(--text-muted)] bg-[var(--surface-2)] border border-[var(--border)] rounded-full px-2 py-0.5">
          {count}
        </span>
      </div>

      {count === 0 ? (
        <p className="text-sm text-[var(--text-muted)] pl-1">{empty}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {children}
        </div>
      )}
    </div>
  );
}
