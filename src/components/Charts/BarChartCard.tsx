import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { DayBucket } from '../../utils/stats';
import { formatFriendlyDate, formatHoursMinutes } from '../../utils/time';

interface Props {
  data: DayBucket[];
  title: string;
  dateStyle?: 'friendly' | 'raw';
  barColorVar?: string;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const d: DayBucket = payload[0].payload;
  return (
    <div
      style={{
        background: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border-strong)',
        borderRadius: 6,
        padding: '10px 14px',
        boxShadow: 'var(--shadow-card-hover)',
        fontFamily: 'var(--font-body)',
      }}
    >
      <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, marginBottom: 4 }}>
        {formatFriendlyDate(d.dateKey)}
      </p>
      <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-soft)' }}>
        {d.count} {d.count === 1 ? 'pomodoro' : 'pomodoros'}
      </p>
      <p style={{ fontSize: '0.88rem', color: 'var(--color-ink-soft)' }}>
        {formatHoursMinutes(d.seconds)} focused
      </p>
    </div>
  );
}

export function BarChartCard({ data, title }: Props) {
  const hasData = data.some((d) => d.count > 0);
  return (
    <div className="card">
      <p className="card-title">{title}</p>
      {!hasData ? (
        <div className="empty-state">No sessions recorded for this period yet.</div>
      ) : (
        <div style={{ width: '100%', height: 260, marginTop: 8 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 5" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="label"
                tick={{ fill: 'var(--color-ink-faint)', fontSize: 12, fontFamily: 'var(--font-ui)' }}
                axisLine={{ stroke: 'var(--color-border-strong)' }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fill: 'var(--color-ink-faint)', fontSize: 12, fontFamily: 'var(--font-ui)' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--color-accent-soft)', opacity: 0.4 }} />
              <Bar dataKey="count" fill="var(--color-accent)" radius={[3, 3, 0, 0]} maxBarSize={44} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
