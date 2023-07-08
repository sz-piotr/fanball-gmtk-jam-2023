export function random(min: number, max: number) {
  if (min > max) {
    return random(max, min);
  }
  return Math.random() * (max - min) + min;
}

export function randomChoice<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}
