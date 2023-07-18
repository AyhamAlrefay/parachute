

import * as THREE from "three";

class parachutist {

  calculateDisplacement = (delta, bodyMass, umbrellaMass, previousVelocity, previousDisplacement, surfaceArea, windSpeed, tensileForce) => {
    const gravity = new THREE.Vector3(0, -9.8, 0);
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
    windForce.copy(windSpeed).multiplyScalar(-windMagnitude);

    // Calculate total forces
    const totalForces = new THREE.Vector3();
    totalForces.copy(weightForce).add(dragForce).add(windForce).add(tensileForce);

    // Calculate acceleration based on total forces
    const newAcceleration = new THREE.Vector3();
    newAcceleration.copy(totalForces).divideScalar(totalMass); // a = F / m


 // Calculate new velocity based on the previous velocity and acceleration

  const newVelocity = new THREE.Vector3();
  newVelocity.copy(previousVelocity).add(newAcceleration.clone().multiplyScalar(delta)); // v = v0 + a * t
// // Calculate new displacement
// const timeSquared = delta ** 2; // t^2
// const newDisplacement = new THREE.Vector3();
// newDisplacement.copy(previousDisplacement).add(newVelocity.clone().multiplyScalar(delta)); // y = y0 + v * t 
// newDisplacement.add(newAcceleration.clone().multiplyScalar(0.5 * timeSquared)); // y = y + (1/2) * a * t^2
  // Calculate new displacement
  const newDisplacement = new THREE.Vector3();
  newDisplacement.copy(previousVelocity).multiplyScalar(delta).add(newAcceleration.clone().multiplyScalar(0.5 * delta * delta)); // y = y0 + v * t + (1/2) * a * t^2

    // Return both velocity and displacement
    return { newVelocity, newDisplacement, newAcceleration, dragForce, weightForce };
  };

  updatePosition(position, displacement) {
    const newPosition = new THREE.Vector3();
    newPosition.copy(position).add(displacement); // Add the displacement to the current position
    newPosition.setY(Math.max(newPosition.y, 0)); // Ensure the object does not go below the ground
    return newPosition;
  }

}

export default parachutist;
