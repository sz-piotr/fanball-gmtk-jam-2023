import { Vector2 } from "../math/Vector2";
import { Rect } from "../math/Rect";
import { GameState } from "./update/states";

export interface Field {
  rect: Rect;
}

export interface Goal {
  team: "red" | "blue";
  rect: Rect;
  center: Vector2;
}

export interface Player {
  id: string;
  team: "red" | "blue";
  isGoalkeeper: boolean;
  canStart: boolean;
  position: Vector2;
  defensivePosition: Vector2;
  offensivePosition: Vector2;
  speed: number;
  baseSpeed: number;
  control: number;
  baseControl: number;
  controlRadius: number;
  accuracy: number;
  baseAccuracy: number;
}

export interface Ball {
  position: Vector2;
  velocity: Vector2;
  owner?: Player;
  lastTouchedBy: "red" | "blue";
}

export interface World {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  gameState: GameState;
  ball: Ball;
  field: Field;
  goals: Goal[];
  players: Player[];
}
