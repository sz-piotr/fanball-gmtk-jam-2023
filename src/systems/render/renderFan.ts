import { getFanAssets } from "./getAssets";
import { Fan } from "../types";

export function renderFan(ctx: CanvasRenderingContext2D, fan: Fan) {
  const assets = getFanAssets(fan);

  const IMAGE_SCALE = 0.4;

  const BODY_IMG_WIDTH = 100 * IMAGE_SCALE;
  const BODY_IMG_HEIGHT = 200 * IMAGE_SCALE;
  const BODY_IMG_CENTER_X = 50 * IMAGE_SCALE;
  const BODY_IMG_CENTER_Y = 134 * IMAGE_SCALE;

  ctx.drawImage(
    assets.body,
    fan.animation.position.x - BODY_IMG_CENTER_X,
    fan.animation.position.y - BODY_IMG_CENTER_Y,
    BODY_IMG_WIDTH,
    BODY_IMG_HEIGHT
  );

  ctx.drawImage(
    assets.hair,
    fan.animation.position.x - BODY_IMG_CENTER_X,
    fan.animation.position.y - BODY_IMG_CENTER_Y,
    BODY_IMG_WIDTH,
    BODY_IMG_HEIGHT
  );
}
