import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react';
import { SessionTag, SessionType } from '../types';
import { useSettings } from './SettingsContext';
import { useData } from './DataContext';
import { localDateKey } from '../utils/time';
import { maybeNotify, playChime } from '../utils/sound';

const STORAGE_KEY = 'pomodoro-active-timer-v1';

interface PersistedState {
  type: SessionType;
  sessionName: string;
  sessionTag: SessionTag;
  cycleCount: number; // completed focus sessions since last long break
  durationSeconds: number;
  isRunning: boolean;
  endTimestamp: number | null; // ms epoch, only meaningful if isRunning
  pausedRemainingSeconds: number;
  runStartISO: string | null; // when the *current run* started (for record start time)
  sessionStartISO: string | null; // when this session (type) first began, across pauses
}

function loadPersisted(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
}

function savePersisted(s: PersistedState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}

interface PomodoroContextValue {
  type: SessionType;
  sessionName: string;
  setSessionName: (name: string) => void;
  sessionTag: SessionTag;
  setSessionTag: (tag: SessionTag) => void;
  cycleCount: number;
  remainingSeconds: number;
  durationSeconds: number;
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
  skip: () => void;
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null);

function durationFor(type: SessionType, s: { focusMinutes: number; shortBreakMinutes: number; longBreakMinutes: number }) {
  if (type === 'focus') return s.focusMinutes * 60;
  if (type === 'short_break') return s.shortBreakMinutes * 60;
  return s.longBreakMinutes * 60;
}

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const { addPomodoroSession } = useData();

  const initial = loadPersisted();
  const [type, setType] = useState<SessionType>(initial?.type ?? 'focus');
  const [sessionName, setSessionNameState] = useState(initial?.sessionName ?? '');
  const [sessionTag, setSessionTagState] = useState<SessionTag>(initial?.sessionTag ?? 'Study');
  const [cycleCount, setCycleCount] = useState(initial?.cycleCount ?? 0);
  const [durationSeconds, setDurationSecondsState] = useState(
    initial?.durationSeconds ?? durationFor(initial?.type ?? 'focus', settings)
  );
  const [isRunning, setIsRunning] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(
    initial ? Math.max(0, Math.round(initial.pausedRemainingSeconds)) : durationFor('focus', settings)
  );

  const endTimestampRef = useRef<number | null>(initial?.isRunning ? initial.endTimestamp : null);
  const pausedRemainingRef = useRef<number>(initial?.pausedRemainingSeconds ?? durationSeconds);
  const runStartRef = useRef<string | null>(initial?.isRunning ? initial.runStartISO : null);
  const sessionStartRef = useRef<string | null>(initial?.sessionStartISO ?? null);
  const intervalRef = useRef<number | null>(null);
  const completingRef = useRef(false);

  const persist = useCallback((overrides: Partial<PersistedState> = {}) => {
    savePersisted({
      type,
      sessionName,
      sessionTag,
      cycleCount,
      durationSeconds,
      isRunning,
      endTimestamp: endTimestampRef.current,
      pausedRemainingSeconds: pausedRemainingRef.current,
      runStartISO: runStartRef.current,
      sessionStartISO: sessionStartRef.current,
      ...overrides,
    });
  }, [type, sessionName, sessionTag, cycleCount, durationSeconds, isRunning]);

  const clearInt = () => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // If timer was running when the page was closed/refreshed, resume ticking
  // from the persisted absolute end timestamp so no time is lost.
  useEffect(() => {
    if (initial?.isRunning && initial.endTimestamp) {
      setIsRunning(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const finalizeCurrentAsRecord = useCallback(
    (completed: boolean, actualSeconds: number) => {
      if (type !== 'focus') return; // only focus sessions count toward stats
      if (!sessionStartRef.current) return;
      if (actualSeconds < 1) return;
      const now = new Date();
      addPomodoroSession({
        name: sessionName.trim() || 'Untitled session',
        tag: sessionTag,
        type,
        date: localDateKey(new Date(sessionStartRef.current)),
        startTime: sessionStartRef.current,
        endTime: now.toISOString(),
        durationSeconds: Math.round(actualSeconds),
        targetSeconds: durationSeconds,
        completed,
      });
    },
    [type, sessionName, sessionTag, durationSeconds, addPomodoroSession]
  );

  const advanceToNext = useCallback((justCompletedType: SessionType, newCycleCount: number) => {
    let nextType: SessionType;
    if (justCompletedType === 'focus') {
      nextType = newCycleCount % settings.sessionsBeforeLongBreak === 0 ? 'long_break' : 'short_break';
    } else {
      nextType = 'focus';
    }
    const nextDuration = durationFor(nextType, settings);
    setType(nextType);
    setDurationSecondsState(nextDuration);
    setRemainingSeconds(nextDuration);
    pausedRemainingRef.current = nextDuration;
    endTimestampRef.current = null;
    runStartRef.current = null;
    sessionStartRef.current = null;
    completingRef.current = false;
    if (settings.autoStartNext) {
      const now = Date.now();
      endTimestampRef.current = now + nextDuration * 1000;
      runStartRef.current = new Date(now).toISOString();
      sessionStartRef.current = new Date(now).toISOString();
      setIsRunning(true);
    } else {
      setIsRunning(false);
    }
    savePersisted({
      type: nextType,
      sessionName,
      sessionTag,
      cycleCount: newCycleCount,
      durationSeconds: nextDuration,
      isRunning: settings.autoStartNext,
      endTimestamp: endTimestampRef.current,
      pausedRemainingSeconds: nextDuration,
      runStartISO: runStartRef.current,
      sessionStartISO: sessionStartRef.current,
    });
  }, [settings, sessionName, sessionTag]);

  const tick = useCallback(() => {
    if (endTimestampRef.current === null) return;
    const now = Date.now();
    const remaining = Math.max(0, Math.ceil((endTimestampRef.current - now) / 1000));
    setRemainingSeconds(remaining);
    if (remaining <= 0 && !completingRef.current) {
      completingRef.current = true;
      clearInt();
      const actualSeconds = durationSeconds; // reached full target
      const justType = type;
      finalizeCurrentAsRecord(true, actualSeconds);
      const newCycleCount = justType === 'focus' ? cycleCount + 1 : cycleCount;
      setCycleCount(newCycleCount);

      if (settings.soundEnabled) {
        playChime(justType === 'focus' ? 'focus-complete' : 'break-complete');
      }
      if (settings.notificationsEnabled) {
        const upcomingIsLongBreak =
          justType === 'focus' && newCycleCount % settings.sessionsBeforeLongBreak === 0;
        const title = justType === 'focus' ? 'Focus session complete' : 'Break over';
        const body =
          justType === 'focus'
            ? upcomingIsLongBreak
              ? 'Time for a long break.'
              : 'Time for a short break.'
            : 'Back to focus when you\u2019re ready.';
        maybeNotify(title, body);
      }

      advanceToNext(justType, newCycleCount);
    }
  }, [durationSeconds, type, cycleCount, settings, finalizeCurrentAsRecord, advanceToNext]);

  useEffect(() => {
    if (isRunning) {
      clearInt();
      intervalRef.current = window.setInterval(tick, 250);
      tick();
    } else {
      clearInt();
    }
    return clearInt;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, tick]);

  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && isRunning) tick();
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isRunning, tick]);

  // Persist on every meaningful change
  useEffect(() => {
    persist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, sessionName, sessionTag, cycleCount, durationSeconds, isRunning, remainingSeconds]);

  // If durations change in settings while this session hasn't started yet, keep it in sync.
  useEffect(() => {
    if (!isRunning && !sessionStartRef.current) {
      const d = durationFor(type, settings);
      setDurationSecondsState(d);
      setRemainingSeconds(d);
      pausedRemainingRef.current = d;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.focusMinutes, settings.shortBreakMinutes, settings.longBreakMinutes]);

  const start = useCallback(() => {
    if (isRunning) return;
    const now = Date.now();
    endTimestampRef.current = now + pausedRemainingRef.current * 1000;
    if (!runStartRef.current) runStartRef.current = new Date(now).toISOString();
    if (!sessionStartRef.current) sessionStartRef.current = new Date(now).toISOString();
    completingRef.current = false;
    setIsRunning(true);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    const now = Date.now();
    const remaining = Math.max(0, ((endTimestampRef.current ?? now) - now) / 1000);
    pausedRemainingRef.current = remaining;
    setRemainingSeconds(Math.ceil(remaining));
    endTimestampRef.current = null;
    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback(() => {
    // An in-progress focus session that gets reset counts as interrupted.
    if (sessionStartRef.current) {
      const spentSeconds = durationSeconds - remainingSeconds;
      if (spentSeconds >= 1) finalizeCurrentAsRecord(false, spentSeconds);
    }
    const d = durationFor(type, settings);
    setDurationSecondsState(d);
    setRemainingSeconds(d);
    pausedRemainingRef.current = d;
    endTimestampRef.current = null;
    runStartRef.current = null;
    sessionStartRef.current = null;
    completingRef.current = false;
    setIsRunning(false);
  }, [type, settings, durationSeconds, remainingSeconds, finalizeCurrentAsRecord]);

  const skip = useCallback(() => {
    if (sessionStartRef.current) {
      const spentSeconds = durationSeconds - remainingSeconds;
      if (spentSeconds >= 1) finalizeCurrentAsRecord(false, spentSeconds);
    }
    const newCycleCount = type === 'focus' ? cycleCount : cycleCount;
    clearInt();
    advanceToNext(type, newCycleCount);
  }, [type, cycleCount, durationSeconds, remainingSeconds, finalizeCurrentAsRecord, advanceToNext]);

  const setSessionName = (name: string) => setSessionNameState(name);
  const setSessionTag = (tag: SessionTag) => setSessionTagState(tag);

  return (
    <PomodoroContext.Provider
      value={{
        type,
        sessionName,
        setSessionName,
        sessionTag,
        setSessionTag,
        cycleCount,
        remainingSeconds,
        durationSeconds,
        isRunning,
        start,
        pause,
        reset,
        skip,
      }}
    >
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error('usePomodoro must be used within PomodoroProvider');
  return ctx;
}
