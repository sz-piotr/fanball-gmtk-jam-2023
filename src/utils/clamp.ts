export function clamp(value: number, min: number, max: number) {
  if (max < min) {
    return clamp(value, max, min);
  }
  return Math.max(min, Math.min(max, value));
}
