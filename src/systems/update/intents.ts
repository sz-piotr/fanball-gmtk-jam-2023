import { Vector2 } from "../../math/Vector2";

export interface BePassiveIntent {
  type: "BePassive";
  score: number;
}

export interface MoveIntent {
  type: "Move";
  score: number;
  target: Vector2;
}

export interface PassIntent {
  type: "Pass";
  score: number;
  target: Vector2;
}

export interface ShootIntent {
  type: "Shoot";
  score: number;
  target: Vector2;
}

export type Intent = BePassiveIntent | MoveIntent | PassIntent | ShootIntent;
