import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";


export const loadModelsObj = (scene, objLoader) => {
  const model1Promise = new Promise((resolve, reject) => {
    objLoader.load("models/person/Mini_Ninja.obj", (objModel) => {
      objModel.position.set(24.6, 5, 100);
      scene.add(objModel);
      resolve();
    }, null, reject);
  });

  const model2Promise = new Promise((resolve, reject) => {
  
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    mtlLoader.load("static/models/airplan/piper_pa18.mtl", (materials) => {
      materials.preload();
      objLoader.setMaterials(materials);
  
    objLoader.load("static/models/airplan/piper_pa18.obj", (object) => {
model=object;
      const textureLoader = new TextureLoader();
      const texture = textureLoader.load("static/models/airplan/piper_diffuse.jpg");
      model.traverse((child) => {
        if (child.isMesh) {
          child.material.map = texture;
        }
      });

      model.position.set(35, 200, 100);
      model.scale.set(25, 25, 25);
      scene.add(model);
      resolve();
    }, null, reject);
  })
})
  ;

  Promise.all([model1Promise, model2Promise])
    .then(() => {
      console.log("Models loaded successfully");
    })
    .catch((error) => {
      console.error("An error occurred while loading models:", error);
    });
};
