import "./styles.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import loadGrassTextures from "./config/GrassTexture";
import { loadModelsGltf } from "./config/ModelsGltf";
import { loadModelsObj ,animateFeet} from "./config/ModelsObj";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import World from "./physics/world";
import Parachutist from "./physics/parachutist";
// GUI setup
const gui = new dat.GUI();
gui.close();
const updateGUIWidth = (mediaQuery) => {
  gui.width = mediaQuery.matches ? 150 : 250;
};
const worldfolder = gui.addFolder("world");
worldfolder.open();
const mediaQuery = window.matchMedia("(max-width: 425px)");
updateGUIWidth(mediaQuery);
mediaQuery.addListener(updateGUIWidth);

const paramters = {
  windSpeed: 10,
  windAngle: Math.PI / 2,
  angular_speedX: 0,
  angular_speedY: 1,
  angular_speedZ: 0,
  axesHelper: false,
  radius: 0.5,
  gravity: 9.8,
  dragCoeff: 0.47,
  height: 0,
  tempereture: 15,
  resistanseCoeff: 0.8,
  frictionCoeff: 0.8,
  mass: 1000,
  speed: 20,
 
};
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
  const rt = new THREE.WebGLCubeRenderTarget(texture.image.height*5);
  rt.fromEquirectangularTexture(renderer, texture);
  scene.background = rt.texture;
});
// Models
let manModel, airplanModel,parachuteModel;
// Load textures and models
const grassTextures = loadGrassTextures(textureLoader);
loadModelsGltf(scene, gltfLoader,(parachute)=>{
  parachuteModel=parachute;
 modelsGroup.add(parachuteModel);
});
loadModelsObj(scene, objLoader, (loadedModel1) => {
  manModel = loadedModel1;
  modelsGroup.add(manModel);
}, (loadedModel2) => {
  airplanModel = loadedModel2;
});


scene.add(modelsGroup);

const GRAVITY = 9.8;
const HEIGHT = 0,
  TEMPERETURE = 15; // celsius
const WIND_SPEED = 10,
  WIND_ANGLE = Math.PI / 2;

  const world = new World(GRAVITY, HEIGHT, TEMPERETURE, WIND_SPEED, WIND_ANGLE);

worldfolder
  .add(paramters, "gravity", -10, 100, 0.1)
  .name("gravity")
  .onChange(() => {
    world.gravity = paramters.gravity;
  });

worldfolder
  .add(paramters, "windSpeed", 0, 100, 0.01)
  .name("Wind Speed")
  .onChange(() => {
    world.wind_speed = paramters.windSpeed;
  });
worldfolder
  .add(paramters, "windAngle", 0, 6.2831853072, 0.2)
  .name("Wind Angle")
  .onChange(() => {
    world.wind_angle = paramters.windAngle;
    rotateAboutPoint(
      flag,
      flagBase.position,
      new THREE.Vector3(0, 1, 0),
      paramters.windAngle
    );
  });
worldfolder
  .add(paramters, "height", -100, 1000, 10)
  .name("Height")
  .onChange(() => {
    world.height = paramters.height;
  });

worldfolder
  .add(paramters, "tempereture", -100, 100, 1)
  .name("Tempereture")
  .onChange(() => {
    world.tempereture = paramters.tempereture;
  });




// Event listeners

document.addEventListener('mousemove', onMouseMove);
document.addEventListener('keydown', function(event) {
  if (event.key === 'o') {
    scaleParachute();  
  }
  if(event.key==='w'){
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
modelsGroup.position.y=10000;
const p = new Parachutist();
 const valuesContainer = document.getElementById("values-container");
let displacement = new THREE.Vector3(); 
let velocity = new THREE.Vector3(0, 0, 0); 
let windSpeed = new THREE.Vector3(0, 0, 0); 
let tensileForce = new THREE.Vector3(0, 0, 0); 
let surfaceArea = 20;
let bodyMass = 50; 
let umbrellaMass = 1; 
const groundPosition = new THREE.Vector3(0, 0, 0);
const update = (delta) => {
  if (modelsGroup.position.y > groundPosition.y) {
    let { newVelocity, newDisplacement, newAcceleration } = p.calculateDisplacement(delta, bodyMass, umbrellaMass, velocity, displacement, surfaceArea, windSpeed, tensileForce);
    velocity.copy(newVelocity);
    displacement.copy(newDisplacement);
    modelsGroup.position.copy(p.updatePosition(modelsGroup.position, displacement));     
    valuesContainer.innerHTML = `
    <p>Position: ${modelsGroup.position.x.toFixed(2)}, ${modelsGroup.position.y.toFixed(2)}, ${modelsGroup.position.z.toFixed(2)}</p>
    <p>Acceleration: ${newAcceleration.x.toFixed(2)}, ${newAcceleration.y.toFixed(2)}, ${newAcceleration.z.toFixed(2)}</p>
    <p>Velocity: ${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}, ${velocity.z.toFixed(2)}</p>
`;
  
  }
};


let scaleOfParrchute=0;// Animation loop

  
const tick = () => {
  if (airplanModel) {
    airplanModel.position.x+=3;
    
  }
   
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
};

const scaleParachute = () => {
  if (scaleOfParrchute <= 50) {
    parachuteModel.position.y=scaleOfParrchute+30;
    parachuteModel.scale.set(scaleOfParrchute, scaleOfParrchute, scaleOfParrchute);
    scaleOfParrchute += 1;
    requestAnimationFrame(scaleParachute);
  }
};
const clock = new THREE.Clock();
let oldElapsedTime = 0;
const physics=()=>{
camera.position.set(0, modelsGroup.position.y+20, 720);
const elapsedTime = clock.getElapsedTime();
const delteTime = elapsedTime - oldElapsedTime;
update(delteTime*100);
  oldElapsedTime = elapsedTime;

  requestAnimationFrame(physics);
}


tick();