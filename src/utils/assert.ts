export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (!condition) {
    throw new Error(
      message ? `Assertion failed: ${message}` : "Assertion failed"
    );
  }
}

export function unreachableCodePath(): never {
  throw new Error("An unreachable code path has been encountered");
}

export function assertUnreachable(_: never): never {
  throw new Error("There are more values to handle.");
}
