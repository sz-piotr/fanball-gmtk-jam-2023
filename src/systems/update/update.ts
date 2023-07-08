import { Vector2 } from "../../math/Vector2";
import { Input } from "../input/inputSystem";
import { Ball, Goal, Player, World } from "../types";
import { getIntent } from "./decision";
import { executeIntent } from "./execution";

export function updateWorld(world: World, input: Input, deltaTime: number) {
  if (world.isStarting) {
    let nearestPlayer: Player | undefined;
    let minDistance = Infinity;
    for (const player of world.players) {
      if (player.team === world.ball.teamControl) {
        const distance = Vector2.distance2(
          player.position,
          world.ball.position
        );
        if (distance < minDistance) {
          nearestPlayer = player;
          minDistance = distance;
        }
      }
    }
    nearestPlayer?.position.set(0, 0);
    world.ball.owner = nearestPlayer;
  }

  for (const player of world.players) {
    const intent = getIntent(player, world);
    executeIntent(intent, player, world, deltaTime);

    if (world.ball.owner === undefined) {
      captureBall(player, world.ball);
    }

    if (world.ball.owner === player) {
      pushBall(player, deltaTime, world.ball);
    }

    for (const other of world.players) {
      pushAway(player, other, 5);
    }
  }

  world.isStarting = false;

  world.ball.position.mulAdd(world.ball.velocity, deltaTime);

  for (const goal of world.goals) {
    if (goal.rect.contains(world.ball.position)) {
      world.ball.teamControl = goal.team;
      reset(world);
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
  const controlModifier = player.team === ball.teamControl ? 2 : 0.3;
  if (Math.random() < (player.control * controlModifier) / 100) {
    ball.owner = player;
    ball.velocity.set(0, 0);
    ball.teamControl = player.team;
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

function reset(world: World) {
  world.isStarting = true;

  world.ball.position.set(0, 0);
  world.ball.velocity.set(0, 0);
  world.ball.owner = undefined;

  for (const player of world.players) {
    player.position.set(player.defensivePosition);
  }
}
