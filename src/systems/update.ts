import { Input } from "./input/inputSystem";
import { World } from "./world";

export function updateWorld(world: World, input: Input) {
  if (input.isPressed("left")) {
    world.cube.rotation.y -= 0.01;
  }
  if (input.isPressed("right")) {
    world.cube.rotation.y += 0.01;
  }
  if (input.isPressed("up")) {
    world.cube.rotation.x -= 0.01;
  }
  if (input.isPressed("down")) {
    world.cube.rotation.x += 0.01;
  }
}
