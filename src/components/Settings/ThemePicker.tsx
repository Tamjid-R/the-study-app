import { ThemeName } from '../../types';

const THEMES: { key: ThemeName; label: string; colors: [string, string, string] }[] = [
  { key: 'parchment', label: 'Parchment', colors: ['#f1e9d8', '#7a2e2e', '#3f5b4c'] },
  { key: 'midnight-library', label: 'Midnight Library', colors: ['#1b1a17', '#c9a227', '#7fa08c'] },
  { key: 'forest-study', label: 'Forest Study', colors: ['#eae3cd', '#2f4d3a', '#7a2e2e'] },
  { key: 'sepia-ink', label: 'Sepia Ink', colors: ['#e6d9bd', '#5c3a21', '#3e6259'] },
  { key: 'noir-orchid', label: 'Noir Orchid', colors: ['#17121a', '#e0559c', '#a06bf0'] },
  { key: 'blue-hour', label: 'Blue Hour', colors: ['#0f1720', '#4fa8e0', '#6fd6c4'] },
  { key: 'neobrutalist', label: 'Neobrutalist', colors: ['#f2f0e8', '#ff5b3c', '#3c6dff'] },
  { key: 'panelpop', label: 'Panel Pop', colors: ['#fef6e4', '#f9375b', '#2e9e8f'] },
  { key: 'dark-fantasy', label: 'Dark Fantasy', colors: ['#050505', '#8f1f1f', '#6b5b8a'] },
  { key: 'vintage-vibe', label: 'Vintage Vibe', colors: ['#efdcd1', '#b5563e', '#5c7a6b'] },
  { key: 'level-up-academy', label: 'Level Up Academy', colors: ['#101425', '#7c5cff', '#29d3a2'] },
];

const LIGHT_BG_KEYS = new Set<ThemeName>(['parchment', 'forest-study', 'sepia-ink', 'neobrutalist', 'panelpop', 'vintage-vibe']);

interface Props {
  value: ThemeName;
  onChange: (t: ThemeName) => void;
}

export function ThemePicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-4">
      {THEMES.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          aria-pressed={value === t.key}
          style={{
            cursor: 'pointer',
            textAlign: 'left',
            padding: 12,
            borderRadius: 'var(--radius-md)',
            border: value === t.key ? '2px solid var(--color-accent)' : '1px solid var(--color-border-strong)',
            background: t.colors[0],
          }}
        >
          <div className="row gap-xs" style={{ marginBottom: 10 }}>
            {t.colors.slice(1).map((c, i) => (
              <span key={i} style={{ width: 16, height: 16, borderRadius: '50%', background: c, display: 'inline-block' }} />
            ))}
          </div>
          <span style={{ fontSize: '0.82rem', color: LIGHT_BG_KEYS.has(t.key) ? '#2b2420' : '#ece4d3' }}>
            {t.label}
          </span>
        </button>
      ))}
    </div>
  );
}
