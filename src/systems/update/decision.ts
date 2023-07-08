import { Vector2 } from "../../math/Vector2";
import { assert } from "../../utils/assert";
import { Player, World } from "../types";
import {
  BePassiveIntent,
  Intent,
  MoveIntent,
  PassIntent,
  ShootIntent,
} from "./intents";

export function getIntent(player: Player, world: World) {
  const intents: Intent[] = [
    getBePassiveIntent(),
    getOffensiveMoveIntent(player, world),
    getDefensiveMoveIntent(player, world),
    getChaseBallIntent(player, world),
    getAttackIntent(player, world),
    getPassIntent(player, world),
    getShootIntent(player, world),
  ];

  intents.sort((a, b) => b.score - a.score);

  const bestIntent = intents[0];
  assert(bestIntent, "No intent!");
  return bestIntent;
}

function getBePassiveIntent(): BePassiveIntent {
  return { type: "BePassive", score: 0 };
}

function getOffensiveMoveIntent(player: Player, world: World) {
  const intent: MoveIntent = {
    type: "Move",
    target: player.offensivePosition,
    score: 0,
  };
  if (world.ball.owner?.team === player.team) {
    intent.score += 10;
  } else {
    intent.score -= 10;
  }
  if (world.ball.owner === player) {
    intent.score -= 20;
  }
  return intent;
}

function getDefensiveMoveIntent(player: Player, world: World) {
  const intent: MoveIntent = {
    type: "Move",
    target: player.defensivePosition,
    score: 0,
  };
  if (world.ball.owner?.team !== player.team) {
    intent.score += 10;
  } else {
    intent.score -= 10;
  }
  if (world.ball.owner === player) {
    intent.score -= 20;
  }
  return intent;
}

function getChaseBallIntent(player: Player, world: World) {
  const intent: MoveIntent = {
    type: "Move",
    target: world.ball.position,
    score: 0,
  };

  if (world.ball.owner !== undefined) {
    intent.score -= 20;
  } else {
    intent.score += 30;
  }

  if (player.isGoalkeeper) {
    intent.score -= 50;
  }

  return intent;
}

function getAttackIntent(player: Player, world: World) {
  const targetGoal = getTargetGoal(player, world);
  const intent: MoveIntent = {
    type: "Move",
    target: targetGoal.center,
    score: 0,
  };

  if (world.ball.owner !== player) {
    intent.score -= 50;
  } else {
    intent.score += 30;
  }

  if (player.isGoalkeeper) {
    intent.score -= 50;
  }

  return intent;
}

function getPassIntent(player: Player, world: World) {
  const intent: PassIntent = {
    type: "Pass",
    target: player.position,
    score: 0,
  };

  if (world.ball.owner !== player) {
    intent.score -= 50;
    return intent;
  }

  if (world.isStarting) {
    const closest = findClosestTeamMemberTo(player, world, player.position);
    intent.target = closest.position;
    intent.score += 100;
    return intent;
  }

  const targetGoal = getTargetGoal(player, world);
  const playerDistance = Vector2.distance2(player.position, targetGoal.center);
  const other = findClosestTeamMemberTo(player, world, targetGoal.center);
  const otherDistance = Vector2.distance2(other.position, targetGoal.center);

  if (otherDistance < playerDistance) {
    intent.target = other.position;
    intent.score += 50;
    return intent;
  }

  return intent;
}

function getShootIntent(player: Player, world: World) {
  const targetGoal = getTargetGoal(player, world);
  const intent: ShootIntent = {
    type: "Shoot",
    target: targetGoal.center,
    score: 0,
  };

  if (world.ball.owner !== player) {
    intent.score -= 50;
    return intent;
  }

  const playerDistance = Vector2.distance(player.position, targetGoal.center);
  intent.score += 100 - playerDistance;

  return intent;
}

function getTargetGoal(player: Player, world: World) {
  const targetGoal = world.goals.find((x) => x.team !== player.team);
  assert(targetGoal, "Missing goal");
  return targetGoal;
}

function findClosestTeamMemberTo(
  player: Player,
  world: World,
  position: Vector2
) {
  let closest: Player | undefined;
  let minDistance = Infinity;
  for (const other of world.players) {
    if (other.team !== player.team || other === player) {
      continue;
    }
    const distance = Vector2.distance2(other.position, position);
    if (distance < minDistance) {
      closest = other;
      minDistance = distance;
    }
  }
  assert(closest, "Missing teammates");
  return closest;
}
