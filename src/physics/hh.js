import * as THREE from "three";

class Parachutist {
  // Method to calculate displacement
  calculateDisplacement(delta, bodyMass, umbrellaMass, previousVelocity, previousDisplacement, surfaceArea, windSpeed, tensileForce) {
    const totalMass = bodyMass + umbrellaMass;
    const gravity = this.calculateGravity();
    const weightForce = this.calculateWeightForce(gravity, totalMass);
    const dragForce = this.calculateDragForce(previousVelocity, surfaceArea);
    const windForce = this.calculateWindForce(windSpeed, surfaceArea);
    const totalForces = this.calculateTotalForces(weightForce, dragForce, windForce, tensileForce);
    const newAcceleration = this.calculateAcceleration(totalForces, totalMass);
    const newVelocity = this.calculateNewVelocity(previousVelocity, newAcceleration, delta);
    const newDisplacement = this.calculateNewDisplacement(newVelocity, newAcceleration, delta);

    return { newVelocity, newDisplacement, newAcceleration, dragForce, weightForce };
  }

  // Method to calculate gravity
  calculateGravity() {
    return new THREE.Vector3(0, -9.8, 0);
  }

  // Method to calculate weight force
  calculateWeightForce(gravity, totalMass) {
    return gravity.multiplyScalar(totalMass);
  }

  // Method to calculate drag force
  calculateDragForce(previousVelocity, surfaceArea) {
    const airDensity = 1.2;
    const dragCoefficient = 0.5;
    const velocityMagnitude = previousVelocity.length();
    const dragMagnitude = 0.5 * airDensity * velocityMagnitude * velocityMagnitude * dragCoefficient * surfaceArea;
    return previousVelocity.normalize().multiplyScalar(-dragMagnitude);
  }

  // Method to calculate wind force
  calculateWindForce(windSpeed, surfaceArea) {
    const airDensity = 1.2;
    const dragCoefficient = 0.5;
    const windVelocityMagnitude = windSpeed.length();
    const windMagnitude = 0.5 * airDensity * windVelocityMagnitude * windVelocityMagnitude * dragCoefficient * surfaceArea;
    return windSpeed.multiplyScalar(windMagnitude);
  }

  // Method to calculate total forces
  calculateTotalForces(weightForce, dragForce, windForce, tensileForce) {
    return weightForce.add(dragForce).add(windForce).add(tensileForce.multiplyScalar(-1));
  }

  // Method to calculate acceleration
  calculateAcceleration(totalForces, totalMass) {
    return new THREE.Vector3().copy(totalForces).divideScalar(totalMass); // a = F / m
  }

  // Method to calculate new velocity
  calculateNewVelocity(previousVelocity, newAcceleration, delta) {
    return new THREE.Vector3().copy(previousVelocity).add(newAcceleration.clone().multiplyScalar(delta)); // v = v0 + a * t
  }

  // Method to calculate new displacement
  calculateNewDisplacement(newVelocity, newAcceleration, delta) {
    return new THREE.Vector3().add(newVelocity.clone().multiplyScalar(delta)).add(newAcceleration.clone().multiplyScalar(0.5 * delta * delta)); // y = y0 + v * t + (1/2) * a * t^2
  }

  // Method to update position
  updatePosition(position, displacement) {
    const newPosition = new THREE.Vector3();
    newPosition.copy(position).add(displacement); // Add the displacement to the current position
    newPosition.setY(Math.max(newPosition.y, 0)); // Ensure the object does not go below the ground
    return newPosition;
  }

}

export default Parachutist;
