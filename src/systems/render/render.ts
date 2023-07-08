import { World } from "../types";
import { getAssets } from "./getAssets";

export function render(world: World) {
  const { ctx } = world;
  const { width, height } = world.canvas;

  const scale = (width * 0.8) / world.field.rect.size.x;

  function toScreenSpace(vector: { x: number; y: number }) {
    return {
      x: vector.x * scale + width / 2,
      y: vector.y * scale + height / 2,
    };
  }

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "darkgreen";
  ctx.fillRect(0, 0, width, height);

  const fieldPosition = toScreenSpace(world.field.rect.position);
  ctx.fillStyle = "limegreen";
  ctx.fillRect(
    fieldPosition.x,
    fieldPosition.y,
    world.field.rect.size.x * scale,
    world.field.rect.size.y * scale
  );

  for (const goal of world.goals) {
    ctx.fillStyle = goal.team;
    const position = toScreenSpace(goal.rect.position);
    ctx.fillRect(
      position.x,
      position.y,
      goal.rect.size.x * scale,
      goal.rect.size.y * scale
    );
  }

  const ballPosition = toScreenSpace(world.ball.position);
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ballPosition.x, ballPosition.y, 10, 0, 2 * Math.PI);
  ctx.fill();

  world.players.sort((a, b) => a.position.y - b.position.y);

  for (const player of world.players) {
    const position = toScreenSpace(player.position);
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.arc(
      position.x,
      position.y,
      player.controlRadius * scale,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }

  for (const player of world.players) {
    const position = toScreenSpace(player.position);
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(position.x, position.y, 3, 0, 2 * Math.PI);
    ctx.fill();

    const assets = getAssets(player);

    const leftLegRotation = player.animation.leftLeg.rotation;
    const rightLegRotation = player.animation.rightLeg.rotation;
    const leftLegStraight = player.animation.leftLeg.isStraight;
    const rightLegStraight = player.animation.rightLeg.isStraight;

    const IMAGE_SCALE = 0.3;

    const BODY_IMG_WIDTH = 100 * IMAGE_SCALE;
    const BODY_IMG_HEIGHT = 200 * IMAGE_SCALE;
    const BODY_IMG_CENTER_X = 50 * IMAGE_SCALE;
    const BODY_IMG_CENTER_Y = 180 * IMAGE_SCALE;

    const topX = position.x - BODY_IMG_CENTER_X;
    const topY = position.y - BODY_IMG_CENTER_Y;

    if (player.animation.direction === -1) {
      ctx.translate(topX + BODY_IMG_WIDTH, topY);
      ctx.scale(-1, 1);
    } else {
      ctx.translate(topX, topY);
    }

    drawRotatedImage(
      ctx,
      leftLegStraight ? assets.legStraight : assets.legBent,
      leftLegStraight ? 0 : -20 * IMAGE_SCALE,
      0,
      BODY_IMG_WIDTH,
      BODY_IMG_HEIGHT,
      (leftLegStraight ? 42 : 62) * IMAGE_SCALE,
      131 * IMAGE_SCALE,
      leftLegRotation
    );
    drawRotatedImage(
      ctx,
      rightLegStraight ? assets.legStraight : assets.legBent,
      rightLegStraight ? 20 * IMAGE_SCALE : 0,
      0,
      BODY_IMG_WIDTH,
      BODY_IMG_HEIGHT,
      (rightLegStraight ? 42 : 62) * IMAGE_SCALE,
      131 * IMAGE_SCALE,
      rightLegRotation
    );
    ctx.drawImage(assets.body, 0, 0, BODY_IMG_WIDTH, BODY_IMG_HEIGHT);

    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }
}

function drawRotatedImage(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement,
  x: number,
  y: number,
  width: number,
  height: number,
  centerX: number,
  centerY: number,
  angle: number
) {
  ctx.save();
  ctx.translate(x + centerX, y + centerY);
  ctx.fillStyle = "black";
  ctx.rotate(angle);
  ctx.translate(-x - centerX, -y - centerY);
  ctx.drawImage(image, x, y, width, height);
  ctx.restore();
}
