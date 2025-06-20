export function filterDefinedFields<T extends object>(data: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => value !== undefined)
  ) as Partial<T>;
}
