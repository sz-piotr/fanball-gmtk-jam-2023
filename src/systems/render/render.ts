import { getAssets } from "./getAssets";

import backgroundUrl from "../../images/background.png";
import { World } from "../types";

const backgroundImage = new Image();
backgroundImage.src = backgroundUrl;

export function render(world: World) {
  const { ctx } = world;
  const { width, height } = world.canvas;

  const scale = (width * 0.8) / world.field.rect.size.x;

  function toScreenSpace(vector: { x: number; y: number }) {
    const SCREEN_X1 = 107;
    const SCREEN_W1 = width - 2 * SCREEN_X1;
    const SCREEN_Y1 = 309;

    const SCREEN_X2 = 24;
    const SCREEN_W2 = width - 2 * SCREEN_X2;
    const SCREEN_Y2 = 584;

    const SCREEN_CENTER_X = width / 2;
    const SCREEN_CENTER_Y = (SCREEN_Y2 + SCREEN_Y1) / 2;

    const slopeX = (SCREEN_W2 - SCREEN_W1) / (SCREEN_Y2 - SCREEN_Y1);
    const scaleY = (SCREEN_Y2 - SCREEN_Y1) / world.field.rect.size.y;
    // TODO: Y is actually calculated incorrectly
    const y = vector.y * scaleY + SCREEN_CENTER_Y;
    const yOffset = y - SCREEN_Y1;
    const yWidth = SCREEN_W1 + yOffset * slopeX;
    const scaleX = yWidth / world.field.rect.size.x;

    return {
      x: vector.x * scaleX + SCREEN_CENTER_X,
      y: vector.y * scaleY + SCREEN_CENTER_Y,
    };
  }

  function fillRect(x: number, y: number, width: number, height: number) {
    ctx.beginPath();
    const topLeft = toScreenSpace({ x, y });
    ctx.moveTo(topLeft.x, topLeft.y);
    const topRight = toScreenSpace({ x: x + width, y });
    ctx.lineTo(topRight.x, topRight.y);
    const bottomRight = toScreenSpace({ x: x + width, y: y + height });
    ctx.lineTo(bottomRight.x, bottomRight.y);
    const bottomLeft = toScreenSpace({ x, y: y + height });
    ctx.lineTo(bottomLeft.x, bottomLeft.y);
    ctx.closePath();
    ctx.fill();
  }

  ctx.clearRect(0, 0, width, height);

  ctx.drawImage(backgroundImage, 0, 0, width, height);

  // ctx.fillStyle = "limegreen";
  // fillRect(
  //   world.field.rect.position.x,
  //   world.field.rect.position.y,
  //   world.field.rect.size.x,
  //   world.field.rect.size.y
  // );

  for (const goal of world.goals) {
    ctx.fillStyle = goal.team;
    fillRect(
      goal.rect.position.x,
      goal.rect.position.y,
      goal.rect.size.x,
      goal.rect.size.y
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
