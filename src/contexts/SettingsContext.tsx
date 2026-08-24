import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppSettings, DEFAULT_SETTINGS } from '../types';
import { idbGetAll, idbPut, STORES } from '../db/db';

interface SettingsRow {
  key: 'app';
  value: AppSettings;
}

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;
  replaceSettings: (next: AppSettings) => void;
  loaded: boolean;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    idbGetAll<SettingsRow>(STORES.settings).then((rows) => {
      const row = rows.find((r) => r.key === 'app');
      if (row) setSettings({ ...DEFAULT_SETTINGS, ...row.value });
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!loaded) return;
    idbPut(STORES.settings, { key: 'app', value: settings });
  }, [settings, loaded]);

  // Apply theme/font/density to the document root so plain CSS can react.
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', settings.theme);
    root.setAttribute('data-font', settings.font);
    root.setAttribute('data-density', settings.density);
  }, [settings.theme, settings.font, settings.density]);

  const updateSettings = (patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  };

  const replaceSettings = (next: AppSettings) => setSettings(next);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, replaceSettings, loaded }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
