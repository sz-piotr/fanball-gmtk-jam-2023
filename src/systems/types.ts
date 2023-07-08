import { Vector2 } from "../math/Vector2";
import { Rect } from "../math/Rect";

export interface Field {
  rect: Rect;
}

export interface Goal {
  team: "red" | "blue";
  rect: Rect;
  center: Vector2;
}

export interface Player {
  team: "red" | "blue";
  isGoalkeeper: boolean;
  position: Vector2;
  defensivePosition: Vector2;
  offensivePosition: Vector2;
  hasBall: boolean;
  speed: number;
  baseSpeed: number;
  control: number;
  baseControl: number;
  controlRadius: number;
}

export interface Ball {
  position: Vector2;
  velocity: Vector2;
  owner?: Player;
}

export interface World {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ball: Ball;
  field: Field;
  goals: Goal[];
  players: Player[];
}
