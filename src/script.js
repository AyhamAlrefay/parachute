import "./styles.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import loadGrassTextures from "./config/GrassTexture";
import { loadModelsGltf } from "./config/ModelsGltf";
import { loadModelsObj } from "./config/ModelsObj";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import Parachutist from "./physics/parachutist";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

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


let windAngle = 0;
let radiusUmbrella = 2;
let height = 1000;
let manMass = 80;
let umbrellaMass = 10;
let windSpeed = new THREE.Vector3(10, 0, 0);
const paramters = {
  windAngle: 0,
  windSpeed:10,
  axesHelper: false,
  radiusUmbrella: 2,
  height: 2000,
  manMass: 80,
  umbrellaMass: 10,
};


  parachutefolder
  .add(paramters, "windAngle", 0,2* Math.PI, 0.1)
  .name("windAngle")
  .onChange(() => {
      windAngle = paramters.windAngle;
    
  });
  parachutefolder
  .add(paramters, "windSpeed", 0, 100, 1)
  .name("windSpeed")
  .onChange(() => {
   
    windSpeed.set(paramters.windSpeed, 0, 0);
  });

parachutefolder
  .add(paramters, "radiusUmbrella", 0, 10, 0.1)
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
    parachutistCamera.position.set(0, paramters.height , 360);
    parachutistCamera.lookAt(modelsGroup.position);
    // controls.lookAt(modelsGroup.position);
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
const audioLoader = new THREE.AudioLoader(loadingManager);
audioLoader.load("sounds/audio1.mp3", (audioBuffer) => {
  shootingSoundEffect.setBuffer(audioBuffer);
});

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

  parachutistCamera.position.set(modelsGroup.position.x, modelsGroup.position.y , modelsGroup.position.z);
  parachutistCamera.lookAt(modelsGroup.position);

});
loadModelsObj(scene, objLoader, (loadedModel1) => {
  manModel = loadedModel1;

  modelsGroup.add(manModel);
}, (loadedModel2) => {
  airplanModel = loadedModel2;
});
scene.add(modelsGroup);

document.addEventListener('keydown', function (event) {
  if (event.key === 'o') {
    openScaleParachute();
  }
  if(event.key==='c'){
    closeScaleParachute();
  }
  if (event.key === 'w') {
    modelsGroup.position.set(airplanModel.position.x, airplanModel.position.y , airplanModel.position.z);
    physics();
  }

  if (event.key === 'ArrowUp') {
    camera.position.z -= 10; // Move the camera forward
  }
  if (event.key === 'ArrowDown') {
    camera.position.z += 10; // Move the camera backward
  }
  if (event.key === 'ArrowLeft') {
    camera.position.x -= 10; // Move the camera left
  }
  if (event.key === 'ArrowRight') {
    camera.position.x += 10; // Move the camera right
  }
});
window.addEventListener("dblclick", toggleFullScreen);
window.addEventListener("resize", onWindowResize);

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

// Parachutist camera

const parachutistCamera = new THREE.PerspectiveCamera(25, size.width / size.height, 0.1, 5000);
scene.add(parachutistCamera);

// Plane camera

const planeCamera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 2000);
planeCamera.position.set(0, 10, 720);
scene.add(planeCamera);

let activeCamera = parachutistCamera;


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

/*
    Sounds
*/
const audioListener = new THREE.AudioListener();
camera.add(audioListener);
const shootingSoundEffect = new THREE.Audio(audioListener);
scene.add(shootingSoundEffect);

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
let surfaceArea = 0.5;
const groundPosition = new THREE.Vector3(0, 0, 0);

