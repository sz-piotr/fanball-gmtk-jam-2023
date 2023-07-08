import { Fan } from "../types";

export function updateFanAnimation(fan: Fan, deltaTime: number) {
  const BASE_SPEED = 1;
  const MAX_X_OFFSET = 1;
  const MAX_Y_OFFSET = 2;

  fan.animation.position.set(fan.position);
  const speed = BASE_SPEED * fan.animation.intensity;
  fan.animation.progress += speed * deltaTime;

  const progress = fan.animation.progress % 1;
  const offsetX =
    Math.sin(progress * Math.PI * 2) * MAX_X_OFFSET * fan.animation.intensity;

  const offsetY =
    MAX_Y_OFFSET *
    fan.animation.intensity *
    (0.5 - Math.abs(0.5 - ((progress * 2) % 1)));

  fan.animation.position.add(offsetX, offsetY);
}
