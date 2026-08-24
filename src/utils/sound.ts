// Generates a small, pleasant chime using the Web Audio API directly,
// so no external audio file needs to be bundled or fetched.

let ctx: AudioContext | null = null;

function getContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext || (window as any).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  return ctx;
}

function playTone(frequency: number, startTime: number, duration: number, gainPeak: number, context: AudioContext) {
  const osc = context.createOscillator();
  const gain = context.createGain();
  osc.type = 'sine';
  osc.frequency.value = frequency;
  gain.gain.setValueAtTime(0, startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, startTime + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);
  osc.connect(gain);
  gain.connect(context.destination);
  osc.start(startTime);
  osc.stop(startTime + duration + 0.05);
}

/** A soft two-note chime, used when a focus session or break completes. */
export function playChime(kind: 'focus-complete' | 'break-complete' = 'focus-complete') {
  const context = getContext();
  if (!context) return;
  if (context.state === 'suspended') {
    context.resume().catch(() => {});
  }
  const now = context.currentTime;
  if (kind === 'focus-complete') {
    playTone(587.33, now, 0.35, 0.16, context); // D5
    playTone(880, now + 0.14, 0.4, 0.14, context); // A5
  } else {
    playTone(440, now, 0.3, 0.14, context); // A4
    playTone(659.25, now + 0.12, 0.35, 0.12, context); // E5
  }
}

/** Fires a browser notification if permission has been granted. Silently no-ops otherwise. */
export function maybeNotify(title: string, body: string) {
  if (typeof window === 'undefined' || !('Notification' in window)) return;
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, { body, icon: '/favicon.svg' });
    } catch {
      // Some browsers (notably iOS Safari) throw here; fail silently.
    }
  }
}

export function requestNotificationPermission() {
  if (typeof window === 'undefined' || !('Notification' in window)) return Promise.resolve('unsupported' as const);
  if (Notification.permission === 'default') {
    return Notification.requestPermission();
  }
  return Promise.resolve(Notification.permission);
}
