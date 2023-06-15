import { TextureLoader } from 'three';

// Initialize the texture loader
const textureLoader = new TextureLoader();

export const loadModelsGltf = (scene, gltfLoader) => {
  // Load textures for the parachute model
  const lambert1BaseColor = textureLoader.load("models/parachute/textures/lambert1_baseColor.png");
  const lambert1Emissive = textureLoader.load("models/parachute/textures/lambert1_emissive.jpeg");
  const lambert1MetallicRoughness = textureLoader.load("models/parachute/textures/lambert1_metallicRoughness.png");
  const lambert1Normal = textureLoader.load("models/parachute/textures/lambert1_normal.png");

  // Load and add plants to the scene
  gltfLoader.load("models/plants/scene.gltf", (gltfModel) => {
    gltfModel.scene.scale.set(1.5, 1.5, 1.5);

    // Create and position 130 plants randomly
    for (let i = 0; i < 130; i++) {
      const plants = gltfModel.scene.clone();
      plants.position.x = (Math.random() - 0.5) * 1300;
      if (plants.position.x > -220 && plants.position.x < 270) continue;
      plants.position.z = (Math.random() - 0.5) * 1300;
      plants.rotation.y = Math.random() * Math.PI;
      scene.add(plants);
    }
  });

  // Load and add fens to the scene
  gltfLoader.load("models/fens/scene.gltf", (gltfModel) => {
    gltfModel.scene.scale.set(15, 15, 15);
    gltfModel.scene.position.set(-120, 4, 40);
    gltfModel.scene.rotation.y = Math.PI * 0.5;

    // Create and position fens along the z-axis
    let fens;
    for (let i = -18; i < 18; i++) {
      fens = gltfModel.scene.clone();
      fens.position.z = fens.position.z * i;
      scene.add(fens);
    }

    gltfModel.scene.position.set(270, 4, 40);

    // Create and position fens2 along the z-axis
    let fens2;
    for (let i = -18; i < 18; i++) {
      fens2 = gltfModel.scene.clone();
      fens2.position.z = fens2.position.z * i;
      scene.add(fens2);
    }

    gltfModel.scene.rotation.y = Math.PI;
    gltfModel.scene.position.set(24.6, 5, -800);

    // Create and position fens3 along the x-axis
    let fens3;
    for (let i = -8; i < 7; i++) {
      fens3 = gltfModel.scene.clone();
      fens3.position.x += i * 25;
      scene.add(fens3);
    }
  });

  // Load and add the parachute model to the scene
  gltfLoader.load("models/parachute/scene.gltf", (gltfModel) => {
    // Apply textures to the parachute model
    gltfModel.scene.traverse((child) => {
      if (child.isMesh) {
        child.material.map = lambert1BaseColor;
        child.material.emissiveMap = lambert1Emissive;
        child.material.roughnessMap = lambert1MetallicRoughness;
        child.material.normalMap = lambert1Normal;
        child.material.needsUpdate = true;
      }
    });

    // Set the position and scale of the parachute model
    gltfModel.scene.position.set(10, 150, 500);
    gltfModel.scene.scale.set(25, 25, 25);

    // Add the parachute model to the scene
    scene.add(gltfModel.scene);
  });
};
