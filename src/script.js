import "./styles.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/orbitcontrols";
import loadGrassTextures from "./config/GrassTexture";
import { loadModels } from "./config/Models";
import { CylinderBufferGeometry, PlaneBufferGeometry } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";
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
const mouse = new THREE.Vector2();
const scene = new THREE.Scene();
let intersectObjects = [];
const loadingBar = document.querySelector(".loadingBar");
const loadingManger = new THREE.LoadingManager(
  () => {
    gsap.delayedCall(0.5, () => {
      gsap.to(overlay.material.uniforms.uAlpha, { duration: 3, value: 0 });
      loadingBar.classList.add("ended");
      loadingBar.style.transform = "";
      document.querySelector(".screenInfo").classList.remove("hide");
    });
  },
  (itemUrl, itemsLoaded, itemsTotal) => {
    loadingBar.style.transform = "scaleX(" + itemsLoaded / itemsTotal + ")";
  }
);
const gltfLoader = new GLTFLoader(loadingManger);
const textureLoader = new THREE.TextureLoader(loadingManger);
scene.fog = new THREE.Fog(0xcce0ff, 1300, 1600);
const texture = textureLoader.load("textures/skybox/FS002_Day.png", () => {
  const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
  rt.fromEquirectangularTexture(renderer, texture);
  scene.background = rt.texture;
});
const grassTextures = loadGrassTextures(textureLoader);
loadModels(scene, gltfLoader, intersectObjects);
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
window.addEventListener("keydown", (event) => {
  if (!objectsToUpdate.length) {
    return;
  }
  if (event.code === "Digit2") {
    isCameraChasing = true;
  } else if (event.code === "Digit1") {
    isCameraChasing = false;
  }
});
window.addEventListener("resize", () => {
  size.width = window.innerWidth;
  size.height = window.innerHeight;
  camera.aspect = size.width / size.height;
  chasingCamera.aspect = size.width / size.height;
  camera.updateProjectionMatrix();
  chasingCamera.updateProjectionMatrix();
  renderer.setSize(size.width, size.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
window.addEventListener("mousemove", (event) => {
  mouse.x = event.pageX / size.width;
  mouse.y = event.pageY / size.height;
});
window.addEventListener("touchmove", (event) => {
  event.preventDefault();
  mouse.x = event.touches[0].clientX / size.width;
  mouse.y = event.touches[0].clientY / size.height;
});
let isCameraChasing = false;
const camera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  1600
);
camera.position.set(0, 10, 740);
scene.add(camera);
const chasingCamera = new THREE.PerspectiveCamera(
  45,
  size.width / size.height,
  0.1,
  1600
);
chasingCamera.position.set(0, 10, 0);
scene.add(chasingCamera);
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
const overlay = new THREE.Mesh(
  new PlaneBufferGeometry(2, 2, 1, 1),
  new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      uAlpha: { value: 1 },
    },
    vertexShader: `
        void main()
        {
            gl_Position =  vec4(position ,1.0);
        }
        `,
    fragmentShader: `
        uniform float uAlpha;
        void main() 
        {
            gl_FragColor = vec4(0.0 , 0.0 , 0.0 , uAlpha);
        }
        `,
  })
);
scene.add(overlay);
const raycaster = new THREE.Raycaster();
raycaster.far = 20;
raycaster.near = 2;
let rayDirection = new THREE.Vector3(0, 0, -10);
rayDirection.normalize();
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(size.width, size.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.physicallyCorrectLights = true;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 450;
directionalLight.shadow.camera.right = 200;
directionalLight.shadow.camera.left = -200;
directionalLight.shadow.camera.top = 200;
directionalLight.shadow.camera.bottom = -200;
directionalLight.shadow.mapSize.x = 1024;
directionalLight.shadow.mapSize.y = 1024;
directionalLight.castShadow = true;
floor.receiveShadow = true;
let objectsToUpdate = [];

const clock = new THREE.Clock();
let oldElapsedTime = 0;
//const control = new OrbitControls(camera, canvas)
const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delteTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;
  if (isCameraChasing) {
    renderer.render(scene, chasingCamera);
  } else {
    renderer.render(scene, camera);
  }
  requestAnimationFrame(tick);
};
tick();