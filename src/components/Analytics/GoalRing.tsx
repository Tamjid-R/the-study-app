interface Props {
  current: number;
  target: number;
  size?: number;
  stroke?: number;
  label?: string;
}

export function GoalRing({ current, target, size = 88, stroke = 8, label }: Props) {
  const radius = (size - stroke) / 2;
  const circ = 2 * Math.PI * radius;
  const pct = target > 0 ? Math.min(1, current / target) : 0;
  const offset = circ * (1 - pct);
  const met = target > 0 && current >= target;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={met ? 'var(--color-secondary)' : 'var(--color-accent)'}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 0.4s ease' }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: size * 0.24 }}>
          {current}/{target}
        </span>
        {label && (
          <span className="faint" style={{ fontSize: size * 0.11, marginTop: 2 }}>
            {label}
          </span>
        )}
      </div>
    </div>
  );
}
