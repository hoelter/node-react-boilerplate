export function assertIsDefined<T>(value: T | undefined | null, msg?: string): asserts value is T {
  if (!value) {
    throw new Error(msg || "assertIsDefined value is null or undefined");
  }
}
