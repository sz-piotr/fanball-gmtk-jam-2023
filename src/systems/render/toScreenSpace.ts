import { World } from "../types";

export function toScreenSpace(vector: { x: number; y: number }, world: World) {
  const SCREEN_X1 = 19.05;
  const SCREEN_Y1 = 311.54;
  const SCREEN_W = 761.9;
  const SCREEN_H = 276.92;

  const SCREEN_CENTER_X = SCREEN_X1 + SCREEN_W / 2;
  const SCREEN_CENTER_Y = SCREEN_Y1 + SCREEN_H / 2;

  const scaleY = SCREEN_H / world.field.rect.size.y;
  const scaleX = SCREEN_W / world.field.rect.size.x;

  return {
    x: vector.x * scaleX + SCREEN_CENTER_X,
    y: vector.y * scaleY + SCREEN_CENTER_Y,
  };
}
