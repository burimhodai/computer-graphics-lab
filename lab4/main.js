import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);
const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 100);
camera.position.set(6, 7, 14);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 4, 0);

const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(4, 8, 6);
scene.add(new THREE.AmbientLight(0xffffff, 0.7), light, new THREE.GridHelper(16, 16));

const jointMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3399ff });
const handMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa55 });
const base = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32), jointMaterial);
base.position.y = 0.25;
scene.add(base);

const shoulder = new THREE.Group();
shoulder.position.y = 0.5;
base.add(shoulder);
shoulder.add(new THREE.Mesh(new THREE.SphereGeometry(0.45), jointMaterial));
const upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.7, 2.8, 0.7), armMaterial);
upperArm.position.y = 1.4;
shoulder.add(upperArm);

const elbow = new THREE.Group();
elbow.position.y = 2.8;
shoulder.add(elbow);
elbow.add(new THREE.Mesh(new THREE.SphereGeometry(0.4), jointMaterial));
const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.4, 0.6), armMaterial);
forearm.position.y = 1.2;
elbow.add(forearm);

const wrist = new THREE.Group();
wrist.position.y = 2.4;
elbow.add(wrist);
wrist.add(new THREE.Mesh(new THREE.SphereGeometry(0.3), jointMaterial));
const palm = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 0.5), handMaterial);
palm.position.y = 0.8;
wrist.add(palm);

// Four fingers on top of the palm, with the thumb on its left side.
const fingerJoints = [];
function createFinger(x, y, length, width) {
  const baseJoint = new THREE.Group();
  baseJoint.position.set(x, y, 0);
  palm.add(baseJoint);

  const lower = new THREE.Mesh(new THREE.BoxGeometry(width, length / 2, 0.3), handMaterial);
  lower.position.y = length / 4;
  baseJoint.add(lower);

  const knuckle = new THREE.Group();
  knuckle.position.y = length / 2;
  baseJoint.add(knuckle);
  const upper = new THREE.Mesh(new THREE.BoxGeometry(width, length / 2, 0.3), handMaterial);
  upper.position.y = length / 4;
  knuckle.add(upper);

  fingerJoints.push(baseJoint, knuckle);
  return baseJoint;
}

const lengths = [0.95, 1.2, 1.1, 0.8];
for (let i = 0; i < 4; i++) {
  createFinger(-0.66 + i * 0.44, 0.7, lengths[i], 0.28);
}
const thumbJoint = createFinger(-0.9, -0.25, 0.9, 0.32);
thumbJoint.rotation.z = 0.8;

shoulder.rotation.z = THREE.MathUtils.degToRad(-20);
elbow.rotation.z = THREE.MathUtils.degToRad(40);
wrist.rotation.z = THREE.MathUtils.degToRad(-20);

let curl = 0;
window.addEventListener('keydown', event => {
  const step = THREE.MathUtils.degToRad(5);
  const key = event.key.toLowerCase();
  if (key === 'q') shoulder.rotation.z += step;
  if (key === 'a') shoulder.rotation.z -= step;
  if (key === 'w') elbow.rotation.z += step;
  if (key === 's') elbow.rotation.z -= step;
  if (key === 'e') wrist.rotation.z += step;
  if (key === 'd') wrist.rotation.z -= step;
  if (key === 'f' || key === 'r') {
    curl = THREE.MathUtils.clamp(curl + (key === 'f' ? step : -step), 0, Math.PI / 3);
    fingerJoints.forEach(joint => { joint.rotation.x = curl; });
  }
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});
