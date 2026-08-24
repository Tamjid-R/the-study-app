import { useMemo } from 'react';
import { usePomodoro } from '../contexts/PomodoroContext';
import { TimerFace } from '../components/Timer/TimerFace';
import { TimerControls } from '../components/Timer/TimerControls';
import { GoalRing } from '../components/Analytics/GoalRing';
import { useSettings } from '../contexts/SettingsContext';
import { useData } from '../contexts/DataContext';
import { todayStats } from '../utils/stats';
import { formatHoursMinutes, formatTimeOfDay } from '../utils/time';
import { SESSION_TAGS } from '../types';

const TYPE_LABEL: Record<string, string> = {
  focus: 'Focus',
  short_break: 'Short Break',
  long_break: 'Long Break',
};

const TAG_TO_PILL: Record<string, string> = {
  Work: 'pill-accent',
  Study: 'pill-accent',
  Reading: 'pill-secondary',
  Writing: 'pill-secondary',
  Coding: 'pill-accent',
  Other: '',
};

export function PomodoroPage() {
  const {
    type,
    sessionName,
    setSessionName,
    sessionTag,
    setSessionTag,
    remainingSeconds,
    durationSeconds,
    isRunning,
    start,
    pause,
    reset,
    skip,
    cycleCount,
  } = usePomodoro();
  const { settings } = useSettings();
  const { pomodoroSessions } = useData();
  const today = todayStats(pomodoroSessions);

  const untilLongBreak = settings.sessionsBeforeLongBreak - (cycleCount % settings.sessionsBeforeLongBreak);

  // Recent, unique session names for lightweight autocomplete via <datalist>.
  const nameSuggestions = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (let i = pomodoroSessions.length - 1; i >= 0 && out.length < 20; i--) {
      const n = pomodoroSessions[i].name.trim();
      if (n && !seen.has(n)) {
        seen.add(n);
        out.push(n);
      }
    }
    return out;
  }, [pomodoroSessions]);

  return (
    <div className="page">
      <header className="page-header">
        <p className="page-eyebrow">Today&rsquo;s page</p>
        <h1 className="page-title">Pomodoro</h1>
        <p className="page-subtitle">
          Set a name for what you&rsquo;re working on, then begin the session. Breaks follow automatically.
        </p>
      </header>

      <div className="grid pomo-grid" style={{ alignItems: 'start' }}>
        <div className="card text-center">
          <div className="row gap-sm wrap center" style={{ maxWidth: 420, margin: '0 auto 8px' }}>
            <div className="field" style={{ flex: '1 1 220px', textAlign: 'left' }}>
              <label className="field-label" htmlFor="session-name">
                Working on
              </label>
              <input
                id="session-name"
                className="input input-underline"
                placeholder="e.g. Database Assignment"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                maxLength={80}
                list="session-name-suggestions"
                autoComplete="off"
              />
              <datalist id="session-name-suggestions">
                {nameSuggestions.map((n) => (
                  <option key={n} value={n} />
                ))}
              </datalist>
            </div>
            <div className="field" style={{ flex: '0 0 132px', textAlign: 'left' }}>
              <label className="field-label" htmlFor="session-tag">
                Tag
              </label>
              <select
                id="session-tag"
                className="select"
                value={sessionTag}
                onChange={(e) => setSessionTag(e.target.value as typeof sessionTag)}
              >
                {SESSION_TAGS.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-lg">
            <TimerFace
              remainingSeconds={remainingSeconds}
              durationSeconds={durationSeconds}
              label={TYPE_LABEL[type]}
              accentVar={type === 'focus' ? '--color-accent' : '--color-secondary'}
            />
          </div>

          <TimerControls
            isRunning={isRunning}
            onStart={start}
            onPause={pause}
            onReset={reset}
            onSkip={skip}
          />

          {type === 'focus' && (
            <p className="faint mt-md" style={{ fontSize: '0.85rem' }}>
              {untilLongBreak === settings.sessionsBeforeLongBreak
                ? `Long break after ${settings.sessionsBeforeLongBreak} focus sessions`
                : `${untilLongBreak} more focus ${untilLongBreak === 1 ? 'session' : 'sessions'} until a long break`}
            </p>
          )}
        </div>

        <div className="stack gap-md">
          <div className="card">
            <p className="card-label">Today</p>
            <div className="row between mt-sm" style={{ alignItems: 'center' }}>
              <div className="row gap-md" style={{ alignItems: 'center' }}>
                <GoalRing current={today.count} target={settings.dailyGoal} label="goal" />
                <div>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 600 }}>
                    {formatHoursMinutes(today.seconds)}
                  </p>
                  <p className="faint" style={{ fontSize: '0.8rem' }}>focused today</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <p className="card-label">Session log, today</p>
            {today.items.length === 0 ? (
              <p className="faint italic mt-sm" style={{ fontSize: '0.9rem' }}>
                No sessions completed yet today.
              </p>
            ) : (
              <div className="stack gap-sm mt-sm">
                {today.items
                  .slice()
                  .reverse()
                  .map((s) => (
                    <div key={s.id} className="row between" style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 8 }}>
                      <div>
                        <p style={{ fontSize: '0.95rem' }}>{s.name}</p>
                        <p className="faint" style={{ fontSize: '0.78rem' }}>
                          {formatTimeOfDay(s.startTime)} &middot; {s.tag ?? 'Other'}
                        </p>
                      </div>
                      <span className={`pill ${TAG_TO_PILL[s.tag ?? 'Other'] || ''}`}>
                        {Math.round(s.durationSeconds / 60)}m
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
