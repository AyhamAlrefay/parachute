import "../render/style.css";
import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as DAT from 'dat.gui';



//DOMs
 const canvas = document.getElementById("scene");
 const velocityValueElement = document.getElementById("velocityValue");
 const accelerationValueElement = document.getElementById("accelerationValue");
 const timerElement = document.getElementById("timer");
 const XpositionElement = document.getElementById("Xposition");
 const YpositionElement = document.getElementById("Yposition");
 const ZpositionElement = document.getElementById("Zposition");
 const Frames = document.getElementById("Frames");


//VARIABLES
let displacement = new THREE.Vector3(); // Body Displacement in 3D coordinates
let velocity = new THREE.Vector3(0, 0, 0); // Initial body velocity in 3D coordinates
let falling = false;
let windSpeedDirection = new THREE.Vector3(1, 0, 0); // Wind speed direction
let tensileForceDirection = new THREE.Vector3(0, -1, 0); // Tensile force direction
let tensileForceValue = 0;   // Initial tensile forece value
let windSpeedValue = 0;  // Initial wind speed value
let windSpeed = new THREE.Vector3(0, 0, 0); // Wind speed vector
let tensileForce = new THREE.Vector3(0, 0, 0); // Tensile force vector
let surfaceArea = 5; // Initial body surface area
let bodyMass = 1; // Initial body mass
let umbrellaMass = 1; // Initial umbrella mass
let arrowHelperWind = new THREE.ArrowHelper(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 50, 0), 10, 0xff0000, 1);
let arrowHelperTensile = new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(0, 50, 0), 10, 0x00ff00, 1);





/* Global Constants */
const camera = new THREE.PerspectiveCamera(
  75,
  canvas.width / canvas.height,
  0.1,
  1000,
);
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
const controls = new OrbitControls(camera, canvas);

let { scene, body } = setupScene();

/* Lighting */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(100, 100, 10);

scene.add(ambientLight, directionalLight);

/* Functions */
const handleWindowResize = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  renderer.setSize(canvas.width, canvas.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  camera.aspect = canvas.width / canvas.height;
  camera.updateProjectionMatrix();

  controls.update();
};

const init = () => {
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.maxPolarAngle = Math.PI / 2;

  camera.position.set(0, 10, 50);
  controls.update();

  window.addEventListener("resize", handleWindowResize);
  window.addEventListener("load", handleWindowResize);

  setupGUI(body);

  displacement.clone(body.position);
  
 // velocityValueElement.textContent = `Velocity: ${velocity.length().toFixed(2)}`;
};

const groundPosition = new THREE.Vector3(0, 0, 0);
const update = (delta) => {
  if (falling && body.position.y > groundPosition.y) {
    let { newVelocity, newDisplacement, newAcceleration } = calculateDisplacement(delta, bodyMass, umbrellaMass, velocity, displacement, surfaceArea, windSpeed, tensileForce);
    velocity.copy(newVelocity);
    displacement.copy(newDisplacement);
    
    
    body.position.copy(updatePosition(body.position, displacement)); // Update the properties of the existing object
    
    arrowHelperWind.position.copy(body.position);
    arrowHelperTensile.position.copy(body.position);
    
    // velocityValueElement.textContent = `Velocity: ${newVelocity.length().toFixed(2)}`;
    // accelerationValueElement.textContent = `Acceleration: ${newAcceleration.length().toFixed(2)}`;
    // XpositionElement.textContent = `Position X: ${body.position.x.toFixed(2)}`;
    // YpositionElement.textContent = `Position Y: ${body.position.y.toFixed(2)}`;
    // ZpositionElement.textContent = `Position Z: ${body.position.z.toFixed(2)}`;
  }
};

const render = () => {
  controls.update();
  renderer.render(scene, camera);
};

export const main = () => {
  let startTime = new Date().getTime(); // تاريخ البدء لحساب الوقت
  let lastTime = new Date().getTime();
  
  const loop = () => {
    window.requestAnimationFrame(loop);
    const currentTime = new Date().getTime();
    const elapsedTime = currentTime - startTime;
    
    const delta = currentTime - lastTime;
    lastTime = currentTime;
    
    //Frames.textConten t = `Frames rate: ${Math.round(1000 / delta)}`;
    update(delta);
    
    render();
    
    const formattedTime = formatTime(elapsedTime);
    //timerElement.textContent = `Timer: ${formattedTime}`;
  };

  init();
  loop();
};

