import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020);
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.set(8, 7, 10);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);
scene.add(new THREE.AxesHelper(5));

const a = new THREE.Vector3();
const b = new THREE.Vector3();
const sum = new THREE.Vector3();
const origin = new THREE.Vector3();
const arrowA = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 1, 0xff4433);
const arrowB = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 1, 0x4488ff);
const arrowSum = new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), origin, 1, 0x44dd88);
scene.add(arrowA, arrowB, arrowSum);

function updateArrow(arrow, vector) {
  const length = vector.length();
  arrow.visible = length > 0;
  if (length > 0) {
    arrow.setDirection(vector.clone().normalize());
    arrow.setLength(length, Math.min(0.3, length * 0.2), Math.min(0.2, length * 0.15));
  }
}

function updateVectors() {
  a.set(...['ax', 'ay', 'az'].map(id => Number(document.getElementById(id).value)));
  b.set(...['bx', 'by', 'bz'].map(id => Number(document.getElementById(id).value)));
  sum.addVectors(a, b);
  updateArrow(arrowA, a);
  updateArrow(arrowB, b);
  updateArrow(arrowSum, sum);

  const dot = a.dot(b);
  const lengths = a.length() * b.length();
  const angle = lengths > 0
    ? THREE.MathUtils.radToDeg(Math.acos(THREE.MathUtils.clamp(dot / lengths, -1, 1))).toFixed(2) + ' degrees'
    : 'undefined (zero vector)';
  document.getElementById('results').textContent =
    `A + B (green): (${sum.toArray().map(n => n.toFixed(2)).join(', ')})\nA dot B: ${dot.toFixed(2)}\nAngle: ${angle}`;
}
document.querySelectorAll('input').forEach(input => input.addEventListener('input', updateVectors));
updateVectors();

// Plane equation: n dot p = d. Ray equation: p = o + t * direction.
const normal = new THREE.Vector3(0, 1, 0);
const planePoint = new THREE.Vector3(0, -1, 0);
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 12),
  new THREE.MeshBasicMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide, transparent: true, opacity: 0.25, depthWrite: false })
);
plane.rotation.x = -Math.PI / 2;
plane.position.copy(planePoint);
scene.add(plane);
plane.updateMatrixWorld(true);

const rayOrigin = new THREE.Vector3(2, 4, -1);
const direction = new THREE.Vector3(-1, -1, 1).normalize();
const d = normal.dot(planePoint);
const t = (d - normal.dot(rayOrigin)) / normal.dot(direction);
const hit = rayOrigin.clone().addScaledVector(direction, t);
scene.add(new THREE.ArrowHelper(direction, rayOrigin, t, 0xffdd33));

const point = new THREE.Mesh(new THREE.SphereGeometry(0.15), new THREE.MeshBasicMaterial({ color: 0xffdd33 }));
point.position.copy(hit);
scene.add(point);

const raycaster = new THREE.Raycaster(rayOrigin, direction);
const raycastHit = raycaster.intersectObject(plane)[0];
document.getElementById('intersection').textContent =
  `Ray-plane hit (yellow): (${hit.toArray().map(n => n.toFixed(2)).join(', ')})\nRaycaster error: ${raycastHit ? hit.distanceTo(raycastHit.point).toFixed(8) : 'no hit'}`;

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
