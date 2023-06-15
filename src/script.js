import "./styles.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import loadGrassTextures from "./config/GrassTexture";
import { loadModelsGltf } from "./config/ModelsGltf";
import { loadModelsObj } from "./config/ModelsObj";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

// GUI setup
const gui = new dat.GUI();
gui.close();
const updateGUIWidth = (mediaQuery) => {
  gui.width = mediaQuery.matches ? 150 : 250;
};
const mediaQuery = window.matchMedia("(max-width: 425px)");
updateGUIWidth(mediaQuery);
mediaQuery.addListener(updateGUIWidth);

// Scene setup
const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const scene = new THREE.Scene();

// Loaders setup
const loadingManager = new THREE.LoadingManager();
const gltfLoader = new GLTFLoader(loadingManager);
const objLoader = new OBJLoader(loadingManager);
const textureLoader = new THREE.TextureLoader(loadingManager);

// Background setup
const texture = textureLoader.load("textures/skybox/FS002_Day.png", () => {
  const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
  rt.fromEquirectangularTexture(renderer, texture);
  scene.background = rt.texture;
});

// Load textures and models
const grassTextures = loadGrassTextures(textureLoader);
loadModelsGltf(scene, gltfLoader);
loadModelsObj(scene, objLoader, (loadedModel1) => {
  model1 = loadedModel1;
}, (loadedModel2) => {
  model2 = loadedModel2;
});

// Event listeners
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);
document.addEventListener('mousemove', onMouseMove);
window.addEventListener("dblclick", toggleFullScreen);
window.addEventListener("resize", onWindowResize);

// Keyboard state
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  up: false,
  down: false,
  left: false,
  right: false,
};
// Event handler functions
function onKeyDown(event) {
  if (event.code === 'KeyW')  keys.w = true;
  if (event.code === 'KeyA') keys.a = true;
  if (event.code === 'KeyS') keys.s = true;
  if (event.code === 'KeyD') keys.d = true;
  if (event.code === 'ArrowUp') keys.up = true;
  if (event.code === 'ArrowDown') keys.down = true;
  if (event.code === 'ArrowLeft') keys.left = true;
  if (event.code === 'ArrowRight') keys.right = true;
}

function onKeyUp(event) {
  if (event.code === 'KeyW') keys.w = false;
  if (event.code === 'KeyA') keys.a = false;
  if (event.code === 'KeyS') keys.s = false;
  if (event.code === 'KeyD') keys.d = false;
  if (event.code === 'ArrowUp') keys.up = false;
  if (event.code === 'ArrowDown') keys.down = false;
  if (event.code === 'ArrowLeft') keys.left = false;
  if (event.code === 'ArrowRight') keys.right = false;
}

function onMouseMove(event) {
  camera.rotation.y -= event.movementX * 0.004;
  camera.rotation.x -= event.movementY * 0.004;
}

 function toggleFullScreen() {
  const fullScreen = document.fullscreenElement || document.webkitFullscreenElement;
  if (!fullScreen) {
    if (canvas.requestFullscreen) {
      canvas.requestFullscreen();
    } else if (canvas.webkitRequestFullscreen) {
      canvas.webkitRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  }
}

function onWindowResize() {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

// Camera setup
const camera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1600);
camera.position.set(0, 10, 720);
scene.add(camera);

// Lighting setup
const ambientLight = new THREE.AmbientLight("white", 0.75);
scene.add(ambientLight);

// Floor setup
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1500, 1500, 100, 100),
  new THREE.MeshStandardMaterial({
    map: grassTextures.grassColorTexture,
    aoMap: grassTextures.grassAmbientOcclusionTexture,
    displacementMap: grassTextures.grassHeightTexture,
    metalnessMap: grassTextures.grassMetalnessTexture,
    displacementScale: 2,
    normalMap: grassTextures.grassNormalTexture,
    roughnessMap: grassTextures.grassRoughnessTexture,
  })
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

// Renderer setup
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Models
let model1, model2;

// Animation loop
const tick = () => {
  // Move the models based on the keyboard input
  if (model1 && model2) {
    if (keys.w)model1.position.z -= 3;
  
    if (keys.a) model1.position.x -= 1;
    if (keys.s) model1.position.z += 3;
   
    if (keys.d) model1.position.x += 1;

    if (keys.up) model2.position.z -= 3;
    if (keys.left) model2.position.x -= 1;
    if (keys.down) model2.position.z += 3;
    if (keys.right) model2.position.x += 1;

  }

  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();


