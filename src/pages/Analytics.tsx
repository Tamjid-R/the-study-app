import { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { StatCard } from '../components/Analytics/StatCard';
import { BarChartCard } from '../components/Charts/BarChartCard';
import { DayTimelineChart } from '../components/Charts/DayTimelineChart';
import { HeatmapCalendar } from '../components/Analytics/HeatmapCalendar';
import {
  bestTimeOfDay,
  monthBuckets,
  tagBreakdown,
  todayStats,
  totalFocusSeconds,
  weekBuckets,
  yearBuckets,
  yearHeatmap,
  articulateToday,
} from '../utils/stats';
import { formatHoursMinutes, formatTimeOfDay } from '../utils/time';

type Range = 'overview' | 'today' | 'week' | 'month' | 'year';

const RANGES: { key: Range; label: string }[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'today', label: 'Today' },
  { key: 'week', label: 'Week' },
  { key: 'month', label: 'Month' },
  { key: 'year', label: 'Year' },
];

const TAG_COLORS = ['var(--color-accent)', 'var(--color-secondary)', 'var(--color-gold)'];

export function AnalyticsPage() {
  const { pomodoroSessions, articulateSessions } = useData();
  const [range, setRange] = useState<Range>('overview');
  const year = new Date().getFullYear();

  const today = useMemo(() => todayStats(pomodoroSessions), [pomodoroSessions]);
  const articulateTodayItems = useMemo(() => articulateToday(articulateSessions), [articulateSessions]);
  const week = useMemo(() => weekBuckets(pomodoroSessions), [pomodoroSessions]);
  const month = useMemo(() => monthBuckets(pomodoroSessions), [pomodoroSessions]);
  const yearData = useMemo(() => yearBuckets(pomodoroSessions, year), [pomodoroSessions, year]);
  const heatmapDays = useMemo(() => yearHeatmap(pomodoroSessions, year), [pomodoroSessions, year]);
  const allTimeSeconds = useMemo(() => totalFocusSeconds(pomodoroSessions), [pomodoroSessions]);
  const bestTime = useMemo(() => bestTimeOfDay(pomodoroSessions), [pomodoroSessions]);
  const tags = useMemo(() => tagBreakdown(pomodoroSessions), [pomodoroSessions]);

  const weekTotal = week.reduce((sum, d) => sum + d.count, 0);
  const weekSeconds = week.reduce((sum, d) => sum + d.seconds, 0);
  const monthTotal = month.reduce((sum, d) => sum + d.count, 0);
  const monthSeconds = month.reduce((sum, d) => sum + d.seconds, 0);
  const yearTotal = yearData.reduce((sum, d) => sum + d.count, 0);
  const yearSeconds = yearData.reduce((sum, d) => sum + d.seconds, 0);
  const maxTagSeconds = tags.reduce((m, t) => Math.max(m, t.seconds), 0);

  return (
    <div className="page">
      <header className="page-header">
        <p className="page-eyebrow">The ledger</p>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">A record of focused time, drawn from every completed Pomodoro.</p>
      </header>

      <div className="btn-row" role="tablist" aria-label="Time range">
        {RANGES.map((r) => (
          <button
            key={r.key}
            role="tab"
            aria-selected={range === r.key}
            className={`pill ${range === r.key ? 'pill-accent' : ''}`}
            style={{ cursor: 'pointer', border: range === r.key ? undefined : '1px solid var(--color-border-strong)', minHeight: 38, padding: '6px 16px' }}
            onClick={() => setRange(r.key)}
          >
            {r.label}
          </button>
        ))}
      </div>

      <div className="mt-md">
        {range === 'overview' && (
          <>
            <div className="grid grid-3">
              <StatCard label="Focused today" value={formatHoursMinutes(today.seconds)} sublabel={`${today.count} pomodoros`} />
              <StatCard
                label="Practiced today"
                value={String(articulateTodayItems.length)}
                sublabel={`${articulateTodayItems.filter((s) => s.completed).length} completed topics`}
              />
              <StatCard label="All-time focused" value={formatHoursMinutes(allTimeSeconds)} />
            </div>

            {bestTime && (
              <div className="card mt-md">
                <p className="card-title">Best time of day</p>
                <p className="mt-sm">
                  You&rsquo;re most productive around <strong>{bestTime.label}</strong> &mdash; {bestTime.count} of your{' '}
                  {bestTime.totalSessions} completed sessions started in that hour.
                </p>
              </div>
            )}

            <div className="mt-md">
              <HeatmapCalendar days={heatmapDays} year={year} />
            </div>

            {tags.length > 0 && (
              <div className="card mt-md">
                <p className="card-title">Time by tag</p>
                <div className="stack gap-sm mt-sm">
                  {tags.map((t, i) => (
                    <div key={t.tag}>
                      <div className="row between" style={{ fontSize: '0.88rem', marginBottom: 4 }}>
                        <span>{t.tag}</span>
                        <span className="faint">{formatHoursMinutes(t.seconds)} &middot; {t.count}x</span>
                      </div>
                      <div style={{ height: 8, borderRadius: 4, background: 'var(--color-bg-alt)', overflow: 'hidden' }}>
                        <div
                          style={{
                            height: '100%',
                            width: `${maxTagSeconds > 0 ? (t.seconds / maxTagSeconds) * 100 : 0}%`,
                            background: TAG_COLORS[i % TAG_COLORS.length],
                            borderRadius: 4,
                            transition: 'width 0.4s ease',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {range === 'today' && (
          <>
            <div className="grid grid-3">
              <StatCard label="Completed today" value={String(today.count)} />
              <StatCard label="Focused today" value={formatHoursMinutes(today.seconds)} />
              <StatCard label="All-time focused" value={formatHoursMinutes(allTimeSeconds)} />
            </div>
            <div className="mt-md">
              <DayTimelineChart sessions={today.items} />
            </div>
            <div className="card mt-md">
              <p className="card-title">Timeline</p>
              {today.items.length === 0 ? (
                <div className="empty-state">Nothing logged yet today.</div>
              ) : (
                <div className="stack gap-sm mt-sm">
                  {today.items.map((s) => (
                    <div key={s.id} className="row between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
                      <div>
                        <p style={{ fontSize: '0.95rem' }}>{s.name}</p>
                        <p className="faint" style={{ fontSize: '0.78rem' }}>{formatTimeOfDay(s.startTime)}</p>
                      </div>
                      <span className="pill pill-accent">{Math.round(s.durationSeconds / 60)}m</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {range === 'week' && (
          <>
            <div className="grid grid-2">
              <StatCard label="Pomodoros this week" value={String(weekTotal)} />
              <StatCard label="Focused this week" value={formatHoursMinutes(weekSeconds)} />
            </div>
            <div className="mt-md">
              <BarChartCard data={week} title="Monday through Sunday" />
            </div>
          </>
        )}

        {range === 'month' && (
          <>
            <div className="grid grid-2">
              <StatCard label="Pomodoros this month" value={String(monthTotal)} />
              <StatCard label="Focused this month" value={formatHoursMinutes(monthSeconds)} />
            </div>
            <div className="mt-md">
              <BarChartCard data={month} title="Every day this month" />
            </div>
          </>
        )}

        {range === 'year' && (
          <>
            <div className="grid grid-2">
              <StatCard label={`Pomodoros in ${year}`} value={String(yearTotal)} />
              <StatCard label={`Focused in ${year}`} value={formatHoursMinutes(yearSeconds)} />
            </div>
            <div className="mt-md">
              <BarChartCard data={yearData} title={`${year} overview`} />
            </div>
            <div className="mt-md">
              <HeatmapCalendar days={heatmapDays} year={year} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
