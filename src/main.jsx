import './index.css';

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import gsap from 'gsap';

// Secne 
const scene = new THREE.Scene();

// Create a sphere
const geometry = new THREE.SphereGeometry(3, 64, 64);
const material = new THREE.MeshStandardMaterial({ 
  color: "#00ff83",
  metalness: 0.2,
  roughness: 0.5
 });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
}

// Light
const light = new THREE.DirectionalLight(0xffffff, 1, 200);
light.intensity = 1.25;
light.position.set(0, 10, 10);
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(
  45, 
  sizes.width / sizes.height,
  0.1, 
  100
);
camera.position.z = 20;
scene.add(camera);


// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(2);
renderer.render(scene, camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 5;

// Resize
window.addEventListener('resize', () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  // update camera
  camera.updateProjectionMatrix();
  camera.aspect = sizes.width / sizes.height;
  renderer.setSize(sizes.width, sizes.height);
})

const loop = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}
loop();

// Timeline
const tl = gsap.timeline({ defaults: { duration: 1 }});
tl.fromTo(mesh.scale, { x: 0, y: 0, z: 0,}, { x: 1, y: 1, z: 1,});
tl.fromTo("nav", {y: "-100%"}, {y: "0%"});
tl.fromTo(document.querySelector(".title"), { opacity: 0 }, { opacity: 1 });

// Mouse animation Color
let mouseDown = false;
let rgb = [];
window.addEventListener("mousedown", () => (mouseDown = true));
window.addEventListener("mouseup", () => (mouseDown = false));

window.addEventListener("mousemove", (event) => {
  if (mouseDown) {
    rgb = [
      Math.round(event.pageX / sizes.width * 255),
      Math.round(event.pageY / sizes.height * 255),
      150
    ]
  }
  // lets animate
  let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
  gsap.to(mesh.material.color, { r: newColor.r, g: newColor.g, b: newColor.b });
})