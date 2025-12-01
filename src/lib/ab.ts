export type ABEvent = {
  experiment: string;
  variant: string;
  event: string;
  timestamp: string;
  metadata?: Record<string, any>;
};

const STORAGE_KEY = 'ab_events';

export function getVariant(experiment: string, variants: string[]): string {
  const key = `ab:${experiment}`;
  const existing = localStorage.getItem(key);
  if (existing) return existing;

  const chosen = variants[Math.floor(Math.random() * variants.length)];
  localStorage.setItem(key, chosen);
  return chosen;
}

export function trackEvent(experiment: string, variant: string, event: string, metadata?: Record<string, any>) {
  try {
    const entry: ABEvent = {
      experiment,
      variant,
      event,
      timestamp: new Date().toISOString(),
      metadata,
    };
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: ABEvent[] = raw ? JSON.parse(raw) : [];
    list.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('AB track error', err);
  }
}

export function getEvents(): ABEvent[] {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function clearEvents() {
  localStorage.removeItem(STORAGE_KEY);
}

export function exportCSV(): string {
  const events = getEvents();
  const header = ['experiment','variant','event','timestamp','metadata'];
  const rows = events.map(e => {
    const meta = e.metadata ? JSON.stringify(e.metadata).replace(/\n/g, ' ') : '';
    return [e.experiment, e.variant, e.event, e.timestamp, meta].map(v => `"${String(v).replace(/"/g, '""')}"`).join(',');
  });
  return [header.join(','), ...rows].join('\n');
}
