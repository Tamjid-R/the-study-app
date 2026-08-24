import { useCallback, useEffect, useRef, useState } from 'react';

export interface TimerState {
  /** Total planned duration in seconds */
  durationSeconds: number;
  /** Remaining seconds, recomputed from timestamps (not decremented directly) */
  remainingSeconds: number;
  isRunning: boolean;
  /** Elapsed seconds since the timer was (re)started for this run, ignoring pauses */
  elapsedSeconds: number;
}

interface Options {
  onComplete?: () => void;
  /** tick resolution in ms */
  tickMs?: number;
}

/**
 * Accurate countdown timer. Instead of decrementing a counter every second
 * (which drifts when a tab is throttled/backgrounded), it stores the
 * absolute timestamp the timer should end at and recomputes remaining time
 * from Date.now() on every tick and whenever the tab regains focus.
 */
export function useTimestampTimer(initialDurationSeconds: number, opts: Options = {}) {
  const { onComplete, tickMs = 250 } = opts;
  const [durationSeconds, setDurationSeconds] = useState(initialDurationSeconds);
  const [remainingSeconds, setRemainingSeconds] = useState(initialDurationSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const endTimeRef = useRef<number | null>(null); // ms epoch when timer hits 0
  const pausedRemainingRef = useRef<number>(initialDurationSeconds);
  const startedAtRef = useRef<number | null>(null); // ms epoch of the current run start
  const totalElapsedBeforeRunRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const clear = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const tick = useCallback(() => {
    if (endTimeRef.current === null) return;
    const now = Date.now();
    const remainingMs = endTimeRef.current - now;
    const remaining = Math.max(0, Math.ceil(remainingMs / 1000));
    setRemainingSeconds(remaining);
    if (startedAtRef.current !== null) {
      const elapsedThisRun = (now - startedAtRef.current) / 1000;
      setElapsedSeconds(totalElapsedBeforeRunRef.current + Math.max(0, elapsedThisRun));
    }
    if (remaining <= 0 && !completedRef.current) {
      completedRef.current = true;
      setIsRunning(false);
      clear();
      onCompleteRef.current?.();
    }
  }, [clear]);

  const start = useCallback(() => {
    if (isRunning) return;
    completedRef.current = false;
    const now = Date.now();
    endTimeRef.current = now + pausedRemainingRef.current * 1000;
    startedAtRef.current = now;
    setIsRunning(true);
    clear();
    intervalRef.current = window.setInterval(tick, tickMs);
    tick();
  }, [isRunning, tick, clear, tickMs]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    const now = Date.now();
    const remainingMs = (endTimeRef.current ?? now) - now;
    pausedRemainingRef.current = Math.max(0, remainingMs / 1000);
    if (startedAtRef.current !== null) {
      totalElapsedBeforeRunRef.current += Math.max(0, (now - startedAtRef.current) / 1000);
    }
    startedAtRef.current = null;
    setIsRunning(false);
    clear();
    setRemainingSeconds(Math.ceil(pausedRemainingRef.current));
  }, [isRunning, clear]);

  const reset = useCallback((newDuration?: number) => {
    clear();
    const d = newDuration ?? durationSeconds;
    setDurationSeconds(d);
    pausedRemainingRef.current = d;
    endTimeRef.current = null;
    startedAtRef.current = null;
    totalElapsedBeforeRunRef.current = 0;
    completedRef.current = false;
    setRemainingSeconds(d);
    setElapsedSeconds(0);
    setIsRunning(false);
  }, [clear, durationSeconds]);

  const setDuration = useCallback((d: number) => {
    reset(d);
  }, [reset]);

  // Recompute immediately when the tab becomes visible again, so the
  // displayed time is always correct even after long backgrounding.
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'visible' && isRunning) {
        tick();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [isRunning, tick]);

  useEffect(() => () => clear(), [clear]);

  return {
    durationSeconds,
    remainingSeconds,
    isRunning,
    elapsedSeconds,
    start,
    pause,
    reset,
    setDuration,
  };
}
