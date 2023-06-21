import { Input } from "./input/inputSystem";
import { World } from "./world";

export function updateWorld(world: World, input: Input, deltaTime: number) {
  if (input.isPressed("left")) {
    world.cube.rotation.y -= Math.PI * deltaTime;
  }
  if (input.isPressed("right")) {
    world.cube.rotation.y += Math.PI * deltaTime;
  }
  if (input.isPressed("up")) {
    world.cube.rotation.x -= Math.PI * deltaTime;
  }
  if (input.isPressed("down")) {
    world.cube.rotation.x += Math.PI * deltaTime;
  }
}
