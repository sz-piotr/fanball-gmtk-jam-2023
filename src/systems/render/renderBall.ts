import { World } from "../types";
import { toScreenSpace } from "./toScreenSpace";

export function renderBall(ctx: CanvasRenderingContext2D, world: World) {
  const ballPosition = toScreenSpace(world.ball.position, world);
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(ballPosition.x, ballPosition.y, 10, 0, 2 * Math.PI);
  ctx.fill();
}
