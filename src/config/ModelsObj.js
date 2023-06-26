import { TextureLoader } from 'three';
const textureLoader = new TextureLoader();


let leftFootParts = []; // Array to store the left foot parts
let rightFootParts = []; // Array to store the right foot parts
let leftFootPartsInitialPositions = []; // Array to store the initial positions of the left foot parts
let rightFootPartsInitialPositions = [];
let leftHandParts = []; // Array to store the left foot parts
let rightHandParts = []; // Array to store the right foot parts
let leftHandPartsInitialPositions = []; // Array to store the initial positions of the left foot parts
let rightHandPartsInitialPositions = [];



let isLeftFootForward = true; // Variable to track the position of the left foot
function animateLeftFoot() {
  const speed = 0.05; // Speed of the animation
  const height = 0.5; // Height of the movement
  const forwardDistance = 1.0; // Distance to move the foot forward

  leftFootParts.forEach((part, index) => {
    const offset = index * 0.1; // Offset for each part to create a staggered effect

    // Move the left foot parts up and down
    if (isLeftFootForward) {
      part.position.y = leftFootPartsInitialPositions[index].y + Math.sin(Date.now() * speed + offset) * height;
      part.position.z = 1+leftFootPartsInitialPositions[index].z - Math.sin(Date.now() * speed + offset) * forwardDistance;
     } else {
      part.position.y = leftFootPartsInitialPositions[index].y - Math.sin(Date.now() * speed + offset) * height;
      part.position.z = 1+leftFootPartsInitialPositions[index].z + Math.sin(Date.now() * speed + offset) * forwardDistance;
    }
  });
}

function animateRightFoot() {
  const speed = 0.05; // Speed of the animation
  const height = 0.5; // Height of the movement
  const forwardDistance = 1.0; // Distance to move the foot forward

  rightFootParts.forEach((part, index) => {
    const offset = index * 0.1; // Offset for each part to create a staggered effect

    // Move the right foot parts up and down
    if (isLeftFootForward) {
      part.position.y = rightFootPartsInitialPositions[index].y - Math.sin(Date.now() * speed + offset) * height;
      part.position.z =1+ rightFootPartsInitialPositions[index].z + Math.sin(Date.now() * speed + offset) * forwardDistance;
    } else {
      part.position.y = rightFootPartsInitialPositions[index].y + Math.sin(Date.now() * speed + offset) * height;
      part.position.z = 1+rightFootPartsInitialPositions[index].z - Math.sin(Date.now() * speed + offset) * forwardDistance;
    }
  });
}


export function animateFeet() {
  animateLeftFoot();
  animateRightFoot();
  isLeftFootForward = !isLeftFootForward; // Toggle the position of the left foot
}

export const loadModelsObj = (scene, objLoader, setModel1, setModel2) => {
  const ninjaTexture = textureLoader.load("models/person/textures/Ninja_T.png");
const piperDiffuseTexture = textureLoader.load("models/airplan/textures/piper_diffuse.jpg");
const model1Promise = new Promise((resolve, reject) => {
    objLoader.load("models/person/Mini_Ninja.obj", (objModel) => {
      objModel.traverse((child) => {
        if (child.isMesh) {
          child.material.map = ninjaTexture;
          child.material.needsUpdate = true;

          
          if (child.name.includes("Ninja_T01:")) {
            if (child.name.includes("Protector_Mano_IZ") || child.name.includes("Mano_IZ")) {
              leftHandParts.push(child); // Store the left foot part
              leftHandPartsInitialPositions.push(child.position.clone()); // Store the initial position of the left foot part
            } else if (child.name.includes("Protector_Mano_DE") || child.name.includes("Mano_DE")) {
              rightHandParts.push(child); // Store the right foot part
              rightHandPartsInitialPositions.push(child.position.clone()); // Store the initial position of the right foot part
            }
          
          
          
            if(child.name.includes("Pantalon_02"))
            {
              leftFootParts.push(child);
              rightFootParts.push(child); 
              leftFootPartsInitialPositions.push(child.position.clone());
              rightFootPartsInitialPositions.push(child.position.clone());
            }
            if (child.name.includes("Pie_IZ") || child.name.includes("Media_IZ") || child.name.includes("Ojota_IZ") ) {
              leftFootParts.push(child); // Store the left foot part
              leftFootPartsInitialPositions.push(child.position.clone()); // Store the initial position of the left foot part
            } else if (child.name.includes("Pie_DE") || child.name.includes("Media_DE")|| child.name.includes("Ojota_DE")) {
              rightFootParts.push(child); // Store the right foot part
              rightFootPartsInitialPositions.push(child.position.clone()); // Store the initial position of the right foot part
            }
          }
          
        }
      });
            
      objModel.position.set(24.6, 5, 100); // Set the position of the model
      scene.add(objModel);
      setModel1(objModel);
      resolve();
    }, null, reject);
  });

  const model2Promise = new Promise((resolve, reject) => {
    objLoader.load("models/airplan/piper_pa18.obj", (objModel) => {
      objModel.traverse((child) => {
        if (child.isMesh) {
          child.material.map = piperDiffuseTexture;
          child.material.needsUpdate = true;
        }
      });
      objModel.position.set(-1000, 800, -500);
      objModel.rotation.set(0, Math.PI/2, 0); 
      objModel.scale.set(20, 20, 20); // Corrected line
      scene.add(objModel);
      setModel2(objModel);
      resolve();
    }, null, reject);
  });

  Promise.all([model1Promise, model2Promise])
    .then(() => {
      console.log("Models loaded successfully");
    })
    .catch((error) => {
      console.error("An error occurred while loading models:", error);
    });
};

