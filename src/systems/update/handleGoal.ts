import { assert } from "../../utils/assert";
import { randomChoice } from "../../utils/random";
import { playLongWhistle } from "../sounds";
import { World } from "../types";

export function handleGoal(world: World, startingTeam: "red" | "blue") {
  playLongWhistle();

  world.scores[startingTeam === "red" ? "blue" : "red"] += 1;

  const startingPlayer = randomChoice(
    world.players.filter((p) => p.team === startingTeam && p.canStart)
  );
  assert(startingPlayer, "No starting player");

  world.gameState = {
    type: "Starting",
    startingPlayer,
    timeRemaining: Infinity,
    isGoal: true,
  };

  world.ball.position.set(0, 0);
  world.ball.velocity.set(0, 0);
  world.ball.owner = undefined;
}
