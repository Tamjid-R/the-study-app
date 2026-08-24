import { useMemo, useState } from 'react';
import { HeatmapDay } from '../../utils/stats';
import { formatFriendlyDate, formatHoursMinutes } from '../../utils/time';

interface Props {
  days: HeatmapDay[];
  year: number;
}

const WEEKDAY_ROWS = ['Mon', '', 'Wed', '', 'Fri', '', ''];

function levelFor(count: number, max: number): number {
  if (count === 0 || max === 0) return 0;
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}

export function HeatmapCalendar({ days, year }: Props) {
  const [hovered, setHovered] = useState<HeatmapDay | null>(null);

  const { weeks, maxCount } = useMemo(() => {
    if (days.length === 0) return { weeks: [] as (HeatmapDay | null)[][], maxCount: 0 };
    const max = days.reduce((m, d) => Math.max(m, d.count), 0);

    // Pad so the grid starts on a Monday.
    const firstDate = new Date(days[0].dateKey);
    const firstWeekday = (firstDate.getDay() + 6) % 7; // 0 = Monday
    const padded: (HeatmapDay | null)[] = [
      ...Array.from({ length: firstWeekday }, () => null),
      ...days,
    ];
    const cols: (HeatmapDay | null)[][] = [];
    for (let i = 0; i < padded.length; i += 7) {
      cols.push(padded.slice(i, i + 7));
    }
    return { weeks: cols, maxCount: max };
  }, [days]);

  const monthLabels = useMemo(() => {
    const labels: { weekIndex: number; label: string }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstReal = week.find((d) => d !== null);
      if (!firstReal) return;
      const month = new Date(firstReal.dateKey).getMonth();
      if (month !== lastMonth) {
        labels.push({ weekIndex: i, label: new Date(firstReal.dateKey).toLocaleDateString(undefined, { month: 'short' }) });
        lastMonth = month;
      }
    });
    return labels;
  }, [weeks]);

  return (
    <div className="card">
      <div className="row between wrap">
        <p className="card-title">{year} focus heatmap</p>
        <div className="row gap-xs" style={{ fontSize: '0.72rem', color: 'var(--color-ink-faint)' }}>
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <span
              key={lvl}
              className="heatmap-cell"
              data-level={lvl}
              style={{ width: 11, height: 11 }}
            />
          ))}
          <span>More</span>
        </div>
      </div>

      <div className="heatmap-scroll mt-sm">
        <div className="heatmap-months">
          {monthLabels.map((m) => (
            <span key={m.weekIndex} style={{ gridColumnStart: m.weekIndex + 2 }}>
              {m.label}
            </span>
          ))}
        </div>
        <div className="heatmap-grid">
          <div className="heatmap-weekday-labels">
            {WEEKDAY_ROWS.map((label, i) => (
              <span key={i}>{label}</span>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="heatmap-col">
              {week.map((day, di) =>
                day ? (
                  <span
                    key={di}
                    className="heatmap-cell"
                    data-level={levelFor(day.count, maxCount)}
                    onMouseEnter={() => setHovered(day)}
                    onMouseLeave={() => setHovered((h) => (h?.dateKey === day.dateKey ? null : h))}
                    onFocus={() => setHovered(day)}
                    tabIndex={day.count > 0 ? 0 : -1}
                    role="img"
                    aria-label={`${formatFriendlyDate(day.dateKey)}: ${day.count} pomodoros, ${formatHoursMinutes(day.seconds)}`}
                  />
                ) : (
                  <span key={di} className="heatmap-cell heatmap-cell-empty" />
                )
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-sm" style={{ minHeight: 20, fontSize: '0.85rem' }}>
        {hovered ? (
          <span>
            <strong>{formatFriendlyDate(hovered.dateKey)}</strong> &middot; {hovered.count}{' '}
            {hovered.count === 1 ? 'pomodoro' : 'pomodoros'} &middot; {formatHoursMinutes(hovered.seconds)}
          </span>
        ) : (
          <span className="faint italic">Hover or focus a day to see details.</span>
        )}
      </div>
    </div>
  );
}
