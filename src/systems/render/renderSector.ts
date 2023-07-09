import { Sector } from "../types";

export function renderSector(ctx: CanvasRenderingContext2D, sector: Sector) {
  const offset = ((100 - sector.energy) / 100) * sector.displayArea.size.y;
  ctx.fillStyle = "lime";
  if (sector.energy < 75) {
    ctx.fillStyle = "yellow";
  }
  if (sector.energy < 50) {
    ctx.fillStyle = "orange";
  }
  if (sector.energy < 25) {
    ctx.fillStyle = "red";
  }
  ctx.fillRect(
    sector.displayArea.position.x,
    sector.displayArea.position.y + offset,
    sector.displayArea.size.x,
    sector.displayArea.size.y - offset
  );
}
