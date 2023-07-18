import "./styles.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import loadGrassTextures from "./config/GrassTexture";
import { loadModelsGltf } from "./config/ModelsGltf";
import { loadModelsObj } from "./config/ModelsObj";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import Parachutist from "./physics/parachutist";

// GUI setup
const gui = new dat.GUI();
gui.close();

const updateGUIWidth = (mediaQuery) => {
  gui.width = mediaQuery.matches ? 150 : 250;
};
const parachutefolder = gui.addFolder("Parachute");
parachutefolder.open();
const mediaQuery = window.matchMedia("(max-width: 425px)");
updateGUIWidth(mediaQuery);
mediaQuery.addListener(updateGUIWidth);


let windAngle = Math.PI / 2;
let axesHelper = false;
let radiusUmbrella = 2;
let height = 2000;
let manMass = 80;

let umbrellaMass = 10;
let windSpeed = new THREE.Vector3(0, 0, 0);
const paramters = {
  windAngle: Math.PI / 2,
  axesHelper: false,
  radiusUmbrella: 2,
  height: 2000,
  manMass: 80,
  umbrellaMass: 10,
};


parachutefolder
  .add(paramters, "windAngle", 0, 100, 0.1)
  .name("windAngle")
  .onChange(() => {
    windAngle = paramters.windAngle;
  });

parachutefolder
  .add(paramters, "axesHelper")
  .name("axesHelper")
  .onChange(() => {
    axesHelper = paramters.axesHelper;
  });
parachutefolder
  .add(paramters, "radiusUmbrella", 0, 5, 0.1)
  .name("radiusUmbrella")
  .onChange(() => {
    radiusUmbrella = paramters.radiusUmbrella;
  });
parachutefolder
  .add(paramters, "height", 0, 20000, 10)
  .name("height")
  .onChange(() => {
    modelsGroup.position.y=paramters.height;
    height = paramters.height;
  });

parachutefolder
  .add(paramters, "manMass", 0, 200, 1)
  .name("manMass")
  .onChange(() => {
    manMass = paramters.manMass;
  });

parachutefolder
  .add(paramters, "umbrellaMass", 0, 50, 1)
  .name("umbrellaMass")
  .onChange(() => {
    umbrellaMass = paramters.umbrellaMass;
  });
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
const modelsGroup = new THREE.Group();

// Background setup
const texture = textureLoader.load("textures/skybox/FS002_Day.png", () => {
  const rt = new THREE.WebGLCubeRenderTarget(texture.image.height * 5);
  rt.fromEquirectangularTexture(renderer, texture);
  scene.background = rt.texture;
});
// Models
let manModel, airplanModel, parachuteModel;
// Load textures and models
const grassTextures = loadGrassTextures(textureLoader);
loadModelsGltf(scene, gltfLoader, (parachute) => {
  parachuteModel = parachute;
  modelsGroup.add(parachuteModel);
});
loadModelsObj(scene, objLoader, (loadedModel1) => {
  manModel = loadedModel1;
  modelsGroup.add(manModel);
}, (loadedModel2) => {
  airplanModel = loadedModel2;
});
scene.add(modelsGroup);

// Event listeners
//document.addEventListener('mousemove', onMouseMove);
document.addEventListener('keydown', function (event) {
  if (event.key === 'o') {
    scaleParachute();
  }
  if (event.key === 'w') {
    physics();
  }
});
window.addEventListener("dblclick", toggleFullScreen);
window.addEventListener("resize", onWindowResize);

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
  new THREE.PlaneBufferGeometry(3000, 3000, 1000, 1000),
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
modelsGroup.position.y = height;

