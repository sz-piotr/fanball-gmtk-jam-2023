import { Vector2 } from "../math/Vector2";
import { Input } from "./input/inputSystem";
import { Ball, Player, World } from "./world";

export function updateWorld(world: World, input: Input, deltaTime: number) {
  for (const player of world.players) {
    if (world.ball.owner !== player) {
      if (world.ball.owner === undefined) {
        moveToBall(world.ball, player, deltaTime);
        captureBall(player, world.ball);
      } else {
        moveToPosition(world.ball.owner.team, player, deltaTime);
      }
    } else {
      moveWithBall(player, deltaTime, world.ball);
    }

    for (const other of world.players) {
      pushAway(player, other, 5);
    }
  }

  for (const goal of world.goals) {
    if (goal.rect.contains(world.ball.position)) {
      reset(world);
    }
  }
}

function moveWithBall(player: Player, deltaTime: number, ball: Ball) {
  const direction = player.team === "red" ? 1 : -1;
  player.position.add(player.speed * 0.7 * deltaTime * direction, 0);
  ball.position
    .set(player.position)
    .add((player.controlRadius / 2) * direction, 0);
}

function moveToPosition(
  ballTeam: "red" | "blue",
  player: Player,
  deltaTime: number
) {
  const targetPosition =
    ballTeam === player.team
      ? player.offensivePosition
      : player.defensivePosition;
  const offset = targetPosition
    .clone()
    .sub(player.position)
    .normalize()
    .mul(player.speed * deltaTime);
  player.position.add(offset);
}

function captureBall(player: Player, ball: Ball) {
  const distance2 = Vector2.distance2(player.position, ball.position);
  const radius2 = player.controlRadius * player.controlRadius;
  if (distance2 >= radius2) {
    return;
  }
  if (Math.random() < player.control / 100) {
    ball.owner = player;
  }
}

function moveToBall(ball: Ball, player: Player, deltaTime: number) {
  const toBall = ball.position
    .clone()
    .sub(player.position)
    .normalize()
    .mul(player.speed * deltaTime);
  player.position.add(toBall);
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
  world.ball.position.set(0, 0);
  world.ball.owner = undefined;
  for (const player of world.players) {
    player.position.set(player.defensivePosition);
  }
}
