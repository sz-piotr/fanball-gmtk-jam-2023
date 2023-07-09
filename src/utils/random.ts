export function random(min: number, max: number) {
  if (min > max) {
    return random(max, min);
  }
  return Math.random() * (max - min) + min;
}

export function randomChoice<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}

export function randomWeightedChoice<T>(array: { weight: number; value: T }[]) {
  const sum = array.reduce((acc, item) => acc + item.weight, 0);
  let random = Math.random() * sum;
  let total = 0;
  for (const { weight, value } of array) {
    total += weight;
    if (random <= total) {
      return value;
    }
  }
}
