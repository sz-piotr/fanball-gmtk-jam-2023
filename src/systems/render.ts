import { World } from "./world";

export function render(world: World) {
  const { ctx } = world;
  const { width, height } = world.canvas;

  const scale = (width * 0.8) / world.field.width;

  function toScreenSpace(vector: { x: number; y: number }) {
    return {
      x: vector.x * scale + width / 2,
      y: vector.y * scale + height / 2,
    };
  }

  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "darkgreen";
  ctx.fillRect(0, 0, width, height);

  const fieldPosition = toScreenSpace(world.field.position);
  ctx.fillStyle = "limegreen";
  ctx.fillRect(
    fieldPosition.x,
    fieldPosition.y,
    world.field.width * scale,
    world.field.height * scale
  );

  for (const goal of world.goals) {
    ctx.fillStyle = goal.team;
    const position = toScreenSpace(goal.position);
    ctx.fillRect(
      position.x,
      position.y,
      goal.width * scale,
      goal.height * scale
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
    ctx.fillStyle = player.team;
    if (player.isGoalkeeper) {
      ctx.fillStyle = "dark" + player.team;
    }
    const position = toScreenSpace(player.position);
    ctx.fillRect(position.x - 10, position.y - 20, 20, 20);
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(position.x, position.y, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
}
