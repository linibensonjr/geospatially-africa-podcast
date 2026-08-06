/** Large serif number in rust with a small caption below, used in stat rows. */
export function StatTile({
  value,
  label
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div>
      <p className="font-display text-4xl text-rust sm:text-5xl">{value}</p>
      <p className="mt-2 text-sm text-ink-secondary">{label}</p>
    </div>
  );
}
