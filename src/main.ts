import { initInput, updateInput } from "./systems/input/inputSystem";
import { initStats, updateStatsBegin, updateStatsEnd } from "./systems/stats";
import { initTime, updateTime } from "./systems/time/timeSystem";
import { updateWorld } from "./systems/update/update";
import { initWorld } from "./systems/world";
import { render } from "./systems/render/render";
import { initMusic } from "./systems/sounds";
import { IS_DEVELOPMENT } from "./config";

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
  document.querySelector("#score-widget")?.classList.remove("opacity-0");
  document.querySelector("#start-info")?.classList.add("hidden");
  if (IS_DEVELOPMENT) {
    document
      .querySelector("#screen-ui")
      ?.classList.add(
        "top-1/2",
        "left-1/2",
        "-translate-x-1/2",
        "-translate-y-1/2"
      );
  }
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
