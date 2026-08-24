import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { PomodoroSession, ArticulateSession, ExportBundle, DEFAULT_SETTINGS } from '../types';
import { idbGetAll, idbPut, STORES, idbClearAll, idbClear } from '../db/db';
import { useSettings } from './SettingsContext';

interface DataContextValue {
  pomodoroSessions: PomodoroSession[];
  articulateSessions: ArticulateSession[];
  loaded: boolean;
  addPomodoroSession: (s: Omit<PomodoroSession, 'id'>) => Promise<void>;
  addArticulateSession: (s: Omit<ArticulateSession, 'id'>) => Promise<void>;
  clearArticulateHistory: () => Promise<void>;
  exportData: () => Promise<ExportBundle>;
  importData: (bundle: ExportBundle) => Promise<void>;
  clearAllData: () => Promise<void>;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [pomodoroSessions, setPomodoroSessions] = useState<PomodoroSession[]>([]);
  const [articulateSessions, setArticulateSessions] = useState<ArticulateSession[]>([]);
  const [loaded, setLoaded] = useState(false);
  const { settings, replaceSettings } = useSettings();

  useEffect(() => {
    Promise.all([
      idbGetAll<PomodoroSession>(STORES.pomodoro),
      idbGetAll<ArticulateSession>(STORES.articulate),
    ]).then(([pomo, art]) => {
      // Defensive default: sessions recorded before the tag feature existed
      // won't have a `tag` field yet.
      const withTags = pomo.map((s) => ({ ...s, tag: s.tag ?? 'Other' }));
      setPomodoroSessions(withTags.sort((a, b) => a.startTime.localeCompare(b.startTime)));
      setArticulateSessions(art.sort((a, b) => a.startTime.localeCompare(b.startTime)));
      setLoaded(true);
    });
  }, []);

  const addPomodoroSession = useCallback(async (s: Omit<PomodoroSession, 'id'>) => {
    const record: PomodoroSession = { ...s, id: uuid() };
    await idbPut(STORES.pomodoro, record);
    setPomodoroSessions((prev) => [...prev, record]);
  }, []);

  const addArticulateSession = useCallback(async (s: Omit<ArticulateSession, 'id'>) => {
    const record: ArticulateSession = { ...s, id: uuid() };
    await idbPut(STORES.articulate, record);
    setArticulateSessions((prev) => [...prev, record]);
  }, []);

  const exportData = useCallback(async (): Promise<ExportBundle> => {
    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      settings,
      pomodoroSessions,
      articulateSessions,
    };
  }, [settings, pomodoroSessions, articulateSessions]);

  const importData = useCallback(async (bundle: ExportBundle) => {
    await idbClearAll();
    const nextSettings = { ...DEFAULT_SETTINGS, ...(bundle.settings ?? {}) };
    replaceSettings(nextSettings);
    await idbPut(STORES.settings, { key: 'app', value: nextSettings });
    for (const s of bundle.pomodoroSessions ?? []) {
      await idbPut(STORES.pomodoro, s);
    }
    for (const s of bundle.articulateSessions ?? []) {
      await idbPut(STORES.articulate, s);
    }
    setPomodoroSessions((bundle.pomodoroSessions ?? []).sort((a, b) => a.startTime.localeCompare(b.startTime)));
    setArticulateSessions((bundle.articulateSessions ?? []).sort((a, b) => a.startTime.localeCompare(b.startTime)));
  }, [replaceSettings]);

  const clearArticulateHistory = useCallback(async () => {
    await idbClear(STORES.articulate);
    setArticulateSessions([]);
  }, []);

  const clearAllData = useCallback(async () => {
    await idbClearAll();
    setPomodoroSessions([]);
    setArticulateSessions([]);
    replaceSettings(DEFAULT_SETTINGS);
    await idbPut(STORES.settings, { key: 'app', value: DEFAULT_SETTINGS });
  }, [replaceSettings]);

  return (
    <DataContext.Provider
      value={{
        pomodoroSessions,
        articulateSessions,
        loaded,
        addPomodoroSession,
        addArticulateSession,
        clearArticulateHistory,
        exportData,
        importData,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