/* Main program (function calls) */
main();

function formatTime(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

function setupScene() {
  const scene = new THREE.Scene();

  // Arrow Helper ( Wind Force )
  scene.add(arrowHelperWind);

  // Arrow Helper ( Tensile Force )
  scene.add(arrowHelperTensile);

  /* Objects */
  const body = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial({ color: 0x00ffff }),
  );
  scene.add(body);

  const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(100, 100),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 }),
  );
  ground.rotation.x = -Math.PI / 2; // Rotate the ground by 90 degrees
  scene.add(ground);

  return { scene, body };
}


/* Update Functions */
function updateWindSpeedValue(value) {
  windSpeedValue = value;
}
function updateTensileForceValue(value) {
  tensileForceValue = value;
}
function updateFalling(value) {
  falling = value;
}
function updateArrowWindDirection(direction) {
  arrowHelperWind.setDirection(direction.clone().normalize());
}
function updateArrowTensileDirection(direction) {
  arrowHelperTensile.setDirection(direction.clone().normalize());
}
function updateBodyMass(value) {
  bodyMass = value;
}
function updateUmbrellaMass(value) {
  umbrellaMass = value;
}
function updateSurfaceArea(value) {
  surfaceArea = value;
}



function setupGUI(body) {
  const gui = new DAT.GUI();

  // Body Position:
  const positionFolder = gui.addFolder("Body Position (m)");
  // X
  positionFolder.add(body.position, "x", -10, 10).step(0.1).name("X").onChange(() => {
    arrowHelperWind.position.copy(body.position);
    arrowHelperTensile.position.copy(body.position);
    //DOM.XpositionElement.textContent = `Position X: ${body.position.x.toFixed(2)}`;
  });
  // Y
  positionFolder.add(body.position, "y", 0, 200).step(0.1).name("Y").onChange(() => {
    arrowHelperWind.position.copy(body.position);
    arrowHelperTensile.position.copy(body.position);
   // DOM.YpositionElement.textContent = `Position Y: ${body.position.y.toFixed(2)}`;
  }).setValue(50);
  // Z
  positionFolder.add(body.position, "z", -10, 10).step(0.1).name("Z").onChange(() => {
    arrowHelperWind.position.copy(body.position);
    arrowHelperTensile.position.copy(body.position);
    //DOM.ZpositionElement.textContent = `Position Z: ${body.position.z.toFixed(2)}`;
  });
  positionFolder.open();

  // Mass:
  const variablesFolder = gui.addFolder("Mass (kg)");
  // body mass
  variablesFolder.add({ bodyMass: bodyMass }, "bodyMass", 50, 100, 1).name("Body Mass").onChange((value) => {
    updateBodyMass(value);
  }).setValue(60);
  // umbrella mass
  variablesFolder.add({ umbrellaMass: umbrellaMass }, "umbrellaMass", 1, 5, 1).name("Umbrella Mass").onChange((value) => {
    updateBodyMass(value);
  });
  // surfaceArea
  variablesFolder.add({ surfaceArea: surfaceArea }, "surfaceArea", 1, 10, 1).name("Surface Area").onChange((value) => {
    updateSurfaceArea(value);
    body.scale.set(value, value, value);
  }).setValue(5);
  variablesFolder.open();

  // WindSpeed
  const windFolder = gui.addFolder('Wind Speed');
  // X
  windFolder.add(windSpeedDirection, 'x', -1, 1).step(0.1).name('X').onChange(() => {
    updateArrowWindDirection(windSpeedDirection);
  }).setValue(1);
  // Y
  windFolder.add(windSpeedDirection, 'y', -1, 1).step(0.1).name('Y').onChange(() => {
    updateArrowWindDirection(windSpeedDirection);
  });
  // Z
  windFolder.add(windSpeedDirection, 'z', -1, 1).step(0.1).name('Z').onChange(() => {
    updateArrowWindDirection(windSpeedDirection);
  });
  // Wind Speed Value
  windFolder.add({ windSpeedValue: windSpeedValue }, 'windSpeedValue', 0, 5, 0.1).name('Wind Speed').onChange((value) => {
        updateWindSpeedValue(value); 
  });
  windFolder.open();

  // Tensile Strength
  const TensileFolder = gui.addFolder('Tensile strength');
  // X
  TensileFolder.add(tensileForceDirection, 'x', -1, 1).step(0.1).name('X').onChange(() => {
    updateArrowTensileDirection(tensileForceDirection);
  });
  // Z
  TensileFolder.add(tensileForceDirection, 'z', -1, 1).step(0.1).name('Z').onChange(() => {
    updateArrowTensileDirection(tensileForceDirection);
  });
  // Tensile Force Value
  TensileFolder.add({ tensileForceValue: tensileForceValue }, 'tensileForceValue', 0, 10, 1).name('Tensile Force').onChange((value) => {
    updateTensileForceValue(value)
  });
  TensileFolder.open();

  // Start Button
  const startButton = { start: () => {
    tensileForce.copy(tensileForceDirection).multiplyScalar(tensileForceValue);
    windSpeed.copy(windSpeedDirection).multiplyScalar(windSpeedValue);
    updateFalling(true);
  } };
  gui.add(startButton, "start").name("Start");

  // Restart Button
  const restartButton = { restart: () => { location.reload(); } };
  gui.add(restartButton, "restart").name("Restart");
}



