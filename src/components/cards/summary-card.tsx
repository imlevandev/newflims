interface SummaryCardProps {
  label: string;
  value: string;
  note: string;
}

export function SummaryCard({ label, value, note }: SummaryCardProps) {
  return (
    <article className="panel summary-card">
      <div className="eyebrow">{label}</div>
      <strong>{value}</strong>
      <p className="muted">{note}</p>
    </article>
  );
}