const p = new Parachutist();
const valuesContainer = document.getElementById("values-container");
let displacement = new THREE.Vector3();
let velocity = new THREE.Vector3(0, 0, 0);
let tensileForce = new THREE.Vector3(0, 0, 0);
let surfaceArea = Math.PI * radiusUmbrella * radiusUmbrella;
const groundPosition = new THREE.Vector3(0, 0, 0);
let newVelocity=new THREE.Vector3(0, 0, 0), newDisplacement=new THREE.Vector3(0, 0, 0), newAcceleration=new THREE.Vector3(0, 0, 0), dragForce=new THREE.Vector3(0, 0, 0), weightForce =new THREE.Vector3(0, 0, 0);
valuesContainer.innerHTML = `
<p>Position: ${modelsGroup.position.x.toFixed(2)}, ${modelsGroup.position.y.toFixed(2)}, ${modelsGroup.position.z.toFixed(2)}</p>
<p>Acceleration: ${newAcceleration.x.toFixed(2)}, ${newAcceleration.y.toFixed(2)}, ${newAcceleration.z.toFixed(2)}</p>
<p>Velocity: ${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}, ${velocity.z.toFixed(2)}</p>
<p>DragForce: ${dragForce.x.toFixed(2)}, ${dragForce.y.toFixed(2)}, ${dragForce.z.toFixed(2)}</p>
<p>WeightForce: ${weightForce.x.toFixed(2)},${weightForce.y.toFixed(2)}, ${dragForce.z.toFixed(2)}</p>
`;
const update = (delta) => {
  if (modelsGroup.position.y > groundPosition.y) {
    // Update the surface area of the parachute as it opens
    surfaceArea = Math.PI * radiusUmbrella * radiusUmbrella * scaleOfParrchute / 50;

    let result = p.calculateDisplacement(delta, manMass, umbrellaMass, velocity, displacement, surfaceArea, windSpeed, tensileForce);
    newVelocity=result.newVelocity;
    newDisplacement=result.newDisplacement;
    newAcceleration=result.newAcceleration;
    dragForce=result.dragForce;
    weightForce=result.weightForce;
    velocity.copy(newVelocity);
     displacement.copy(newDisplacement);
     modelsGroup.position.copy(p.updatePosition(modelsGroup.position, displacement));
     valuesContainer.innerHTML = `
     <p>Position: ${modelsGroup.position.x.toFixed(2)}, ${modelsGroup.position.y.toFixed(2)}, ${modelsGroup.position.z.toFixed(2)}</p>
     <p>Acceleration: ${newAcceleration.x.toFixed(2)}, ${newAcceleration.y.toFixed(2)}, ${newAcceleration.z.toFixed(2)}</p>
     <p>Velocity: ${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}, ${velocity.z.toFixed(2)}</p>
     <p>DragForce: ${dragForce.x.toFixed(2)}, ${dragForce.y.toFixed(2)}, ${dragForce.z.toFixed(2)}</p>
     <p>WeightForce: ${weightForce.x.toFixed(2)},${weightForce.y.toFixed(2)}, ${dragForce.z.toFixed(2)}</p>
     `;
   } else {
     velocity.set(0, 0, 0);
   }
};

let scaleOfParrchute = 0;// Animation loop


const tick = () => {
  if (airplanModel) {
    airplanModel.position.x += 3;

  }


  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

const scaleParachute = () => {
  if (scaleOfParrchute <= 50) {
    parachuteModel.position.y = scaleOfParrchute + 30;
    parachuteModel.scale.set(scaleOfParrchute, scaleOfParrchute, scaleOfParrchute);
    scaleOfParrchute += 0.5;
    requestAnimationFrame(scaleParachute);
  }
};

const clock = new THREE.Clock();
let oldElapsedTime = 0;
const physics = () => {
  console.log(paramters.gravity);
  const elapsedTime = clock.getElapsedTime();
  camera.position.set(0, modelsGroup.position.y + 20, 720);

  const deltaTime = elapsedTime - oldElapsedTime;

  update(deltaTime);
  oldElapsedTime = elapsedTime;

  requestAnimationFrame(physics);
};

tick();
