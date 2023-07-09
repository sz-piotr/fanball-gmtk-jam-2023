import hintPlanePng from "../../images/hintPlane.png";
import { World } from "../types";

const planeImage = new Image();
planeImage.src = hintPlanePng;

let planeSpeed = 0;
let planePosition = 1000;

export function renderPlane(ctx: CanvasRenderingContext2D, world: World) {
  if (world.time.gameTime > 10 * 60) {
    planeSpeed = -4;
  }

  planePosition += planeSpeed;
  ctx.drawImage(planeImage, planePosition, 12);
}
