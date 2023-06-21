import { initInput, updateInput } from "./systems/input/inputSystem";
import { initResize } from "./systems/resize";
import { initStats, updateStatsBegin, updateStatsEnd } from "./systems/stats";
import { initTime, updateTime } from "./systems/time/timeSystem";
import { updateWorld } from "./systems/update";
import { initWorld, renderWorld } from "./systems/world";

function init() {
  const stats = initStats();
  const world = initWorld();
  initResize(world);
  const { keyboardInput, mappedInput } = initInput();
  const timer = initTime();

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

  const { deltaTime } = updateTime(game.timer);
  updateInput(game.keyboardInput);
  updateWorld(game.world, game.mappedInput, deltaTime);
  renderWorld(game.world);

  updateStatsEnd(game.stats);
}

const game = init();
requestAnimationFrame(gameLoop);
function gameLoop() {
  update(game);
  requestAnimationFrame(gameLoop);
}
