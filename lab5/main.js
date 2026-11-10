import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);
const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 100);
camera.position.set(3, 2, 5);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.DirectionalLight(0xffffff, 2.5);
light.position.set(5, 8, 4);
scene.add(new THREE.AmbientLight(0xffffff, 0.5), light);

// Two tips and a square middle ring form a crystal with eight triangular faces.
const vertices = new Float32Array([
  0, 1.8, 0,   // 0: top
  0, -1.2, 0,  // 1: bottom
  1, 0, 0,     // 2: right
  0, 0, 1,     // 3: front
  -1, 0, 0,    // 4: left
  0, 0, -1     // 5: back
]);
const indices = [
  0, 3, 2,
  0, 4, 3,
  0, 5, 4,
  0, 2, 5,
  1, 2, 3,
  1, 3, 4,
  1, 4, 5,
  1, 5, 2
];

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
geometry.setIndex(indices);
geometry.computeVertexNormals();

const crystal = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
  color: 0x66aaff,
  roughness: 0.4,
  flatShading: true
}));
scene.add(crystal);

function animate() {
  requestAnimationFrame(animate);
  crystal.rotation.y += 0.007;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
