import { assert } from "../../utils/assert";
import { randomChoice } from "../../utils/random";
import { World } from "../types";

export function switchSides(world: World) {
  world.switchedSides = true;
  world.leftTeam = world.leftTeam === "red" ? "blue" : "red";

  const startingTeam = world.startingTeam === "red" ? "blue" : "red";
  const startingPlayer = randomChoice(
    world.players.filter((p) => p.team === startingTeam && p.canStart)
  );
  assert(startingPlayer, "No starting player");
  world.gameState = {
    type: "Starting",
    startingPlayer,
    timeRemaining: Infinity,
    isGoal: false,
  };

  for (const player of world.players) {
    player.defensivePosition.mul(-1, 1);
    player.offensivePosition.mul(-1, 1);
  }

  for (const goal of world.goals) {
    goal.team = goal.team === "red" ? "blue" : "red";
  }

  world.ball.position.set(0, 0);
  world.ball.velocity.set(0, 0);
  world.ball.owner = undefined;
}
