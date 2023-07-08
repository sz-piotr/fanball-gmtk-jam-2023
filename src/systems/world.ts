import { Vector2 } from "../Vector2";
import { IS_DEVELOPMENT } from "../config";

interface Field {
  position: Vector2;
  width: number;
  height: number;
}

interface Goal {
  team: "red" | "blue";
  position: Vector2;
  width: number;
  height: number;
}

interface Player {
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

interface Ball {
  position: Vector2;
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

const FIELD_WIDTH = 200;
const FIELD_HEIGHT = 100;
const GOAL_WIDTH = 20;
const GOAL_HEIGHT = 30;

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

export function initWorld(): World {
  const { canvas, ctx } = initCanvas();

  return {
    canvas,
    ctx,
    ball: {
      position: new Vector2(0, 0),
    },
    field: {
      position: new Vector2(-FIELD_WIDTH / 2, -FIELD_HEIGHT / 2),
      width: FIELD_WIDTH,
      height: FIELD_HEIGHT,
    },
    goals: [
      {
        team: "red",
        position: new Vector2(-FIELD_WIDTH / 2 - GOAL_WIDTH, -GOAL_HEIGHT / 2),
        width: GOAL_WIDTH,
        height: GOAL_HEIGHT,
      },
      {
        team: "blue",
        position: new Vector2(FIELD_WIDTH / 2, -GOAL_HEIGHT / 2),
        width: GOAL_WIDTH,
        height: GOAL_HEIGHT,
      },
    ],
    players: [
      ...makePlayers({
        isGoalkeeper: true,
        defensive: new Vector2(0.45, 0),
        offensive: new Vector2(0.4, 0),
      }),
      ...makePlayers({
        defensive: new Vector2(0.35, 0.25),
        offensive: new Vector2(-0.1, 0.25),
      }),
      ...makePlayers({
        defensive: new Vector2(0.1, 0.35),
        offensive: new Vector2(-0.35, 0.15),
      }),
    ],
  };
}

function makePlayers(options: Omit<Parameters<typeof makePlayer>[0], "team">) {
  const players = [
    makePlayer({ team: "blue", ...options }),
    makePlayer({
      team: "red",
      ...options,
      defensive: options.defensive.clone().mul(-1, 1),
      offensive: options.offensive.clone().mul(-1, 1),
    }),
  ];
  if (!options.isGoalkeeper) {
    players.push(
      makePlayer({
        team: "blue",
        ...options,
        defensive: options.defensive.clone().mul(1, -1),
        offensive: options.offensive.clone().mul(1, -1),
      }),
      makePlayer({
        team: "red",
        ...options,
        defensive: options.defensive.clone().mul(-1, -1),
        offensive: options.offensive.clone().mul(-1, -1),
      })
    );
  }
  return players;
}

function makePlayer(options: {
  team: "red" | "blue";
  isGoalkeeper?: boolean;
  defensive: Vector2;
  offensive: Vector2;
}): Player {
  return {
    team: options.team,
    isGoalkeeper: !!options.isGoalkeeper,
    hasBall: false,
    speed: 5,
    baseSpeed: 5,
    control: 10,
    baseControl: 10,
    controlRadius: 10,
    position: options.defensive.clone().mul(FIELD_WIDTH, FIELD_HEIGHT),
    defensivePosition: options.defensive.clone().mul(FIELD_WIDTH, FIELD_HEIGHT),
    offensivePosition: options.offensive.clone().mul(FIELD_WIDTH, FIELD_HEIGHT),
  };
}

function initCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width = SCREEN_WIDTH;
  canvas.height = SCREEN_HEIGHT;
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Cannot create context");
  }

  if (IS_DEVELOPMENT) {
    document.body.className =
      "bg-zinc-900 flex justify-center items-center w-full h-full";
    canvas.className = "rounded-md drop-shadow-lg";
  }

  return { canvas, ctx };
}
