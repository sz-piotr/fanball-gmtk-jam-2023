import { Vector2 } from "../../math/Vector2";
import { assert } from "../../utils/assert";
import { playShortWhistle } from "../sounds";
import { Player, World } from "../types";

export function handleOut(world: World) {
  if (!world.ball.velocity.isZero()) {
    if (!world.field.rect.contains(world.ball.position)) {
      playShortWhistle();
      world.banner.image =
        world.ball.lastTouchedBy === "red" ? "blue-out" : "red-out";
      world.banner.timeLeft = 2;

      let isGoalkeeper = false;
      if (
        world.ball.position.x < world.field.rect.position.x ||
        world.ball.position.x >
          world.field.rect.position.x + world.field.rect.size.x
      ) {
        // TODO: handle corner
        isGoalkeeper = true;
      }

      world.ball.position.clamp(
        world.field.rect.position,
        world.field.rect.position.clone().add(world.field.rect.size)
      );
      world.ball.velocity.set(0, 0);

      if (world.gameState.type === "Playing") {
        if (isGoalkeeper) {
          const startingPlayer = world.players.find(
            (p) => p.team !== world.ball.lastTouchedBy && p.isGoalkeeper
          );

          assert(startingPlayer, "Missing starting player!");
          world.ball.position.set(startingPlayer.offensivePosition);
          world.gameState = {
            type: "GoalkeeperKick",
            startingPlayer,
            timeRemaining: Infinity,
          };
        } else {
          let startingPlayer: Player | undefined;
          let minDistance = Infinity;
          for (const player of world.players) {
            if (player.team !== world.ball.lastTouchedBy) {
              const distance = Vector2.distance2(
                world.ball.position,
                player.position
              );
              if (distance < minDistance) {
                minDistance = distance;
                startingPlayer = player;
              }
            }
          }

          assert(startingPlayer, "Missing starting player!");

          world.gameState = {
            type: "OutKick",
            startingPlayer,
            timeRemaining: Infinity,
          };
        }
      }
    }
  }
}
