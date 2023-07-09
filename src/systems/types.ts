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
  animation: {
    isStationary: boolean;
    lastPosition: Vector2;
    direction: 1 | -1;
    leftLeg: {
      rotation: number;
      angularVelocity: number;
      isStraight: boolean;
    };
    rightLeg: {
      rotation: number;
      angularVelocity: number;
      isStraight: boolean;
    };
  };
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

export interface Fan {
  id: string;
  sector: Sector;
  position: Vector2;
  animation: {
    progress: number;
    position: Vector2;
    intensity: number;
  };
}

export interface Sector {
  id: 1 | 2 | 3 | 4 | 5 | 6;
  isCheering: boolean;
  isBooing: boolean;
  energyRegeneration: number;
  baseEnergyRegeneration: number;
  energy: number;
  fanArea: Rect;
  playerArea: Rect;
  displayArea: Rect;
  fans: Fan[];
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
  fans: Fan[];
  sectors: Sector[];
  startingTeam: "red" | "blue";
  leftTeam: "red" | "blue";
  switchedSides: boolean;
  gameOver: boolean;
  scores: {
    red: number;
    blue: number;
  };
  time: {
    gameTime: number;
    paused: boolean;
  };
  ui: {
    leftTeam?: "red" | "blue";
    scores: [number, number];
    leftTeamName: HTMLElement;
    leftTeamScore: HTMLElement;
    timer: HTMLElement;
    rightTeamName: HTMLElement;
    rightTeamScore: HTMLElement;
  };
}
