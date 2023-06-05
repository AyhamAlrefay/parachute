import "./styles.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols";
import loadGrassTextures from "./config/GrassTexture";
import { loadModels } from "./config/Models";
import { CylinderBufferGeometry, PlaneBufferGeometry } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const gui = new dat.GUI();
gui.close();
let argument = window.matchMedia("(max-width: 425px)");
let fun = (argument) => {
  if (argument.matches) {
    gui.width = 150;
  } else {
    gui.width = 250;
  }
};
fun(argument);
argument.addListener(fun);

const size = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const scene = new THREE.Scene();

const loadingManger = new THREE.LoadingManager(
);

const gltfLoader = new GLTFLoader(loadingManger);

const textureLoader = new THREE.TextureLoader(loadingManger);

const texture = textureLoader.load("textures/skybox/FS002_Day.png", () => {
  const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
  rt.fromEquirectangularTexture(renderer, texture);
  scene.background = rt.texture;
});

const grassTextures = loadGrassTextures(textureLoader);

loadModels(scene, gltfLoader);


window.addEventListener("dblclick", () => {
  const fullScreen =
    document.fullscreenElement || document.webkitFullscreenElement;
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
});

window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  1600
);

camera.position.set(0, 10, 740);
scene.add(camera);


const ambientLight = new THREE.AmbientLight("white", 0.75);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight("white", 0.35);
directionalLight.position.copy(new THREE.Vector3(-84.5, 169.1, 696));
scene.add(directionalLight);
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
floor.material.roughness = 0.5;
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI / 2;
scene.add(floor);

const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));


const clock = new THREE.Clock();
let oldElapsedTime = 0;
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delteTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;
    renderer.render(scene, camera);
  requestAnimationFrame(tick);
};
tick();