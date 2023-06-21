import { World } from "./world";

export function initResize(world: World) {
  function resize() {
    world.camera.aspect = window.innerWidth / window.innerHeight;
    world.camera.updateProjectionMatrix();
    world.renderer.setSize(window.innerWidth, window.innerHeight, true);
  }

  window.addEventListener("resize", resize);
}
