// username-cache.ts
const cache = new Map<string, { available: boolean; expires: number }>();

export function getCachedUsernameCheck(username: string) {
  const now = Date.now();
  const cached = cache.get(username);
  if (cached && cached.expires > now) {
    return cached.available;
  }
  return null;
}

export function setCachedUsernameCheck(username: string, available: boolean) {
  cache.set(username, { available, expires: Date.now() + 120_000 }); // cache 2m
}
