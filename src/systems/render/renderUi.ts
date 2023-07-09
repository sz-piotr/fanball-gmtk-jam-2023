import { World } from "../types";

export function renderUi(world: World) {
  if (world.ui.leftTeam !== world.leftTeam) {
    world.ui.leftTeam = world.leftTeam;
    world.ui.leftTeamName.innerText = world.leftTeam === "red" ? "RED" : "BLU";
    world.ui.leftTeamScore.classList.toggle(
      "bg-red-600",
      world.leftTeam === "red"
    );
    world.ui.leftTeamScore.classList.toggle(
      "bg-blue-600",
      world.leftTeam === "blue"
    );

    world.ui.rightTeamName.innerText = world.leftTeam === "red" ? "BLU" : "RED";
    world.ui.rightTeamScore.classList.toggle(
      "bg-red-600",
      world.leftTeam === "blue"
    );
    world.ui.rightTeamScore.classList.toggle(
      "bg-blue-600",
      world.leftTeam === "red"
    );
  }

  const scores: [number, number] = [
    world.leftTeam === "red" ? world.scores.red : world.scores.blue,
    world.leftTeam === "red" ? world.scores.blue : world.scores.red,
  ];

  if (scores[0] !== world.ui.scores[0] || scores[1] !== world.ui.scores[1]) {
    world.ui.scores = scores;
    world.ui.leftTeamScore.innerText = scores[0].toString();
    world.ui.rightTeamScore.innerText = scores[1].toString();
  }

  const minutes = Math.floor(world.time.gameTime / 60);
  const seconds = Math.floor(world.time.gameTime) % 60;
  const time =
    minutes.toString().padStart(2, "0") +
    ":" +
    seconds.toString().padStart(2, "0");
  world.ui.timer.innerText = time;
}
