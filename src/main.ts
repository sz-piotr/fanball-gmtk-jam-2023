import * as THREE from "three";
import fragmentShader from "./shaders/shader.frag?raw";
import vertexShader from "./shaders/shader.vert?raw";

import Stats from "stats.js";

const FPS_PANEL = 0;
const stats = new Stats();
stats.showPanel(FPS_PANEL);
document.body.appendChild(stats.dom);

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

requestAnimationFrame(animate);
function animate() {
  stats.begin();

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);

  stats.end();

  requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);
function resize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight, true);
}
