import Vector from "./vector";

class Parachutist {
  constructor(mass, r, height, airResistance, windspeed, airspeed) {
    this.mass = mass;
    this.r = r;
    this.height = height;
    this.airResistance = airResistance;
    this.windspeed = windspeed;
    this.airspeed = airspeed;
   this.dragForce= new Vector(0, 0, 0),
    this.area = Math.PI * this.r * this.r;
    this.airDensity = 1.2;
    this.gravity = new Vector(0, -9.8, 0);
    this.position = new Vector(0, this.height, 0);
    this.velocity = new Vector(0, 0, 0);
    this.acceleration = new Vector(0, 0, 0);
  }

  calculateForces() {
    const gravityForce = this.gravity.clone().multiplyScalar(this.mass);
   
    if (this.velocity.length() !== 0) {
    this.dragForce = this.velocity.clone().normalize().multiplyScalar(-0.5 * this.airResistance * this.airDensity * this.area * this.velocity.length() ** 2);
    }
    const windForce = new Vector(0, 0, 0.5 * this.airDensity * this.area * this.airResistance * this.windspeed ** 2);
    const airPressureForce = new Vector(0, 0, 0.5 * this.airDensity * this.airspeed ** 2);
    return gravityForce.add(this.dragForce).add(windForce).add(airPressureForce);
  }
  

  updateParachutist(deltaTime) {
    if (this.position.y < 0) return;
  
    // Update air density based on height
    this.airDensity = 1.2 * Math.exp(-this.position.y / 10000); // Decreases with altitude, assuming a scale height of 10000 meters
  
    // Update wind speed based on height
    // if (this.position.y > 500) {
    //   this.windspeed = 10;
    // } else {
    //   this.windspeed = 5;
    // }
  
    const netForce = this.calculateForces();
    this.acceleration = netForce.divideScalar(this.mass);
    this.velocity = this.velocity.add(this.acceleration.multiplyScalar(deltaTime));
    this.position = this.position.add(this.velocity.multiplyScalar(deltaTime));
  
    const valuesContainer = document.getElementById("values-container");
  
    // Check if the values are valid numbers before updating the HTML
    if (isNaN(this.position.x) || isNaN(this.position.y) || isNaN(this.position.z) ||
        isNaN(this.acceleration.x) || isNaN(this.acceleration.y) || isNaN(this.acceleration.z) ||
        isNaN(this.velocity.x) || isNaN(this.velocity.y) || isNaN(this.velocity.z)) {
      valuesContainer.innerHTML = "<p>Error: Invalid calculation result</p>";
    } else {
      valuesContainer.innerHTML = `
        <p>Position: ${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)}, ${this.position.z.toFixed(2)}</p>
        <p>Acceleration: ${this.acceleration.x.toFixed(2)}, ${this.acceleration.y.toFixed(2)}, ${this.acceleration.z.toFixed(2)}</p>
        <p>Velocity: ${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)}, ${this.velocity.z.toFixed(2)}</p>
        <p>Height: ${this.position.y.toFixed(2)}</p>
        <p>Drag Force: ${this.dragForce.x.toFixed(2)}, ${this.dragForce.y.toFixed(2)} ,${this.dragForce.z.toFixed(2)}}</p>
        <p>Air Density: ${this.airDensity.toFixed(2)}</p>
      `;
    }
  }
  
  
}

export default Parachutist;
