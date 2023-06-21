import { Timer } from "./Timer";

export function initTime() {
  const timer = new Timer(1000 / 60);
  timer.start();
  return timer;
}

export function updateTime(timer: Timer) {
  return timer.tick();
}
