import { useMemo, useState } from 'react';
import { useData } from '../contexts/DataContext';
import { StatCard } from '../components/Analytics/StatCard';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';
import { Button } from '../components/Buttons/Button';
import {
  articulateInRange,
  articulateSummary,
  articulateToday,
} from '../utils/stats';
import { formatClock, formatFriendlyDate, formatHoursMinutes, formatTimeOfDay, monthDateKeys, weekDateKeys } from '../utils/time';

export function SpeakingHistoryPage() {
  const { articulateSessions, clearArticulateHistory } = useData();
  const [confirmClear, setConfirmClear] = useState(false);

  const today = useMemo(() => articulateToday(articulateSessions), [articulateSessions]);
  const week = useMemo(() => articulateInRange(articulateSessions, weekDateKeys()), [articulateSessions]);
  const month = useMemo(() => articulateInRange(articulateSessions, monthDateKeys()), [articulateSessions]);
  const overall = useMemo(() => articulateSummary(articulateSessions), [articulateSessions]);

  const sorted = useMemo(
    () => [...articulateSessions].sort((a, b) => b.startTime.localeCompare(a.startTime)),
    [articulateSessions]
  );

  return (
    <div className="page">
      <header className="page-header">
        <p className="page-eyebrow">Practice record</p>
        <h1 className="page-title">Speaking History</h1>
        <p className="page-subtitle">Every attempt of five seconds or more, kept for your review.</p>
      </header>

      <div className="grid grid-4">
        <StatCard label="Topics attempted" value={String(overall.attempted)} sublabel={`${overall.completed} completed`} />
        <StatCard label="Total speaking time" value={formatHoursMinutes(overall.totalSeconds)} />
        <StatCard label="Average duration" value={formatClock(overall.avgSeconds)} />
        <StatCard label="Longest session" value={formatClock(overall.longest)} />
      </div>

      <div className="grid grid-3 mt-md">
        <StatCard label="Today" value={String(today.length)} sublabel={`${today.filter((s) => s.completed).length} completed`} />
        <StatCard label="This week" value={String(week.length)} sublabel={`${week.filter((s) => s.completed).length} completed`} />
        <StatCard label="This month" value={String(month.length)} sublabel={`${month.filter((s) => s.completed).length} completed`} />
      </div>

      <div className="card mt-lg">
        <div className="row between wrap gap-sm">
          <p className="card-title">Practice log</p>
          {sorted.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setConfirmClear(true)}>
              Clear log
            </Button>
          )}
        </div>

        {sorted.length === 0 ? (
          <div className="empty-state">No practice attempts yet. Head to Articulate to begin.</div>
        ) : (
          <div className="speak-log mt-sm">
            <div className="speak-log-head">
              <span>Topic</span>
              <span>Date</span>
              <span>Target</span>
              <span>Actual</span>
              <span>Status</span>
            </div>
            {sorted.map((s) => (
              <div key={s.id} className="speak-log-row">
                <span className="speak-log-topic">
                  {s.topic}
                  <span className="faint" style={{ display: 'block', fontSize: '0.75rem' }}>
                    {s.category} &middot; {formatTimeOfDay(s.startTime)}
                  </span>
                </span>
                <span data-label="Date">{formatFriendlyDate(s.date)}</span>
                <span data-label="Target">{formatClock(s.targetSeconds)}</span>
                <span data-label="Actual">{formatClock(s.actualSeconds)}</span>
                <span data-label="Status">
                  <span className={`pill ${s.completed ? 'pill-accent' : 'pill-secondary'}`}>
                    {s.completed ? 'Completed' : 'Partial'}
                  </span>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Clear speaking log?"
        description="This removes every recorded practice attempt. Your settings and Pomodoro history are not affected. This can't be undone."
        confirmLabel="Clear log"
        danger
        onCancel={() => setConfirmClear(false)}
        onConfirm={async () => {
          setConfirmClear(false);
          await clearArticulateHistory();
        }}
      />
    </div>
  );
}
