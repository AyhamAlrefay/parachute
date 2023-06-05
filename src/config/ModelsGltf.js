import * as THREE from "three";

export const loadModelsGltf = (scene, gltfLoader) => {
  gltfLoader.load("models/plants/scene.gltf", (gltfModel) => {
    gltfModel.scene.scale.set(1.5, 1.5, 1.5);
    for (let i = 0; i < 130; i++) {
      const plants = gltfModel.scene.clone();
      plants.position.x = (Math.random() - 0.5) * 1300;
      if (plants.position.x > -220 && plants.position.x < 270) continue;
      plants.position.z = (Math.random() - 0.5) * 1300;
      plants.rotation.y = Math.random() * Math.PI;
      scene.add(plants);
    }
  });

  gltfLoader.load("models/fens/scene.gltf", (gltfModel) => {
    gltfModel.scene.scale.set(15, 15, 15);
    gltfModel.scene.position.set(-120, 4, 40);
    gltfModel.scene.rotation.y = Math.PI * 0.5;

    let fens;

    for (let i = -18; i < 18; i++) {
      fens = gltfModel.scene.clone();
      fens.position.z = fens.position.z * i;
      scene.add(fens);
    }
    gltfModel.scene.position.set(270, 4, 40);


    let fens2;

    for (let i = -18; i < 18; i++) {
      fens2 = gltfModel.scene.clone();
      fens2.position.z = fens2.position.z * i;
      
      scene.add(fens2);
    }
    
    gltfModel.scene.rotation.y = Math.PI;
    gltfModel.scene.position.set(24.6, 5, -800);
    let fens3;
    for (let i = -8; i < 7; i++) {
      fens3 = gltfModel.scene.clone();
      fens3.position.x += i * 25;
      scene.add(fens3);
    }
  });
};
