import { World } from "../types";
import { toScreenSpace } from "./toScreenSpace";

import ballPng from "../../images/ball.png";
import { drawRotatedImage } from "./drawRotatedImage";

const ballImage = new Image();
ballImage.src = ballPng;

export function renderBall(ctx: CanvasRenderingContext2D, world: World) {
  const ballPosition = toScreenSpace(world.ball.position, world);
  drawRotatedImage(
    ctx,
    ballImage,
    ballPosition.x - 10,
    ballPosition.y - 10,
    20,
    20,
    10,
    10,
    world.ball.rotation
  );
}
