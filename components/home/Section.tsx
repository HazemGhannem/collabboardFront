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
    <section className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-[var(--text-muted)]">{icon}</span>

        <h2 className="text-sm font-medium text-[var(--text-primary)]">
          {title}
        </h2>

        <span className="rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-0.5 text-xs text-[var(--text-muted)]">
          {count}
        </span>
      </div>

      {count === 0 ? (
        <p className="pl-1 text-sm text-[var(--text-muted)]">{empty}</p>
      ) : (
        <div className="w-full">{children}</div>
      )}
    </section>
  );
}
