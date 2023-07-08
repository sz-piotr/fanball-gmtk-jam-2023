import { World } from "../types";

export function advanceGameState(world: World, deltaTime: number) {
  if (
    world.gameState.type === "Starting" ||
    world.gameState.type === "OutKick" ||
    world.gameState.type === "GoalkeeperKick"
  ) {
    world.ball.owner = world.gameState.startingPlayer;
    world.ball.lastTouchedBy = world.gameState.startingPlayer.team;

    world.gameState.timeRemaining -= deltaTime;

    if (
      world.gameState.startingPlayer.position.equals(world.ball.position) &&
      world.gameState.timeRemaining === Infinity
    ) {
      world.gameState.timeRemaining = 2;
    }

    if (world.gameState.timeRemaining < 0) {
      world.gameState = {
        type: "Playing",
        startingPlayer: world.gameState.startingPlayer,
      };
    }
  }
}
