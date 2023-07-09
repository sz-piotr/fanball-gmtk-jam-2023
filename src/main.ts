import { initInput, updateInput } from "./systems/input/inputSystem";
import { initStats, updateStatsBegin, updateStatsEnd } from "./systems/stats";
import { initTime, updateTime } from "./systems/time/timeSystem";
import { updateWorld } from "./systems/update/update";
import { initWorld } from "./systems/world";
import { render } from "./systems/render/render";
import { initMusic } from "./systems/sounds";

function init() {
  const stats = initStats();
  const world = initWorld();
  const { keyboardInput, mappedInput } = initInput();
  const timer = initTime();
  initMusic();

  return {
    stats,
    world,
    keyboardInput,
    mappedInput,
    timer,
  };
}

function update(game: ReturnType<typeof init>) {
  updateStatsBegin(game.stats);

  const { fixedDeltaTime, steps } = updateTime(game.timer);
  updateInput(game.keyboardInput);
  for (let i = 0; i < steps; i++) {
    updateWorld(game.world, game.mappedInput, fixedDeltaTime);
  }
  render(game.world);

  updateStatsEnd(game.stats);
}

window.addEventListener("click", onClick);
function onClick() {
  start();
  window.removeEventListener("click", onClick);
}

function start() {
  const game = init();
  requestAnimationFrame(gameLoop);
  function gameLoop() {
    update(game);
    requestAnimationFrame(gameLoop);
  }
}
