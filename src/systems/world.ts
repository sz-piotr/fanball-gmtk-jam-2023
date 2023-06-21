import * as THREE from "three";
import fragmentShader from "../shaders/shader.frag?raw";
import vertexShader from "../shaders/shader.vert?raw";

export interface World {
  camera: THREE.PerspectiveCamera;
  renderer: THREE.Renderer;

  scene: THREE.Scene;
  cube: THREE.Mesh;
}

export function initWorld(): World {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    vertexShader,
  });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 3;

  return { scene, camera, renderer, cube };
}

export function renderWorld(world: World) {
  world.renderer.render(world.scene, world.camera);
}
