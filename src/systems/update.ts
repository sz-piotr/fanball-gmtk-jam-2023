import { Vector2 } from "../math/Vector2";
import { Input } from "./input/inputSystem";
import { Ball, Goal, Player, World } from "./types";

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

      shootBall(player, world.ball, world.goals);
      passBall(player, world);
    }

    for (const other of world.players) {
      pushAway(player, other, 5);
    }
  }

  world.ball.position.mulAdd(world.ball.velocity, deltaTime);

  for (const goal of world.goals) {
    if (goal.rect.contains(world.ball.position)) {
      reset(world);
    }
  }
}

function moveWithBall(player: Player, deltaTime: number, ball: Ball) {
  if (!ball.velocity.isZero()) {
    if (!isNearPlayer(player, ball.position)) {
      ball.owner = undefined;
    }
    return;
  }
  const direction = player.team === "red" ? 1 : -1;
  player.position.add(player.speed * 0.7 * deltaTime * direction, 0);
  ball.position
    .set(player.position)
    .add((player.controlRadius / 2) * direction, 0);
}

function shootBall(player: Player, ball: Ball, goals: Goal[]) {
  if (!ball.velocity.isZero()) {
    return;
  }
  const targetGoal = goals.find((x) => x.team !== player.team);
  if (!targetGoal) {
    return;
  }

  const distance2 = Vector2.distance2(ball.position, targetGoal.center);
  if (distance2 < 50 * 50) {
    ball.velocity = targetGoal.center
      .clone()
      .sub(ball.position)
      .normalize()
      .mul(100);
  }
}

function passBall(player: Player, world: World) {
  if (!world.ball.velocity.isZero()) {
    return;
  }
  const targetGoal = world.goals.find((x) => x.team !== player.team);
  if (!targetGoal) {
    return;
  }

  let closest = player;
  let minDistance = Vector2.distance2(player.position, targetGoal.center);
  for (const other of world.players) {
    const distance = Vector2.distance2(other.position, targetGoal.center);
    if (distance < minDistance && other.team === player.team) {
      closest = other;
    }
  }

  if (closest === player) {
    return;
  }

  const speed = (player.team === "red" ? 1 : -1) * player.speed;

  world.ball.velocity = closest.position
    .clone()
    .sub(world.ball.position)
    .normalize()
    .mul(40)
    .add(speed, 0);
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
  world.ball.velocity.set(0, 0);
  world.ball.owner = undefined;

  for (const player of world.players) {
    player.position.set(player.defensivePosition);
  }
}
