export const loadModelsObj = (scene, objLoader) => {
    const model1Promise = new Promise((resolve, reject) => {
      objLoader.load("models/person/Mini_Ninja.obj", (objModel) => {
        objModel.position.set(24.6, 5, 100); // Set the position of the model
        scene.add(objModel);
        resolve();
      }, null, reject);
    });
  
    const model2Promise = new Promise((resolve, reject) => {
      objLoader.load("models/airplan/piper_pa18.obj", (objModel) => {
        objModel.position.set(35, 200, 100); // Set the position of the model
        objModel.scale.set(25,25,25);
        scene.add(objModel);
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
  