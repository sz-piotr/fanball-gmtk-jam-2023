const MS_PER_SECOND = 1000;

export class Timer {
  private lastTimeMs = 0;
  private accumulator = 0;

  constructor(private fixedTimeStepMs: number) {}

  public start() {
    this.lastTimeMs = Date.now();
  }

  public tick() {
    const now = Date.now();
    const deltaTime = now - this.lastTimeMs;
    this.lastTimeMs = now;

    this.accumulator += deltaTime;
    let steps = Math.floor(this.accumulator / this.fixedTimeStepMs);
    if (steps === 0 && this.accumulator > -3 * this.fixedTimeStepMs) {
      steps = 1;
    }
    this.accumulator -= steps * this.fixedTimeStepMs;

    return {
      deltaTime: deltaTime / MS_PER_SECOND,
      fixedDeltaTime: this.fixedTimeStepMs / MS_PER_SECOND,
      steps,
    };
  }
}
