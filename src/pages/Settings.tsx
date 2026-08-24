import { useRef, useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { useData } from '../contexts/DataContext';
import { NumberField } from '../components/Settings/NumberField';
import { ThemePicker } from '../components/Settings/ThemePicker';
import { Button } from '../components/Buttons/Button';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';
import { downloadJson, readJsonFile } from '../utils/exportImport';
import { FontName, Density } from '../types';
import { playChime, requestNotificationPermission } from '../utils/sound';

const FONT_OPTIONS: { key: FontName; label: string; sample: string }[] = [
  { key: 'garamond', label: 'EB Garamond', sample: "'EB Garamond', Georgia, serif" },
  { key: 'baskerville', label: 'Libre Baskerville', sample: "'Libre Baskerville', Georgia, serif" },
  { key: 'georgia', label: 'Georgia', sample: 'Georgia, serif' },
  { key: 'spectral', label: 'Spectral', sample: "'Spectral', Georgia, serif" },
];

export function SettingsPage() {
  const { settings, updateSettings } = useSettings();
  const { exportData, importData, clearAllData } = useData();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [notifStatus, setNotifStatus] = useState<string | null>(null);

  const handleExport = async () => {
    const bundle = await exportData();
    downloadJson(bundle);
  };

  const handleImportFile = async (file: File) => {
    try {
      const bundle = await readJsonFile(file);
      await importData(bundle);
      setImportMessage('Data imported successfully.');
    } catch {
      setImportMessage('That file could not be read. Please choose a valid backup JSON.');
    }
    setTimeout(() => setImportMessage(null), 4000);
  };

  return (
    <div className="page">
      <header className="page-header">
        <p className="page-eyebrow">Customize</p>
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Adjust timers and appearance. Changes are saved automatically.</p>
      </header>

      <div className="card">
        <p className="card-title">Timer durations</p>
        <p className="faint" style={{ fontSize: '0.85rem' }}>Applies the next time a session starts fresh.</p>
        <div className="grid grid-2 mt-md">
          <NumberField
            label="Focus duration"
            value={settings.focusMinutes}
            min={1}
            max={180}
            suffix="minutes"
            onChange={(v) => updateSettings({ focusMinutes: v })}
          />
          <NumberField
            label="Short break"
            value={settings.shortBreakMinutes}
            min={1}
            max={60}
            suffix="minutes"
            onChange={(v) => updateSettings({ shortBreakMinutes: v })}
          />
          <NumberField
            label="Long break"
            value={settings.longBreakMinutes}
            min={1}
            max={90}
            suffix="minutes"
            onChange={(v) => updateSettings({ longBreakMinutes: v })}
          />
          <NumberField
            label="Sessions before long break"
            value={settings.sessionsBeforeLongBreak}
            min={2}
            max={12}
            suffix="sessions"
            onChange={(v) => updateSettings({ sessionsBeforeLongBreak: v })}
          />
          <NumberField
            label="Daily goal"
            value={settings.dailyGoal}
            min={1}
            max={24}
            suffix="pomodoros / day"
            onChange={(v) => updateSettings({ dailyGoal: v })}
          />
        </div>

        <div className="rule" />

        <div className="grid grid-2">
          <NumberField
            label="Articulate speaking duration"
            value={settings.articulateSeconds}
            min={10}
            max={900}
            suffix="seconds"
            onChange={(v) => updateSettings({ articulateSeconds: v })}
          />
          <div className="field">
            <label className="field-label">Common presets</label>
            <div className="btn-row">
              {[30, 60, 120, 300, 600].map((s) => (
                <Button
                  key={s}
                  size="sm"
                  variant={settings.articulateSeconds === s ? 'primary' : 'default'}
                  onClick={() => updateSettings({ articulateSeconds: s })}
                >
                  {s < 60 ? `${s}s` : `${s / 60}m`}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="rule" />

        <label className="row gap-sm" style={{ cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={settings.autoStartNext}
            onChange={(e) => updateSettings({ autoStartNext: e.target.checked })}
            style={{ width: 18, height: 18 }}
          />
          <span>Automatically start the next focus/break session</span>
        </label>
      </div>

      <div className="card">
        <p className="card-title">Sound &amp; notifications</p>
        <p className="faint" style={{ fontSize: '0.85rem' }}>
          Get a gentle nudge when a focus session or break ends &mdash; useful if you&rsquo;ve switched tabs.
        </p>

        <div className="stack gap-sm mt-md">
          <label className="row gap-sm" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              style={{ width: 18, height: 18 }}
            />
            <span>Play a chime when a session ends</span>
          </label>

          <label className="row gap-sm" style={{ cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={settings.notificationsEnabled}
              onChange={async (e) => {
                const wantsOn = e.target.checked;
                if (wantsOn) {
                  const result = await requestNotificationPermission();
                  if (result === 'granted') {
                    updateSettings({ notificationsEnabled: true });
                    setNotifStatus('Notifications enabled.');
                  } else if (result === 'unsupported') {
                    setNotifStatus('This browser does not support notifications.');
                  } else {
                    setNotifStatus('Permission was not granted. Check your browser\u2019s site settings.');
                  }
                } else {
                  updateSettings({ notificationsEnabled: false });
                  setNotifStatus(null);
                }
                setTimeout(() => setNotifStatus(null), 4000);
              }}
              style={{ width: 18, height: 18 }}
            />
            <span>Show a browser notification when a session ends</span>
          </label>
          {notifStatus && <p className="faint" style={{ fontSize: '0.82rem' }}>{notifStatus}</p>}

          <div>
            <Button size="sm" onClick={() => playChime('focus-complete')}>
              Preview chime
            </Button>
          </div>
        </div>
      </div>

      <div className="card">
        <p className="card-title">Appearance</p>
        <p className="faint" style={{ fontSize: '0.85rem' }}>Choose a theme that feels like your own study.</p>
        <div className="mt-md">
          <ThemePicker value={settings.theme} onChange={(theme) => updateSettings({ theme })} />
        </div>

        <div className="rule" />

        <div className="field">
          <label className="field-label">Typeface</label>
          <div className="grid grid-4 mt-sm">
            {FONT_OPTIONS.map((f) => (
              <button
                key={f.key}
                onClick={() => updateSettings({ font: f.key })}
                aria-pressed={settings.font === f.key}
                className="card"
                style={{
                  cursor: 'pointer',
                  padding: 14,
                  textAlign: 'left',
                  border: settings.font === f.key ? '2px solid var(--color-accent)' : '1px solid var(--color-border)',
                }}
              >
                <span style={{ fontFamily: f.sample, fontSize: '1.15rem' }}>Aa</span>
                <p className="faint" style={{ fontSize: '0.78rem', marginTop: 4 }}>{f.label}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="rule" />

        <div className="field">
          <label className="field-label">Interface density</label>
          <div className="btn-row">
            {(['comfortable', 'compact'] as Density[]).map((d) => (
              <Button
                key={d}
                size="sm"
                variant={settings.density === d ? 'primary' : 'default'}
                onClick={() => updateSettings({ density: d })}
              >
                {d === 'comfortable' ? 'Comfortable' : 'Compact'}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <p className="card-title">Your data</p>
        <p className="faint" style={{ fontSize: '0.85rem' }}>
          Everything lives in this browser. Export a backup you can keep or move to another device.
        </p>
        <div className="btn-row mt-md">
          <Button onClick={handleExport}>Export data (.json)</Button>
          <Button onClick={() => fileInputRef.current?.click()}>Import data</Button>
          <Button variant="danger" onClick={() => setConfirmClear(true)}>Clear all data</Button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportFile(file);
            e.target.value = '';
          }}
        />
        {importMessage && <p className="mt-sm" style={{ fontSize: '0.85rem' }}>{importMessage}</p>}
      </div>

      <ConfirmDialog
        open={confirmClear}
        title="Clear all data?"
        description="This permanently deletes every Pomodoro record, speaking history entry, and setting, resetting the app to its defaults. This can't be undone."
        confirmLabel="Clear everything"
        danger
        onCancel={() => setConfirmClear(false)}
        onConfirm={async () => {
          await clearAllData();
          setConfirmClear(false);
        }}
      />
    </div>
  );
}
