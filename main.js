import * as THREE from 'three';
import gsap from 'gsap';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import atmosphereVertexShader from './shaders/atmosphereVertex.glsl';
import atmosphereFragmentShader from './shaders/atmosphereFragment.glsl';
import { Float32BufferAttribute } from 'three';

const canvasContainer = document.querySelector('#canvasContainer');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvasContainer.offsetWidth / canvasContainer.offsetHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer(
  {
    antialias: true,
    canvas: document.querySelector('canvas')
  }
);
renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const geometry = new THREE.SphereGeometry(5, 50, 50);
const texture = new THREE.TextureLoader();
const material = new THREE.MeshBasicMaterial({
  // color: 0xFF0000,
  map: texture.load('./assets/mapEarth.jpg')
});
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    globeTexture: {
      value: texture.load('./assets/mapEarth.jpg')
    }
  }
});
const sphere = new THREE.Mesh(geometry, shaderMaterial);
scene.add(sphere);

const atmosphereGeometry = new THREE.SphereGeometry(5, 50, 50);
const atmosphereTexture = new THREE.TextureLoader();
const atmosphereMaterial = new THREE.MeshBasicMaterial({
  map: texture.load('./assets/mapEarth.jpg')
});
const atmosphereShaderMaterial = new THREE.ShaderMaterial({
  vertexShader: atmosphereVertexShader,
  fragmentShader: atmosphereFragmentShader,
  blending: THREE.AdditiveBlending,
  side: THREE.BackSide
});
const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereShaderMaterial);

atmosphere.scale.set(1.1, 1.1, 1.1)

scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
});

const starVertices = [];
for (let i = 0 ; i < 1000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -(Math.random()) * 3000;
  starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));

const starts = new THREE.Points(starGeometry, starMaterial);
scene.add(starts);

camera.position.z = 15;

const mouse = {
  x: undefined,
  y: undefined
};

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  sphere.rotation.y += 0.004;
  gsap.to(group.rotation, {
    x: -mouse.y * 0.3,
    y: mouse.x * 0.5,
    duration: 2
  });
}

animate();



addEventListener('mousemove', () => {
  mouse.x = (event.clientX / innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / innerHeight) * 2 + 1;
});