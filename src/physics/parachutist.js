import * as THREE from "three";

class Parachutist {
  constructor() {
    this.gravity = new THREE.Vector3(0, -9.8, 0); // Gravity vector (F_gravity = m * g)
    this.airDensity = 1.2; // Air density (rho)
    this.dragCoefficient = 0.5; // Drag coefficient (C_d)
  }

  // Calculate weight force (F_gravity = m * g)
  calculateWeightForce(totalMass) {
    const weightForce = new THREE.Vector3();
    weightForce.copy(this.gravity).multiplyScalar(totalMass);
    return weightForce;
  }

  // Calculate drag force (F_drag = 0.5 * rho * v^2 * C_d * A) 
  calculateDragForce(previousVelocity, surfaceArea) { 
    const dragForce = new THREE.Vector3() ;  
    const velocity  = previousVelocity.length() ;
    const dragMagnitude =0.5 * this.airDensity * velocity * velocity * this.dragCoefficient * surfaceArea;
    dragForce.copy(previousVelocity).normalize().multiplyScalar(-dragMagnitude);
    return dragForce;
  }

  calcWindVelo(windSpeed, wind_angle) {
  
    return new THREE.Vector3(
      Number(Math.cos(wind_angle).toFixed(2))*10 *  windSpeed.length(),
      0,
      Math.sin(wind_angle)*10 *  windSpeed.length()
    );
  }


  // Calculate total forces (F_total = F_weight + F_drag + F_wind + F_tensile)
  calculateTotalForces(
    weightForce,
    dragForce,
    windForce,
    tensileForce
  ) {
    tensileForce = tensileForce.multiplyScalar(-1);
    const totalForces = new THREE.Vector3();
    totalForces
      .copy(weightForce)
      .add(dragForce)
      .add(windForce)
      .add(tensileForce);
    return totalForces;
  }

  // Calculate acceleration based on total forces (a = F_total / m)
  calculateAcceleration(totalForces, totalMass) {
    const newAcceleration = new THREE.Vector3();
    newAcceleration.copy(totalForces).divideScalar(totalMass); // a = F / m
    return newAcceleration;
  }

  // Calculate new velocity based on the previous velocity and acceleration (v = v0 + a * t)
  calculateNewVelocity(previousVelocity, newAcceleration, delta) {
    const newVelocity = new THREE.Vector3();
    newVelocity
      .copy(previousVelocity)
      .add(newAcceleration.clone().multiplyScalar(delta)); // v = v0 + a * t
    return newVelocity;
  }

  // Calculate new displacement based on the previous displacement, velocity and acceleration (y = y0 + v * t + (1/2) * a * t^2)
  calculateNewDisplacement(newVelocity, newAcceleration, delta) {
    const newDisplacement = new THREE.Vector3();
    newDisplacement
      .add(newVelocity.clone().multiplyScalar(delta))
      .add(
        newAcceleration.clone().multiplyScalar(0.5 * delta * delta)
      ); // y = y0 + v * t + (1/2) * a * t^2
    return newDisplacement;
  }

  // Calculate displacement based on various input parameters
  calculateDisplacement(
    delta,
    bodyMass,
    umbrellaMass,
    previousVelocity,
    previousDisplacement,
    surfaceArea,
    windSpeed,
    tensileForce,
    wind_angle
  ) {
    
const totalMass = bodyMass + umbrellaMass;

const weightForce = this.calculateWeightForce(totalMass);

const dragForce = this.calculateDragForce(previousVelocity, surfaceArea);

const windForce = this.calcWindVelo(windSpeed, wind_angle);

const totalForces = this.calculateTotalForces(
weightForce,
dragForce,
windForce,
tensileForce
);

const newAcceleration = this.calculateAcceleration(totalForces, totalMass);

const newVelocity = this.calculateNewVelocity(previousVelocity, newAcceleration, delta);

const newDisplacement = this.calculateNewDisplacement(newVelocity, newAcceleration, delta);

return {newVelocity,newDisplacement,newAcceleration,dragForce,weightForce};
}

// Update position based on displacement
updatePosition(position, displacement) {
const newPosition = new THREE.Vector3();
newPosition.copy(position).add(displacement); // Add the displacement to the current position
newPosition.setY(Math.max(newPosition.y, 0)); // Ensure the object does not go below the ground
return newPosition;
}
}

export default Parachutist;



