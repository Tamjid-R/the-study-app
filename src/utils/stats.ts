import { ArticulateSession, PomodoroSession } from '../types';
import { localDateKey, monthDateKeys, weekDateKeys } from './time';

export function completedFocusSessions(sessions: PomodoroSession[]): PomodoroSession[] {
  return sessions.filter((s) => s.type === 'focus' && s.completed);
}

export function sessionsOnDate(sessions: PomodoroSession[], dateKey: string): PomodoroSession[] {
  return completedFocusSessions(sessions).filter((s) => s.date === dateKey);
}

export function totalFocusSeconds(sessions: PomodoroSession[]): number {
  return completedFocusSessions(sessions).reduce((sum, s) => sum + s.durationSeconds, 0);
}

export interface DayBucket {
  dateKey: string;
  label: string;
  count: number;
  seconds: number;
}

export function bucketByDay(sessions: PomodoroSession[], dateKeys: string[], labelFn: (k: string) => string): DayBucket[] {
  const focus = completedFocusSessions(sessions);
  return dateKeys.map((dateKey) => {
    const dayItems = focus.filter((s) => s.date === dateKey);
    return {
      dateKey,
      label: labelFn(dateKey),
      count: dayItems.length,
      seconds: dayItems.reduce((sum, s) => sum + s.durationSeconds, 0),
    };
  });
}

export function todayStats(sessions: PomodoroSession[]) {
  const key = localDateKey();
  const items = sessionsOnDate(sessions, key);
  return {
    count: items.length,
    seconds: items.reduce((sum, s) => sum + s.durationSeconds, 0),
    items: items.sort((a, b) => a.startTime.localeCompare(b.startTime)),
  };
}

export function weekBuckets(sessions: PomodoroSession[], reference = new Date()) {
  const keys = weekDateKeys(reference);
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return bucketByDay(sessions, keys, (k) => labels[keys.indexOf(k)]);
}

export function monthBuckets(sessions: PomodoroSession[], reference = new Date()) {
  const keys = monthDateKeys(reference);
  return bucketByDay(sessions, keys, (k) => k.split('-')[2]);
}

export function yearBuckets(sessions: PomodoroSession[], year: number) {
  const focus = completedFocusSessions(sessions);
  const months = Array.from({ length: 12 }, (_, i) => {
    const label = new Date(year, i, 1).toLocaleDateString(undefined, { month: 'short' });
    const items = focus.filter((s) => {
      const d = new Date(s.date);
      return d.getFullYear() === year && d.getMonth() === i;
    });
    return {
      dateKey: `${year}-${String(i + 1).padStart(2, '0')}`,
      label,
      count: items.length,
      seconds: items.reduce((sum, s) => sum + s.durationSeconds, 0),
    };
  });
  return months;
}

// ---- Articulate stats ----

export function articulateToday(sessions: ArticulateSession[]) {
  const key = localDateKey();
  return sessions.filter((s) => s.date === key);
}

export function articulateInRange(sessions: ArticulateSession[], dateKeys: string[]) {
  const set = new Set(dateKeys);
  return sessions.filter((s) => set.has(s.date));
}

export function articulateSummary(sessions: ArticulateSession[]) {
  const attempted = sessions.length;
  const completed = sessions.filter((s) => s.completed).length;
  const totalSeconds = sessions.reduce((sum, s) => sum + s.actualSeconds, 0);
  const avgSeconds = attempted > 0 ? totalSeconds / attempted : 0;
  const longest = sessions.reduce((max, s) => Math.max(max, s.actualSeconds), 0);
  return { attempted, completed, totalSeconds, avgSeconds, longest };
}

// ---- Tag breakdown ----

export interface TagBreakdown {
  tag: string;
  count: number;
  seconds: number;
}

export function tagBreakdown(sessions: PomodoroSession[]): TagBreakdown[] {
  const focus = completedFocusSessions(sessions);
  const map = new Map<string, TagBreakdown>();
  for (const s of focus) {
    const tag = s.tag ?? 'Other';
    const existing = map.get(tag);
    if (existing) {
      existing.count += 1;
      existing.seconds += s.durationSeconds;
    } else {
      map.set(tag, { tag, count: 1, seconds: s.durationSeconds });
    }
  }
  return Array.from(map.values()).sort((a, b) => b.seconds - a.seconds);
}

// ---- Best time of day ----

export interface BestTimeInsight {
  hour: number;
  label: string;
  count: number;
  totalSessions: number;
}

export function bestTimeOfDay(sessions: PomodoroSession[]): BestTimeInsight | null {
  const focus = completedFocusSessions(sessions);
  if (focus.length < 3) return null; // not enough data to be meaningful
  const buckets = new Array(24).fill(0);
  for (const s of focus) {
    buckets[new Date(s.startTime).getHours()] += 1;
  }
  let bestHour = 0;
  for (let h = 1; h < 24; h++) {
    if (buckets[h] > buckets[bestHour]) bestHour = h;
  }
  if (buckets[bestHour] === 0) return null;
  const formatHour = (h: number) => {
    const end = (h + 1) % 24;
    const fmt = (x: number) => {
      const ampm = x >= 12 ? 'PM' : 'AM';
      const h12 = x % 12 === 0 ? 12 : x % 12;
      return `${h12}${ampm}`;
    };
    return `${fmt(h)}\u2013${fmt(end)}`;
  };
  return {
    hour: bestHour,
    label: formatHour(bestHour),
    count: buckets[bestHour],
    totalSessions: focus.length,
  };
}

// ---- Heatmap (GitHub-style contribution grid) ----

export interface HeatmapDay {
  dateKey: string;
  count: number;
  seconds: number;
}

/** One entry per day of the given year, Jan 1 through Dec 31. */
export function yearHeatmap(sessions: PomodoroSession[], year: number): HeatmapDay[] {
  const focus = completedFocusSessions(sessions);
  const byDate = new Map<string, { count: number; seconds: number }>();
  for (const s of focus) {
    if (!s.date.startsWith(String(year))) continue;
    const existing = byDate.get(s.date);
    if (existing) {
      existing.count += 1;
      existing.seconds += s.durationSeconds;
    } else {
      byDate.set(s.date, { count: 1, seconds: s.durationSeconds });
    }
  }
  const days: HeatmapDay[] = [];
  const start = new Date(year, 0, 1);
  const end = new Date(year, 11, 31);
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = localDateKey(d);
    const entry = byDate.get(key);
    days.push({ dateKey: key, count: entry?.count ?? 0, seconds: entry?.seconds ?? 0 });
  }
  return days;
}
