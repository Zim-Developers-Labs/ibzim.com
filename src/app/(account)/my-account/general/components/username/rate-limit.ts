// rate-limit.ts
const requests = new Map<string, { count: number; reset: number }>();

export function canCheckUsername(key: string, limit = 15, windowMs = 60_000) {
  const now = Date.now();
  const entry = requests.get(key);

  if (!entry || entry.reset < now) {
    requests.set(key, { count: 1, reset: now + windowMs });
    return true;
  }

  if (entry.count < limit) {
    entry.count++;
    return true;
  }

  return false; // blocked
}
