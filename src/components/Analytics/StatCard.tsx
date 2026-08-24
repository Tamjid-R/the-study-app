interface Props {
  label: string;
  value: string;
  sublabel?: string;
}

export function StatCard({ label, value, sublabel }: Props) {
  return (
    <div className="card">
      <p className="card-label">{label}</p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.9rem', fontWeight: 600, marginTop: 6 }}>
        {value}
      </p>
      {sublabel && <p className="faint" style={{ fontSize: '0.85rem', marginTop: 2 }}>{sublabel}</p>}
    </div>
  );
}
