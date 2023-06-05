import * as THREE from "three";

const loadGrassTextures = (textureLoader) => {
  const grassTextures = {};
  const grassColorTexture = textureLoader.load("textures\\grass\\7\\color.png");
 

  grassColorTexture.repeat.set(65, 65);


  grassColorTexture.wrapS = THREE.RepeatWrapping;


  grassColorTexture.wrapT = THREE.RepeatWrapping;


  grassTextures.grassColorTexture = grassColorTexture;

 

  return grassTextures;
};
export default loadGrassTextures;
