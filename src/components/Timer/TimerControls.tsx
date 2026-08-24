import { Button } from '../Buttons/Button';

interface Props {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  onSkip?: () => void;
  startLabel?: string;
}

export function TimerControls({ isRunning, onStart, onPause, onReset, onSkip, startLabel }: Props) {
  return (
    <div className="btn-row center" style={{ marginTop: 22 }}>
      {!isRunning ? (
        <Button variant="primary" onClick={onStart}>
          <PlayIcon /> {startLabel ?? 'Start'}
        </Button>
      ) : (
        <Button variant="primary" onClick={onPause}>
          <PauseIcon /> Pause
        </Button>
      )}
      <Button onClick={onReset}>
        <ResetIcon /> Reset
      </Button>
      {onSkip && (
        <Button onClick={onSkip}>
          <SkipIcon /> Skip
        </Button>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7L8 5Z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="5" width="4" height="14" />
      <rect x="14" y="5" width="4" height="14" />
    </svg>
  );
}
function ResetIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}
function SkipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 5v14l9-7-9-7Z" />
      <rect x="16" y="5" width="3" height="14" />
    </svg>
  );
}
