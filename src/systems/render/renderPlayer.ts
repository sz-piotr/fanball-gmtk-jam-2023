import { getPlayerAssets } from "./getAssets";
import { Player, World } from "../types";
import { toScreenSpace } from "./toScreenSpace";
import { drawRotatedImage } from "./drawRotatedImage";

export function renderPlayer(
  ctx: CanvasRenderingContext2D,
  player: Player,
  world: World
) {
  const position = toScreenSpace(player.position, world);

  const assets = getPlayerAssets(player);

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
  ctx.drawImage(assets.hair, 0, 0, BODY_IMG_WIDTH, BODY_IMG_HEIGHT);

  ctx.setTransform(1, 0, 0, 1, 0, 0);
}
