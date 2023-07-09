import backgroundUrl from "../../images/background.png";
import { World } from "../types";
import { renderSector } from "./renderSector";
import { renderUi } from "./renderUi";
import { renderFan } from "./renderFan";
import { renderPlayer } from "./renderPlayer";
import { renderBall } from "./renderBall";
import { renderBanners } from "./renderBanners";

let loaded = false;
const backgroundImage = new Image();
backgroundImage.addEventListener("load", () => {
  loaded = true;
});
backgroundImage.src = backgroundUrl;

export function render(world: World) {
  const { ctx } = world;
  const { width, height } = world.canvas;

  ctx.clearRect(0, 0, width, height);
  if (!loaded) {
    return;
  }

  ctx.drawImage(backgroundImage, 0, 0, width, height);

  for (const sector of world.sectors) {
    renderSector(ctx, sector);
  }
  renderBanners(ctx, world);

  world.players.sort((a, b) => a.position.y - b.position.y);

  let ballRendered = false;
  for (const player of world.players) {
    if (!ballRendered && player.position.y > world.ball.position.y) {
      renderBall(ctx, world);
      ballRendered = true;
    }
    renderPlayer(ctx, player, world);
  }
  if (!ballRendered) {
    renderBall(ctx, world);
  }

  for (const fan of world.fans) {
    renderFan(ctx, fan);
  }

  renderUi(world);
}
