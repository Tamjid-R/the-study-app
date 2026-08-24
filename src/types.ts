// Core domain types for the application

export type SessionType = 'focus' | 'short_break' | 'long_break';

export type SessionTag = 'Work' | 'Study' | 'Reading' | 'Writing' | 'Coding' | 'Other';

export const SESSION_TAGS: SessionTag[] = ['Work', 'Study', 'Reading', 'Writing', 'Coding', 'Other'];

export interface PomodoroSession {
  id: string;
  name: string;
  tag: SessionTag;
  type: SessionType;
  date: string; // YYYY-MM-DD (local)
  startTime: string; // ISO timestamp
  endTime: string; // ISO timestamp
  durationSeconds: number; // actual elapsed
  targetSeconds: number; // planned duration
  completed: boolean; // reached zero without being reset/skipped early
}

export interface ArticulateSession {
  id: string;
  topic: string;
  category: string;
  date: string; // YYYY-MM-DD (local)
  startTime: string; // ISO timestamp
  targetSeconds: number;
  actualSeconds: number;
  completed: boolean; // actual >= target
}

export type ThemeName =
  | 'parchment'
  | 'midnight-library'
  | 'forest-study'
  | 'sepia-ink'
  | 'noir-orchid'
  | 'blue-hour'
  | 'neobrutalist'
  | 'panelpop'
  | 'dark-fantasy'
  | 'vintage-vibe'
  | 'level-up-academy';

export const THEME_NAMES: ThemeName[] = [
  'parchment',
  'midnight-library',
  'forest-study',
  'sepia-ink',
  'noir-orchid',
  'blue-hour',
  'neobrutalist',
  'panelpop',
  'dark-fantasy',
  'vintage-vibe',
  'level-up-academy',
];

export type FontName = 'garamond' | 'baskerville' | 'georgia' | 'spectral';

export type Density = 'comfortable' | 'compact';

export interface AppSettings {
  focusMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  sessionsBeforeLongBreak: number;
  articulateSeconds: number;
  autoStartNext: boolean;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  theme: ThemeName;
  font: FontName;
  density: Density;
  dailyGoal: number; // target completed focus pomodoros per day
}

export const DEFAULT_SETTINGS: AppSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  sessionsBeforeLongBreak: 4,
  articulateSeconds: 60,
  autoStartNext: false,
  soundEnabled: true,
  notificationsEnabled: false,
  theme: 'parchment',
  font: 'garamond',
  density: 'comfortable',
  dailyGoal: 6,
};

export interface ExportBundle {
  version: 1;
  exportedAt: string;
  settings: AppSettings;
  pomodoroSessions: PomodoroSession[];
  articulateSessions: ArticulateSession[];
}
