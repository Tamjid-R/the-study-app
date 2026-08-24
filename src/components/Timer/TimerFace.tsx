import { formatClock } from '../../utils/time';

interface Props {
  remainingSeconds: number;
  durationSeconds: number;
  label: string;
  accentVar?: string;
}

const SIZE = 280;
const STROKE = 6;
const RADIUS = (SIZE - STROKE) / 2 - 14;
const CIRC = 2 * Math.PI * RADIUS;

export function TimerFace({ remainingSeconds, durationSeconds, label, accentVar = '--color-accent' }: Props) {
  const progress = durationSeconds > 0 ? 1 - remainingSeconds / durationSeconds : 0;
  const dashOffset = CIRC * (1 - Math.min(1, Math.max(0, progress)));
  const ticks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE, margin: '0 auto' }}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* tick marks like an old library clock */}
        {ticks.map((i) => {
          const isMajor = i % 5 === 0;
          const angle = (i / 60) * 2 * Math.PI - Math.PI / 2;
          const outer = SIZE / 2 - 4;
          const inner = outer - (isMajor ? 10 : 5);
          const cx = SIZE / 2;
          const cy = SIZE / 2;
          return (
            <line
              key={i}
              x1={cx + outer * Math.cos(angle)}
              y1={cy + outer * Math.sin(angle)}
              x2={cx + inner * Math.cos(angle)}
              y2={cy + inner * Math.sin(angle)}
              stroke="var(--color-border-strong)"
              strokeWidth={isMajor ? 1.6 : 1}
            />
          );
        })}
        {/* base ring */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={STROKE}
        />
        {/* progress ring */}
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={`var(${accentVar})`}
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={CIRC}
          strokeDashoffset={dashOffset}
          transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          style={{ transition: 'stroke-dashoffset 0.3s linear' }}
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
        <span className="pill pill-accent" style={{ marginBottom: 12 }}>{label}</span>
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2.6rem, 9vw, 3.4rem)',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 600,
          }}
        >
          {formatClock(remainingSeconds)}
        </span>
      </div>
    </div>
  );
}
