import { assertUnreachable } from "../../utils/assert";
import { Player, World } from "../types";
import { Intent, MoveIntent, PassIntent, ShootIntent } from "./intents";

export function executeIntent(
  intent: Intent,
  player: Player,
  world: World,
  deltaTime: number
) {
  switch (intent.type) {
    case "BePassive":
      return;
    case "Move":
      return executeMoveIntent(intent, player, world, deltaTime);
    case "Pass":
      return executePassIntent(intent, player, world);
    case "Shoot":
      return executeShootIntent(intent, player, world);
    default:
      return assertUnreachable(intent);
  }
}

function executeMoveIntent(
  intent: MoveIntent,
  player: Player,
  world: World,
  deltaTime: number
) {
  const SPEED_MODIFIER = 0.7;

  let speed = player.speed;
  if (world.ball.owner === player) {
    speed *= SPEED_MODIFIER;
  }

  const direction = intent.target.clone().sub(player.position);
  const distance = direction.length();
  const moveDistance = speed * deltaTime;
  const moveVector = direction.div(distance).mul(moveDistance);

  if (moveDistance < distance) {
    player.position.add(moveVector);
  } else {
    player.position.set(intent.target);
  }
}

function executePassIntent(intent: PassIntent, player: Player, world: World) {
  const PASS_SPEED = 40;

  let movementSpeed = (player.team === "red" ? 1 : -1) * player.speed;
  if (world.isStarting) {
    movementSpeed = 0;
  }

  world.ball.velocity = intent.target
    .clone()
    .sub(world.ball.position)
    .normalize()
    .mul(PASS_SPEED)
    .add(movementSpeed, 0)
    .rotate(getShotAngle(player));
}

function executeShootIntent(intent: ShootIntent, player: Player, world: World) {
  const SHOT_SPEED = 100;

  world.ball.velocity = intent.target
    .clone()
    .sub(world.ball.position)
    .normalize()
    .mul(SHOT_SPEED)
    .rotate(getShotAngle(player));
}

function getShotAngle(player: Player) {
  const spread = (Math.PI * (100 - player.accuracy)) / 100;
  return Math.random() * spread - spread / 2;
}
