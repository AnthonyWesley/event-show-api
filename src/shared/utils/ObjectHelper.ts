export class ObjectHelper {
  constructor(readonly props: any) {}

  static removeUndefinedFields<T extends Record<string, any>>(
    obj: T
  ): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== undefined)
    ) as Partial<T>;
  }

  static mergePartial<T extends object>(original: T, partial: Partial<T>): T {
    return {
      ...original,
      ...Object.fromEntries(
        Object.entries(partial).filter(([_, value]) => value !== undefined)
      ),
    };
  }
}
