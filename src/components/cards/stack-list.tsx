interface StackListProps {
  title: string;
  items: string[];
}

export function StackList({ title, items }: StackListProps) {
  return (
    <section className="panel list-card">
      <h2>{title}</h2>
      <ul className="plain-list">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
