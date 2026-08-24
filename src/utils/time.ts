export function pad2(n: number): string {
  return n.toString().padStart(2, '0');
}

/** mm:ss for durations under an hour, h:mm:ss otherwise */
export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) return `${h}:${pad2(m)}:${pad2(sec)}`;
  return `${m}:${pad2(sec)}`;
}

/** "2h 30m" style, for stat summaries */
export function formatHoursMinutes(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h === 0 && m === 0) return `${s}s`;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
}

/** Local YYYY-MM-DD (avoids UTC-shift bugs from toISOString) */
export function localDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = pad2(d.getMonth() + 1);
  const day = pad2(d.getDate());
  return `${y}-${m}-${day}`;
}

export function formatTimeOfDay(iso: string): string {
  const d = new Date(iso);
  let h = d.getHours();
  const m = pad2(d.getMinutes());
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  if (h === 0) h = 12;
  return `${h}:${m} ${ampm}`;
}

export function formatFriendlyDate(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

/** Monday-start week. Returns array of 7 YYYY-MM-DD keys. */
export function weekDateKeys(reference: Date = new Date()): string[] {
  const day = reference.getDay(); // 0 = Sun
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(reference);
  monday.setDate(reference.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);
  const keys: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    keys.push(localDateKey(d));
  }
  return keys;
}

export function monthDateKeys(reference: Date = new Date()): string[] {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const keys: string[] = [];
  for (let i = 1; i <= daysInMonth; i++) {
    keys.push(localDateKey(new Date(year, month, i)));
  }
  return keys;
}

export function monthKeysOfYear(year: number): string[] {
  return Array.from({ length: 12 }, (_, i) =>
    new Date(year, i, 1).toLocaleDateString(undefined, { month: 'short' })
  );
}

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
