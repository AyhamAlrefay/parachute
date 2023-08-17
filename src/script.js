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
  radiusUmbrella: 2,
  height: 1000,
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

});
loadModelsObj(scene, objLoader, (loadedModel1) => {
  manModel = loadedModel1;

  modelsGroup.add(manModel);
}, (loadedModel2) => {
  airplanModel = loadedModel2;
});
scene.add(modelsGroup);
let mouseControlEnabled = false; // Default to mouse control
let isNewCameraActive = false;


let isRotatingX = false;
let isRotatingZ = false;
let rotationAngleX = 0;
let rotationAngleZ = 0;
const rotationSpeed = Math.PI / 180;

document.addEventListener('keydown', function (event) {
  if (event.key === 'o') {
    openScaleParachute();
  }
  if(event.key==='c'){
    closeScaleParachute();
  }
  if (event.key === 'w') {
    modelsGroup.position.set(airplanModel.position.x, airplanModel.position.y , airplanModel.position.z);
    modelsGroup.scale.set(1, 1, 1);
    physics();
    isNewCameraActive = true;
  }

  if (event.key === 'm') {
    mouseControlEnabled = !mouseControlEnabled;
  }
  
  if (event.key === 'p') {
    isNewCameraActive = !isNewCameraActive;
  }
  if (event.key === 'ArrowUp') {
    if (isNewCameraActive && !isRotatingX) {
      rotateXModelsAndCamera('up');
    }
  } else if (event.key === 'ArrowDown') {
    if (isNewCameraActive && !isRotatingX) {
      rotateXModelsAndCamera('down');
    }
  } else if (event.key === 'ArrowLeft') {
    if (isNewCameraActive && !isRotatingZ) {
      rotateZModelsAndCamera('left');
    }
  } else if (event.key === 'ArrowRight') {
    if (isNewCameraActive && !isRotatingZ) {
      rotateZModelsAndCamera('right');
    }
  }
});


function rotateXModelsAndCamera(direction) {
  isRotatingX = true;
  rotationAngleX = 0; // Reset rotation angle

  function rotateXStep() {
    if (Math.abs(rotationAngleX) < Math.PI / 9) { // Rotate by 30 degrees (π/6 radians)
      const rotationIncrement = (direction === 'up') ? rotationSpeed : -rotationSpeed;
      modelsGroup.rotation.x += rotationIncrement;
      newCamera.rotation.x += rotationIncrement;

      const moveIncrement = 1; // Adjust this value based on how much you want to move along the rotation
      modelsGroup.position.y += moveIncrement * Math.cos(modelsGroup.rotation.x);
      modelsGroup.position.z += moveIncrement * Math.sin(modelsGroup.rotation.x);
      newCamera.position.y += moveIncrement * Math.cos(newCamera.rotation.x);
      newCamera.position.z += moveIncrement * Math.sin(newCamera.rotation.x);

      rotationAngleX += rotationSpeed;
      requestAnimationFrame(rotateXStep);
    } else {
      isRotatingX = false;
    }
  }

  rotateXStep();
}

function rotateZModelsAndCamera(direction) {
  isRotatingZ = true;
  rotationAngleZ = 0; // Reset rotation angle

  function rotateZStep() {
    if (Math.abs(rotationAngleZ) < Math.PI / 9) { // Rotate by 30 degrees (π/6 radians)
      const rotationIncrement = (direction === 'right') ? rotationSpeed : -rotationSpeed;
      modelsGroup.rotation.z += rotationIncrement;
      newCamera.rotation.z += rotationIncrement;

      const moveIncrement = 1; // Adjust this value based on how much you want to move along the rotation
      modelsGroup.position.x += moveIncrement * Math.cos(modelsGroup.rotation.z);
      modelsGroup.position.y += moveIncrement * Math.sin(modelsGroup.rotation.z);
      newCamera.position.x += moveIncrement * Math.cos(newCamera.rotation.z);
      newCamera.position.y += moveIncrement * Math.sin(newCamera.rotation.z);

      rotationAngleZ += rotationSpeed;
      requestAnimationFrame(rotateZStep);
    } else {
      isRotatingZ = false;
    }
  }

  rotateZStep();
}


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
camera.position.set(0,30, 30);
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
 modelsGroup.scale.set(0, 0, 0);
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

const controls = new OrbitControls(camera, renderer.domElement);

const update = (delta) => {
   if (modelsGroup.position.y > groundPosition.y) {
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
   }  else {
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

 let scaleOfParrchute = 0;

 let boolSound=true;
const newCamera = new THREE.PerspectiveCamera(45, size.width / size.height, 0.1, 1600);
newCamera.position.set(0, 3, -10);
newCamera.rotation.y=-Math.PI ;
scene.add(newCamera);

const airplaneCamera = new THREE.PerspectiveCamera(60, size.width / size.height, 0.1, 1600);
airplaneCamera.position.set(0, 3, -10); 
airplaneCamera.rotation.y=-Math.PI / 2;
let mouseX = 0;
let mouseY = 0;
const mouseSensitivity = 0.002;

document.addEventListener('mousemove', (event) => {
  if (mouseControlEnabled) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
  }
});


 const tick = () => {
   if (airplanModel ) {
    if(boolSound==true){
     shootingSoundEffect.play();
     boolSound=false;
    }
    if(airplanModel.position.x<2000)
    { airplanModel.position.x += 3;}
     airplaneCamera.position.set(airplanModel.position.x-200, airplanModel.position.y+50,airplanModel.position.z);  
   if (isNewCameraActive === true ) {
    newCamera.position.set(modelsGroup.position.x+20, modelsGroup.position.y+50,modelsGroup.position.z-30); 
    renderer.render(scene, newCamera); 
  }
  if(isNewCameraActive === false){
    renderer.render(scene, airplaneCamera); 
  }
  }
  if (mouseControlEnabled) {
    const cameraYaw = mouseSensitivity * (mouseX - 0.5);
    const cameraPitch = mouseSensitivity * (mouseY - 0.5);
    camera.rotation.x -= cameraPitch;
    camera.rotation.y -= cameraYaw;
    renderer.render(scene, camera); 
  } else {

    
   if (isNewCameraActive === true ) {
    renderer.render(scene, newCamera); 
   }
   if(isNewCameraActive === false){
     renderer.render(scene, airplaneCamera); 
   }
   }
  
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
   const deltaTime = elapsedTime - oldElapsedTime;
   update(deltaTime);
   oldElapsedTime = elapsedTime;
   requestAnimationFrame(physics);
 };


 tick();