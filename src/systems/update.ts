import { Vector2 } from "../Vector2";
import { Input } from "./input/inputSystem";
import { World } from "./world";

export function updateWorld(world: World, input: Input, deltaTime: number) {
  for (const player of world.players) {
    const toBall = world.ball
      .clone()
      .sub(player.position)
      .normalize()
      .mul(player.speed * deltaTime);
    player.position.add(toBall);

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
        .mul(((radius2 - distance2) / radius2) * 0.1);

      other.position.add(push);
    }
  }
}
