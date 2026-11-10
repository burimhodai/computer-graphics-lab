import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 12, 22);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(new THREE.PointLight(0xffffff, 300), new THREE.AmbientLight(0xffffff, 0.4));

const sun = new THREE.Mesh(
  new THREE.SphereGeometry(2, 32, 24),
  new THREE.MeshBasicMaterial({ color: 0xffbb33 })
);
scene.add(sun);

const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit);
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 24),
  new THREE.MeshStandardMaterial({ color: 0x2266ee })
);
earth.position.x = 6;
earthOrbit.add(earth);

const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit);
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.25, 24, 16),
  new THREE.MeshStandardMaterial({ color: 0xcccccc })
);
moon.position.x = 1.5;
moonOrbit.add(moon);

const marsOrbit = new THREE.Object3D();
sun.add(marsOrbit);
const mars = new THREE.Mesh(
  new THREE.SphereGeometry(0.6, 32, 24),
  new THREE.MeshStandardMaterial({ color: 0xcc5522 })
);
mars.position.x = 10;
marsOrbit.add(mars);

const phobosOrbit = new THREE.Object3D();
mars.add(phobosOrbit);
const phobos = new THREE.Mesh(
  new THREE.SphereGeometry(0.15, 24, 16),
  new THREE.MeshStandardMaterial({ color: 0x999999 })
);
phobos.position.x = 1.1;
phobosOrbit.add(phobos);

function animate() {
  requestAnimationFrame(animate);
  sun.rotation.y += 0.002;
  earthOrbit.rotation.y += 0.01;
  earth.rotation.y += 0.05;
  moonOrbit.rotation.y += 0.04;
  marsOrbit.rotation.y += 0.006;
  mars.rotation.y += 0.03;
  phobosOrbit.rotation.y += 0.03;
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
