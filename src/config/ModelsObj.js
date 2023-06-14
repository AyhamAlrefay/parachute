import { TextureLoader } from 'three';
const textureLoader = new TextureLoader();
let leftFoot, rightFoot;

export function animateFeet() {
  if (leftFoot && rightFoot) {
    leftFoot.rotation.z+= 1;
    rightFoot.rotation.z -= 1;
  }
}
export const loadModelsObj = (scene, objLoader, setModel1, setModel2) => {
  const ninjaTexture = textureLoader.load("models/person/textures/Ninja_T.png");
  const piperReflTexture = textureLoader.load("models/airplan/textures/piper_refl.jpg");
const piperDiffuseTexture = textureLoader.load("models/airplan/textures/piper_diffuse.jpg");
const piperBumpTexture = textureLoader.load("models/airplan/textures/piper_bump.jpg");

  
  const model1Promise = new Promise((resolve, reject) => {
    objLoader.load("models/person/Mini_Ninja.obj", (objModel) => {
      objModel.traverse((child) => {
        if (child.isMesh) {
          child.material.map = ninjaTexture;
          child.material.needsUpdate = true;
        }
        if (child.name === 'LeftFoot') {
          leftFoot = child;
        }
        if (child.name === 'RightFoot') {
          rightFoot = child;
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
          child.material.envMap = piperReflTexture;
          child.material.map = piperDiffuseTexture;
          child.material.bumpMap = piperBumpTexture;
          child.material.needsUpdate = true;
        }
      });
      objModel.position.set(35, 200, 100); // Set the position of the model
      objModel.scale.set(25, 25, 25); // Corrected line
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

