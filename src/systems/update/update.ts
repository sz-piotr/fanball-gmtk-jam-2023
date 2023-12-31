import { Vector2 } from "../../math/Vector2";
import { random } from "../../utils/random";
import { Input } from "../input/inputSystem";
import { boo, cheer, playLongWhistle } from "../sounds";
import { Ball, Player, World } from "../types";
import { advanceGameState } from "./advanceGameState";
import { getIntent } from "./decision";
import { executeIntent } from "./execution";
import { handleGoal } from "./handleGoal";
import { handleOut } from "./handleOut";
import { switchSides } from "./switchSides";
import { updateFanAnimation } from "./updateFanAnimation";
import { updatePlayerAnimation } from "./updatePlayerAnimation";
import { updateSector } from "./updateSector";

const HALF_TIME = 2 * 60;
const TIMER_SPEED = (45 * 60) / HALF_TIME;

export function updateWorld(world: World, input: Input, deltaTime: number) {
  advanceGameState(world, deltaTime);
  if (!world.time.paused) {
    world.time.gameTime += deltaTime * TIMER_SPEED;

    if (world.time.gameTime > 45 * 60 && !world.switchedSides) {
      world.time.gameTime = 45 * 60;
      world.time.paused = true;
      switchSides(world);
      playLongWhistle();
    }

    if (world.time.gameTime > 90 * 60) {
      world.time.gameTime = 90 * 60;
      world.time.paused = true;
      world.gameOver = true;
      world.ball.velocity.set(0, 0);

      playLongWhistle();
    }
  }

  if (world.gameOver) {
    world.banner.image =
      world.scores.blue > world.scores.red ? "you-win" : "you-lose";
    world.banner.timeLeft = Infinity;
  }

  if (world.banner.timeLeft > 0) {
    world.banner.timeLeft -= deltaTime;
    if (world.banner.timeLeft <= 0) {
      world.banner.image = undefined;
    }
  }

  let cheeringLevel = 0;
  let booingLevel = 0;
  for (const sector of world.sectors) {
    updateSector(sector, world, input, deltaTime);
    if (sector.isCheering) {
      cheeringLevel += 1;
    }
    if (sector.isBooing) {
      booingLevel += 1;
    }
  }
  cheer(cheeringLevel);
  boo(booingLevel);

  for (const player of world.players) {
    const isBooed =
      player.team === "red" &&
      world.sectors.some(
        (x) => x.isBooing && x.playerArea.contains(player.position)
      );

    const isCheered =
      player.team === "blue" &&
      world.sectors.some(
        (x) => x.isCheering && x.playerArea.contains(player.position)
      );

    if (isBooed) {
      player.accuracy = 30;
      player.control = 10;
      player.speed = 15;
    } else if (isCheered) {
      player.accuracy = 90;
      player.control = 30;
      player.speed = 30;
    } else {
      player.accuracy = player.baseAccuracy;
      player.control = player.baseControl;
      player.speed = player.baseSpeed;
    }

    const intent = getIntent(player, world);
    executeIntent(intent, player, world, deltaTime);

    if (world.gameState.type === "Playing") {
      if (world.ball.owner === undefined) {
        captureBall(player, world.ball);
      }

      if (world.ball.owner === player) {
        pushBall(player, world.leftTeam, deltaTime, world.ball);
      }
      for (const other of world.players) {
        pushAway(player, other, 5);
      }
    }

    updatePlayerAnimation(player, world.leftTeam, deltaTime);
  }

  for (const fan of world.fans) {
    updateFanAnimation(fan, deltaTime);
  }

  world.ball.rotation += world.ball.velocity.x * deltaTime;
  world.ball.position.mulAdd(world.ball.velocity, deltaTime);

  for (const goal of world.goals) {
    if (goal.rect.contains(world.ball.position)) {
      handleGoal(world, goal.team);
    }
  }

  const BALL_ACCELERATION = 0.99;
  world.ball.velocity.mul(BALL_ACCELERATION);

  handleOut(world);
}

function pushBall(
  player: Player,
  leftTeam: "red" | "blue",
  deltaTime: number,
  ball: Ball
) {
  if (!ball.velocity.isZero()) {
    if (!isNearPlayer(player, ball.position)) {
      ball.owner = undefined;
    }
    return;
  }
  const direction = player.team === leftTeam ? 1 : -1;
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

  const angle = random(-Math.PI / 20, Math.PI / 20);

  const push = other.position
    .clone()
    .sub(player.position)
    .normalize()
    .mul(((radius2 - distance2) / radius2) * strength)
    .rotate(angle);

  other.position.add(push);
}
