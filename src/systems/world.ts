import { Vector2 } from "../math/Vector2";
import { IS_DEVELOPMENT } from "../config";
import { Rect } from "../math/Rect";
import { World, Player } from "./types";
import { randomChoice } from "../utils/random";
import { assert } from "../utils/assert";
import { v4 as uuid } from "uuid";

const FIELD_WIDTH = 200;
const FIELD_HEIGHT = 100;
const GOAL_WIDTH = 20;
const GOAL_HEIGHT = 30;

const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 600;

export function initWorld(): World {
  const { canvas, ctx } = initCanvas();
  const players = [
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
      canStart: true,
      defensive: new Vector2(0.1, 0.35),
      offensive: new Vector2(-0.35, 0.15),
    }),
  ];

  const startingTeam = Math.random() < 0.5 ? "red" : "blue";
  const startingPlayer = randomChoice(
    players.filter((p) => p.team === startingTeam && p.canStart)
  );
  assert(startingPlayer, "No starting player");

  return {
    canvas,
    ctx,
    gameState: {
      type: "Starting",
      startingPlayer: startingPlayer,
      timeRemaining: Infinity,
    },
    ball: {
      position: new Vector2(0, 0),
      velocity: new Vector2(0, 0),
      lastTouchedBy: "red",
    },
    field: {
      rect: new Rect(
        new Vector2(-FIELD_WIDTH / 2, -FIELD_HEIGHT / 2),
        new Vector2(FIELD_WIDTH, FIELD_HEIGHT)
      ),
    },
    goals: [
      {
        team: "red",
        rect: new Rect(
          new Vector2(-FIELD_WIDTH / 2 - GOAL_WIDTH, -GOAL_HEIGHT / 2),
          new Vector2(GOAL_WIDTH, GOAL_HEIGHT)
        ),
        center: new Vector2(-FIELD_WIDTH / 2, 0),
      },
      {
        team: "blue",
        rect: new Rect(
          new Vector2(FIELD_WIDTH / 2, -GOAL_HEIGHT / 2),
          new Vector2(GOAL_WIDTH, GOAL_HEIGHT)
        ),
        center: new Vector2(FIELD_WIDTH / 2, 0),
      },
    ],
    players,
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
  canStart?: boolean;
  isGoalkeeper?: boolean;
  defensive: Vector2;
  offensive: Vector2;
}): Player {
  return {
    id: uuid(),
    team: options.team,
    isGoalkeeper: !!options.isGoalkeeper,
    canStart: !!options.canStart,
    speed: 20,
    baseSpeed: 20,
    control: 10,
    baseControl: 10,
    controlRadius: 10,
    accuracy: 50,
    baseAccuracy: 50,
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
