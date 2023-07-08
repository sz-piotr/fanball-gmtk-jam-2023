import { Player } from "../types";

const LEG_SPEED = Math.PI * 2;
const MIN_ANGLE = -Math.PI / 5;
const MAX_ANGLE = Math.PI / 4;

export function updatePlayerAnimation(player: Player, deltaTime: number) {
  const stationary = player.animation.lastPosition.equals(player.position);
  const direction = stationary
    ? player.team === "red"
      ? -1
      : 1
    : player.animation.lastPosition.x > player.position.x
    ? 1
    : -1;

  player.animation.lastPosition.set(player.position);
  player.animation.direction = direction;

  if (stationary && !player.animation.isStationary) {
    player.animation.leftLeg.isStraight = true;
    player.animation.leftLeg.angularVelocity =
      -player.animation.leftLeg.rotation * 3;

    player.animation.rightLeg.isStraight = true;
    player.animation.rightLeg.angularVelocity =
      -player.animation.rightLeg.rotation * 3;
  }

  if (!stationary && player.animation.isStationary) {
    player.animation.leftLeg.isStraight = false;
    player.animation.leftLeg.angularVelocity = -LEG_SPEED;
    player.animation.rightLeg.isStraight = true;
    player.animation.rightLeg.angularVelocity = LEG_SPEED;
  }

  player.animation.isStationary = stationary;

  animateLeg(player.animation.leftLeg, deltaTime, stationary);
  animateLeg(player.animation.rightLeg, deltaTime, stationary);
}

function animateLeg(
  leg: Player["animation"]["leftLeg"],
  deltaTime: number,
  stationary: boolean
) {
  const leftLegDelta = leg.angularVelocity * deltaTime;
  if (stationary) {
    if (leftLegDelta > leg.rotation) {
      leg.rotation = 0;
      leg.angularVelocity = 0;
    } else {
      leg.rotation += leftLegDelta;
    }
    return;
  }

  const rotationBefore = leg.rotation;
  leg.rotation += leftLegDelta;

  if (leg.rotation > MAX_ANGLE) {
    leg.isStraight = true;
    leg.rotation = MAX_ANGLE;
    leg.angularVelocity *= -1;
  }

  if (leg.rotation < MIN_ANGLE) {
    leg.isStraight = false;
    leg.rotation = MIN_ANGLE;
    leg.angularVelocity *= -1;
  }
}
