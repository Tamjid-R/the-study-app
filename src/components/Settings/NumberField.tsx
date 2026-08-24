interface Props {
  label: string;
  value: number;
  min: number;
  max: number;
  suffix?: string;
  onChange: (v: number) => void;
}

export function NumberField({ label, value, min, max, suffix, onChange }: Props) {
  return (
    <div className="field">
      <label className="field-label">{label}</label>
      <div className="row gap-sm">
        <input
          type="number"
          className="input"
          value={value}
          min={min}
          max={max}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (!Number.isNaN(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          style={{ maxWidth: 110 }}
        />
        {suffix && <span className="muted">{suffix}</span>}
      </div>
    </div>
  );
}
