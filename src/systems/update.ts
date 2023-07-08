import { Vector2 } from "../Vector2";
import { Input } from "./input/inputSystem";
import { World } from "./world";

export function updateWorld(world: World, input: Input, deltaTime: number) {
  for (const player of world.players) {
    if (world.ball.owner !== player) {
      const toBall = world.ball.position
        .clone()
        .sub(player.position)
        .normalize()
        .mul(player.speed * deltaTime);
      player.position.add(toBall);

      const distance2 = Vector2.distance2(player.position, world.ball.position);
      const radius2 = player.controlRadius * player.controlRadius;
      if (distance2 >= radius2) {
        continue;
      }

      if (Math.random() < player.control / 100) {
        world.ball.owner = player;
      }
    } else {
      player.position.add(player.speed * 0.7 * deltaTime, 0);
      world.ball.position.set(player.position).add(player.controlRadius / 2, 0);
    }

    for (const other of world.players) {
      if (player === other) {
        continue;
      }

      const distance2 = Vector2.distance2(player.position, other.position);
      const radius2 = player.controlRadius * player.controlRadius;
      if (distance2 >= radius2) {
        continue;
      }

      const push = other.position
        .clone()
        .sub(player.position)
        .normalize()
        .mul(((radius2 - distance2) / radius2) * 0.3);

      other.position.add(push);
    }
  }
}