let newVelocity=new THREE.Vector3(0, 0, 0), newDisplacement=new THREE.Vector3(0, 0, 0), newAcceleration=new THREE.Vector3(0, 0, 0), dragForce=new THREE.Vector3(0, 0, 0), weightForce =new THREE.Vector3(0, 0, 0);
valuesContainer.innerHTML = `
<p>Position: ${modelsGroup.position.x.toFixed(2)}, ${modelsGroup.position.y.toFixed(2)}, ${modelsGroup.position.z.toFixed(2)}</p>
<p>Acceleration: ${newAcceleration.x.toFixed(2)}, ${newAcceleration.y.toFixed(2)}, ${newAcceleration.z.toFixed(2)}</p>
<p>Velocity: ${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}, ${velocity.z.toFixed(2)}</p>
<p>DragForce: ${dragForce.x.toFixed(2)}, ${dragForce.y.toFixed(2)}, ${dragForce.z.toFixed(2)}</p>
<p>WeightForce: ${weightForce.x.toFixed(2)},${weightForce.y.toFixed(2)}, ${dragForce.z.toFixed(2)}</p>
`;
// Attach the camera to the modelsGroup
modelsGroup.add(parachutistCamera);
const controls = new OrbitControls(parachutistCamera, renderer.domElement);

const update = (delta) => {
  if (modelsGroup.position.y > groundPosition.y) {
    // Update the surface area of the parachute as it opens
    if(scaleOfParrchute>0)
 {
  surfaceArea = Math.PI * radiusUmbrella * radiusUmbrella ;
 }else{
   surfaceArea = 0.5;
 }

 
 let result = p.calculateDisplacement(delta, manMass, umbrellaMass, velocity, surfaceArea, windSpeed, tensileForce,windAngle);
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
     controls.target.copy(modelsGroup.position);
   } else {
     velocity.set(0, 0, 0);
     valuesContainer.innerHTML = `
     <p>Position: ${modelsGroup.position.x.toFixed(2)}, ${modelsGroup.position.y.toFixed(2)}, ${modelsGroup.position.z.toFixed(2)}</p>
     <p>Acceleration: ${newAcceleration.x.toFixed(2)}, ${newAcceleration.y.toFixed(2)}, ${newAcceleration.z.toFixed(2)}</p>
     <p>Velocity: ${velocity.x.toFixed(2)}, ${velocity.y.toFixed(2)}, ${velocity.z.toFixed(2)}</p>
     <p>DragForce: ${dragForce.x.toFixed(2)}, ${dragForce.y.toFixed(2)}, ${dragForce.z.toFixed(2)}</p>
     <p>WeightForce: ${weightForce.x.toFixed(2)},${weightForce.y.toFixed(2)}, ${dragForce.z.toFixed(2)}</p>
     `;
   }
};




let scaleOfParrchute = 0;// Animation loop

let boolSound=true;

const tick = () => {
  if (airplanModel ) {
   if(boolSound==true){
    shootingSoundEffect.play();
    boolSound=false;
   }
   if(airplanModel.position.x<1000)
    airplanModel.position.x += 3;
    
  }
  renderer.render(scene, activeCamera);
  requestAnimationFrame(tick);
};

const openScaleParachute = () => {
  if (scaleOfParrchute <= 20*radiusUmbrella) {
    parachuteModel.position.y = scaleOfParrchute + 30;
    parachuteModel.scale.set(scaleOfParrchute, scaleOfParrchute, scaleOfParrchute);
    scaleOfParrchute += 0.5;
    if (scaleOfParrchute > 20 * radiusUmbrella) {
      scaleOfParrchute -=0.5;
    }
    requestAnimationFrame(openScaleParachute);
  }
  if (modelsGroup.position.y <= groundPosition.y)
  parachuteModel.position.set(modelsGroup.position.x, modelsGroup.position.y + 20, modelsGroup.position.z);
};

const closeScaleParachute = () => {
  if (scaleOfParrchute > 0) {
    parachuteModel.scale.set(scaleOfParrchute, scaleOfParrchute, scaleOfParrchute);
    scaleOfParrchute -= 0.5;
    requestAnimationFrame(closeScaleParachute);
  }
};


const clock = new THREE.Clock();
let oldElapsedTime = 0;
const physics = () => {
  console.log(paramters.gravity);
  const elapsedTime = clock.getElapsedTime();

  parachutistCamera.position.set(0, modelsGroup.position.y , 60);
   // Update the camera's position and orientation
  parachutistCamera.lookAt(modelsGroup.position);

  const deltaTime = elapsedTime - oldElapsedTime;

  update(deltaTime);
  oldElapsedTime = elapsedTime;

  requestAnimationFrame(physics);
};


tick();