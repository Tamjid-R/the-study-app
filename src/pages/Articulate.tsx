import { useEffect, useRef, useState } from 'react';
import { TimerFace } from '../components/Timer/TimerFace';
import { TimerControls } from '../components/Timer/TimerControls';
import { useTimestampTimer } from '../hooks/useTimestampTimer';
import { useSettings } from '../contexts/SettingsContext';
import { useData } from '../contexts/DataContext';
import { nextTopic, Topic } from '../data/topics';
import { localDateKey, formatClock } from '../utils/time';
import { Button } from '../components/Buttons/Button';

const MIN_RECORDABLE_SECONDS = 5;

export function ArticulatePage() {
  const { settings } = useSettings();
  const { addArticulateSession } = useData();
  const [topic, setTopic] = useState<Topic>(() => nextTopic());

  const startedRef = useRef(false);
  const loggedRef = useRef(false);
  const startTimeRef = useRef<string | null>(null);
  const topicRef = useRef(topic);
  topicRef.current = topic;

  const finalize = (completed: boolean, actualSeconds: number) => {
    if (loggedRef.current) return;
    if (!startedRef.current) return;
    if (actualSeconds < MIN_RECORDABLE_SECONDS) {
      startedRef.current = false;
      return;
    }
    loggedRef.current = true;
    addArticulateSession({
      topic: topicRef.current.text,
      category: topicRef.current.category,
      date: localDateKey(),
      startTime: startTimeRef.current ?? new Date().toISOString(),
      targetSeconds: timer.durationSeconds,
      actualSeconds: Math.round(actualSeconds),
      completed,
    });
  };

  const timer = useTimestampTimer(settings.articulateSeconds, {
    onComplete: () => {
      finalize(true, timer.durationSeconds);
    },
  });

  // Keep target duration synced with settings when idle.
  useEffect(() => {
    if (!timer.isRunning && !startedRef.current) {
      timer.setDuration(settings.articulateSeconds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.articulateSeconds]);

  // Finalize a partial attempt if the user leaves the page mid-speech.
  useEffect(() => {
    return () => {
      if (startedRef.current && !loggedRef.current) {
        finalize(false, timer.elapsedSeconds);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStart = () => {
    if (!startedRef.current) {
      startedRef.current = true;
      loggedRef.current = false;
      startTimeRef.current = new Date().toISOString();
    }
    timer.start();
  };

  const handleReset = () => {
    if (startedRef.current && !loggedRef.current) {
      finalize(false, timer.elapsedSeconds);
    }
    startedRef.current = false;
    loggedRef.current = false;
    startTimeRef.current = null;
    timer.reset(settings.articulateSeconds);
  };

  const handleNewTopic = () => {
    if (startedRef.current && !loggedRef.current) {
      finalize(false, timer.elapsedSeconds);
    }
    startedRef.current = false;
    loggedRef.current = false;
    startTimeRef.current = null;
    timer.reset(settings.articulateSeconds);
    setTopic(nextTopic());
  };

  return (
    <div className="page">
      <header className="page-header">
        <p className="page-eyebrow">Spontaneous speaking practice</p>
        <h1 className="page-title">Articulate</h1>
        <p className="page-subtitle">
          Read the topic, press start, and speak until the timer runs out. Attempts under five seconds
          aren&rsquo;t recorded.
        </p>
      </header>

      <div className="grid" style={{ gridTemplateColumns: '1fr', maxWidth: 640, margin: '0 auto' }}>
        <div className="card text-center">
          <span className="pill pill-secondary">{topic.category}</span>
          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
              lineHeight: 1.4,
              margin: '18px auto 6px',
              maxWidth: '46ch',
              fontStyle: 'italic',
            }}
          >
            &ldquo;{topic.text}&rdquo;
          </p>
          <Button onClick={handleNewTopic} size="sm" className="mt-sm">
            <ShuffleIcon /> Generate Topic
          </Button>

          <div className="rule" />

          <TimerFace
            remainingSeconds={timer.remainingSeconds}
            durationSeconds={timer.durationSeconds}
            label={timer.isRunning ? 'Speaking' : 'Ready'}
            accentVar="--color-secondary"
          />

          <TimerControls
            isRunning={timer.isRunning}
            onStart={handleStart}
            onPause={timer.pause}
            onReset={handleReset}
            startLabel={startedRef.current ? 'Resume' : 'Start Speaking'}
          />

          {startedRef.current && !timer.isRunning && timer.elapsedSeconds > 0 && timer.remainingSeconds > 0 && (
            <p className="faint mt-sm" style={{ fontSize: '0.85rem' }}>
              Paused at {formatClock(timer.elapsedSeconds)} spoken
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ShuffleIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M17 3h4v4M21 3l-7 7M3 21l6-6M21 21h-4v-4M3 3l6.5 6.5M21 21l-6-6" />
    </svg>
  );
}
