export function drawRotatedImage(
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
