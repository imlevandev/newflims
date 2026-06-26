interface SectionHeaderProps {
  badge: string;
  title: string;
  description: string;
}

export function SectionHeader({
  badge,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="section-header">
      <div className="eyebrow">{badge}</div>
      <h1>{title}</h1>
      <p className="lead">{description}</p>
    </div>
  );
}
