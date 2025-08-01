export function hasReachedLimit(
  current: number,
  limit: number | null | undefined
): boolean {
  if (limit === null || limit === undefined) return false;
  return current >= limit;
}
