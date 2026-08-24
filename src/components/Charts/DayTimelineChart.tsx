import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { PomodoroSession } from '../../types';

interface HourBucket {
  hour: number;
  label: string;
  minutes: number;
}

function buildHourBuckets(sessions: PomodoroSession[]): HourBucket[] {
  const buckets: HourBucket[] = Array.from({ length: 24 }, (_, h) => ({
    hour: h,
    label: h === 0 ? '12a' : h < 12 ? `${h}a` : h === 12 ? '12p' : `${h - 12}p`,
    minutes: 0,
  }));
  for (const s of sessions) {
    const hour = new Date(s.startTime).getHours();
    buckets[hour].minutes += s.durationSeconds / 60;
  }
  return buckets;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d: HourBucket = payload[0].payload;
  if (d.minutes === 0) return null;
  return (
    <div
      style={{
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 6,
        padding: '10px 14px',
        boxShadow: 'var(--shadow-card-hover)',
      }}
    >
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>{d.label}</p>
      <p style={{ fontSize: '0.85rem', color: 'var(--color-ink-soft)' }}>{Math.round(d.minutes)} min focused</p>
    </div>
  );
}

export function DayTimelineChart({ sessions }: { sessions: PomodoroSession[] }) {
  const data = buildHourBuckets(sessions);
  const hasData = data.some((d) => d.minutes > 0);
  // Trim to the active window with a little padding so the chart isn't 24 empty hours.
  const firstActive = data.findIndex((d) => d.minutes > 0);
  const lastActive = [...data].reverse().findIndex((d) => d.minutes > 0);
  const start = hasData ? Math.max(0, firstActive - 1) : 6;
  const end = hasData ? Math.min(23, data.length - 1 - lastActive + 1) : 22;
  const visible = data.slice(start, end + 1);

  return (
    <div className="card">
      <p className="card-title">Today&rsquo;s rhythm</p>
      {!hasData ? (
        <div className="empty-state">Your first completed session will appear here.</div>
      ) : (
        <div style={{ width: '100%', height: 220, marginTop: 8 }}>
          <ResponsiveContainer>
            <AreaChart data={visible} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="focusFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 5" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--color-ink-faint)', fontSize: 12, fontFamily: 'var(--font-ui)' }}
                axisLine={{ stroke: 'var(--color-border-strong)' }}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="minutes"
                stroke="var(--color-accent)"
                strokeWidth={2}
                fill="url(#focusFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
