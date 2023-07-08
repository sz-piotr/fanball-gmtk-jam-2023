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
    const SCREEN_X1 = 19.05;
    const SCREEN_Y1 = 311.54;
    const SCREEN_W = 761.9;
    const SCREEN_H = 276.92;

    const SCREEN_CENTER_X = SCREEN_X1 + SCREEN_W / 2;
    const SCREEN_CENTER_Y = SCREEN_Y1 + SCREEN_H / 2;

    const scaleY = SCREEN_H / world.field.rect.size.y;
    const scaleX = SCREEN_W / world.field.rect.size.x;

    return {
      x: vector.x * scaleX + SCREEN_CENTER_X,
      y: vector.y * scaleY + SCREEN_CENTER_Y,
    };
  }

  ctx.clearRect(0, 0, width, height);

  ctx.drawImage(backgroundImage, 0, 0, width, height);

  const ballPosition = toScreenSpace(world.ball.position);
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ballPosition.x, ballPosition.y, 10, 0, 2 * Math.PI);
  ctx.fill();

  world.players.sort((a, b) => a.position.y - b.position.y);

  for (const player of world.players) {
    const position = toScreenSpace(player.position);

    const assets = getAssets(player);

    const leftLegRotation = player.animation.leftLeg.rotation;
    const rightLegRotation = player.animation.rightLeg.rotation;
    const leftLegStraight = player.animation.leftLeg.isStraight;
    const rightLegStraight = player.animation.rightLeg.isStraight;

    const IMAGE_SCALE = 0.4;

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

  for (const fan of world.fans) {
    ctx.fillStyle = `#0000${(fan.sector * 2).toString(16)}0`;
    ctx.fillRect(fan.position.x - 7, fan.position.y - 20, 14, 20);
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
