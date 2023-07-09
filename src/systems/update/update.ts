import { Vector2 } from "../../math/Vector2";
import { assert } from "../../utils/assert";
import { randomChoice } from "../../utils/random";
import { Input } from "../input/inputSystem";
import { Ball, Goal, Player, World } from "../types";
import { advanceGameState } from "./advanceGameState";
import { getIntent } from "./decision";
import { executeIntent } from "./execution";
import { updateFanAnimation } from "./updateFanAnimation";
import { updatePlayerAnimation } from "./updatePlayerAnimation";

export function updateWorld(world: World, input: Input, deltaTime: number) {
  advanceGameState(world, deltaTime);

  for (const player of world.players) {
    const intent = getIntent(player, world);
    executeIntent(intent, player, world, deltaTime);

    if (world.gameState.type === "Playing") {
      if (world.ball.owner === undefined) {
        captureBall(player, world.ball);
      }

      if (world.ball.owner === player) {
        pushBall(player, deltaTime, world.ball);
      }
    }

    for (const other of world.players) {
      pushAway(player, other, 5);
    }

    updatePlayerAnimation(player, deltaTime);
  }

  for (const fan of world.fans) {
    if (input.isPressed(`sector${fan.sector}`)) {
      fan.animation.intensity = 4;
      if (input.isPressed("boo")) {
        fan.animation.intensity = 0;
      }
    } else {
      fan.animation.intensity = 1;
    }
    updateFanAnimation(fan, deltaTime);
  }

  world.ball.position.mulAdd(world.ball.velocity, deltaTime);

  for (const goal of world.goals) {
    if (goal.rect.contains(world.ball.position)) {
      afterGoal(world, goal.team);
    }
  }

  const BALL_ACCELERATION = 0.99;
  world.ball.velocity.mul(BALL_ACCELERATION);

  if (!world.ball.velocity.isZero()) {
    if (!world.field.rect.contains(world.ball.position)) {
      let isGoalkeeper = false;
      if (
        world.ball.position.x < world.field.rect.position.x ||
        world.ball.position.x >
          world.field.rect.position.x + world.field.rect.size.x
      ) {
        // TODO: handle corner
        isGoalkeeper = true;
      }

      world.ball.position.clamp(
        world.field.rect.position,
        world.field.rect.position.clone().add(world.field.rect.size)
      );
      world.ball.velocity.set(0, 0);

      if (world.gameState.type === "Playing") {
        if (isGoalkeeper) {
          const startingPlayer = world.players.find(
            (p) => p.team !== world.ball.lastTouchedBy && p.isGoalkeeper
          );

          assert(startingPlayer, "Missing starting player!");
          world.ball.position.set(startingPlayer.offensivePosition);
          world.gameState = {
            type: "GoalkeeperKick",
            startingPlayer,
            timeRemaining: Infinity,
          };
        } else {
          let startingPlayer: Player | undefined;
          let minDistance = Infinity;
          for (const player of world.players) {
            if (player.team !== world.ball.lastTouchedBy) {
              const distance = Vector2.distance2(
                world.ball.position,
                player.position
              );
              if (distance < minDistance) {
                minDistance = distance;
                startingPlayer = player;
              }
            }
          }

          assert(startingPlayer, "Missing starting player!");
          world.gameState = {
            type: "OutKick",
            startingPlayer,
            timeRemaining: Infinity,
          };
        }
      }
    }
  }
}

function pushBall(player: Player, deltaTime: number, ball: Ball) {
  if (!ball.velocity.isZero()) {
    if (!isNearPlayer(player, ball.position)) {
      ball.owner = undefined;
    }
    return;
  }
  const direction = player.team === "red" ? 1 : -1;
  ball.position
    .set(player.position)
    .add((player.controlRadius / 2) * direction, 0);
}

function captureBall(player: Player, ball: Ball) {
  if (!isNearPlayer(player, ball.position)) {
    return;
  }
  const controlModifier = player.team === ball.lastTouchedBy ? 2 : 0.3;
  if (Math.random() < (player.control * controlModifier) / 100) {
    ball.owner = player;
    ball.velocity.set(0, 0);
    ball.lastTouchedBy = player.team;
  }
}

function isNearPlayer(player: Player, vector: Vector2) {
  const distance2 = Vector2.distance2(player.position, vector);
  const radius2 = player.controlRadius * player.controlRadius;
  return distance2 <= radius2;
}

function pushAway(player: Player, other: Player, strength: number) {
  if (player === other) {
    return;
  }
  const distance2 = Vector2.distance2(player.position, other.position);
  const radius2 = player.controlRadius * player.controlRadius;
  if (distance2 >= radius2) {
    return;
  }

  const push = other.position
    .clone()
    .sub(player.position)
    .normalize()
    .mul(((radius2 - distance2) / radius2) * strength);

  other.position.add(push);
}

function afterGoal(world: World, startingTeam: "red" | "blue") {
  world.scores[startingTeam === "red" ? "blue" : "red"] += 1;

  const startingPlayer = randomChoice(
    world.players.filter((p) => p.team === startingTeam && p.canStart)
  );
  assert(startingPlayer, "No starting player");

  world.gameState = {
    type: "Starting",
    startingPlayer,
    timeRemaining: Infinity,
  };

  world.ball.position.set(0, 0);
  world.ball.velocity.set(0, 0);
  world.ball.owner = undefined;
}
