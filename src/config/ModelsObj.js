import { TextureLoader } from 'three';

// Initialize the texture loader
const textureLoader = new TextureLoader();

export const loadModelsObj = (scene, objLoader, setModel1, setModel2) => {
  // Load textures for the ninja and airplane models
  const ninjaTexture = textureLoader.load("models/person/textures/Ninja_T.png");
  const piperReflTexture = textureLoader.load("models/airplan/textures/piper_refl.jpg");
  const piperDiffuseTexture = textureLoader.load("models/airplan/textures/piper_diffuse.jpg");
  const piperBumpTexture = textureLoader.load("models/airplan/textures/piper_bump.jpg");

  // Load and add the ninja model to the scene
  const model1Promise = new Promise((resolve, reject) => {
    objLoader.load("models/person/Mini_Ninja.obj", (objModel) => {
      // Apply the ninja texture to the model
      objModel.traverse((child) => {
        if (child.isMesh) {
          child.material.map = ninjaTexture;
          child.material.needsUpdate = true;
        }
      });

      // Set the position of the ninja model and add it to the scene
      objModel.position.set(24.6, 5, 100);
      scene.add(objModel);
      setModel1(objModel);
      resolve();
    }, null, reject);
  });

  // Load and add the airplane model to the scene
  const model2Promise = new Promise((resolve, reject) => {
    objLoader.load("models/airplan/piper_pa18.obj", (objModel) => {
      // Apply the airplane textures to the model
      objModel.traverse((child) => {
        if (child.isMesh) {
          child.material.envMap = piperReflTexture;
          child.material.map = piperDiffuseTexture;
          child.material.bumpMap = piperBumpTexture;
          child.material.needsUpdate = true;
        }
      });

      // Set the position and scale of the airplane model and add it to the scene
      objModel.position.set(35, 700, 100);
      objModel.scale.set(25, 25, 25);
      scene.add(objModel);
      setModel2(objModel);
      resolve();
    }, null, reject);
  });

  // Log a message when both models are loaded successfully or catch any errors
  Promise.all([model1Promise, model2Promise])
    .then(() => {
      console.log("Models loaded successfully");
    })
    .catch((error) => {
      console.error("An error occurred while loading models:", error);
    });
};