//PHYSICS
// Calculate the displacement based on variables

const calculateDisplacement = (delta, bodyMass, umbrellaMass, previousVelocity, previousDisplacement, surfaceArea, windSpeed, tensileForce) => {
  const gravity = new THREE.Vector3(0, 9.8, 0);
  const weightForce = new THREE.Vector3();
  const dragForce = new THREE.Vector3();
  const windForce = new THREE.Vector3();
  tensileForce = tensileForce.multiplyScalar(-1);
  const totalMass = bodyMass + umbrellaMass;
  // Calculate weight force
  weightForce.copy(gravity).multiplyScalar(totalMass);
  
  // Calculate drag force
  const airDensity = 1.2;
  const dragCoefficient = 0.5;
  const velocityMagnitude = previousVelocity.length();
  const dragMagnitude = 0.5 * airDensity * velocityMagnitude * velocityMagnitude * dragCoefficient * surfaceArea;
  dragForce.copy(previousVelocity).normalize().multiplyScalar(-dragMagnitude);
  
  // Calculate wind force
  const windVelocityMagnitude = windSpeed.length();
  const windMagnitude = 0.5 * airDensity * windVelocityMagnitude * windVelocityMagnitude * dragCoefficient * surfaceArea;
  windForce.copy(windSpeed).normalize().multiplyScalar(-windMagnitude);

  // Calculate total forces
  const totalForces = new THREE.Vector3();
  totalForces.copy(weightForce).add(dragForce).add(windForce).add(tensileForce);
  
  // Calculate acceleration based on total forces
  const newAcceleration = new THREE.Vector3();
  newAcceleration.copy(totalForces).divideScalar(totalMass);// a = F / m

  // Calculate new velocity based on the previous velocity and acceleration
  const newVelocity = new THREE.Vector3();
  newVelocity.copy(previousVelocity).add(newAcceleration.clone().multiplyScalar(delta / 1000));// v = v0 + a * t
  
  // Calculate new displacement
  // y = y0 + v0 * t + (1/2) * a * t^2
  const timeSquared = (delta / 1000) ** 2; // t^2
  const newDisplacement = new THREE.Vector3();
  newDisplacement.copy(previousDisplacement).add(previousVelocity.clone().multiplyScalar(delta / 1000)); // y = y0 + v0 * t 
  newDisplacement.add(newAcceleration.clone().multiplyScalar(0.5 * timeSquared)); // y = y + (1/2) * a * t^2

  
  // Return both velocity and displacement
  return { newVelocity, newDisplacement, newAcceleration };
};

// Update the position based on the current position and displacement
let updatePosition = (position, displacement) => {
  const newPosition = new THREE.Vector3();
  newPosition.copy(position).sub(displacement);

  // Ensure the object does not go below the ground
  newPosition.setY(Math.max(newPosition.y, 0));

  return newPosition;
};
  