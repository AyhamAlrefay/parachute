import Vector from "./vector";

class Parachutist {
  constructor(
    mass,
    area,
    height,
    drag,
    gravity,
    airspeed,
    airDensity,
    windSpeed,
    k
  ) {
    this.gravity=gravity
    this.k = k; // Rope tension constant
    this.airspeed = airspeed;
    this.windSpeed = windSpeed;
    this.mass = mass;
    this.area = area;
    this.height = height;
    this.drag = drag;
    this.gravity = 9.8;
    this.airDensity = airDensity;
    this.forceGravity = new Vector(0, 0, 0);
    this.forceDrag = new Vector(0, 0, 0);
    this.forceWind = new Vector(0, 0, 0);
    this.forcePressure = new Vector(0, 0, 0);
    this.forceTension = new Vector(0, 0, 0);
    this.totalForce = new Vector(0, 0, 0);
    this.velocity = new Vector(0, 0, 0);
    this.acceleration = new Vector(0, 0, 0);
    this.position = new Vector(0, -height, 0);
    this.radius = 6378100.0; // Earth's radius in meters
    this.G = 6.674 * Math.pow(10, -11); // Universal Gravitation constant in N*m^2/kg^2
    this.mass_earth = 5.972 * Math.pow(10, 24); // Earth's mass in kg
    this.R = this.radius + this.height;
    this.time = 0;
    this.alpha = 0;
    this.beta = 90;
  }

  degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  // Calculate drag force
  calculateForceDrag() {
    this.forceDrag = new Vector(
      -0.5 *
        this.airDensity *
        Math.pow(this.velocity.length(), 2) *
        this.drag *
        this.area *
        Math.cos(this.degToRad(this.alpha)),
      -0.5 *
        this.airDensity *
        Math.pow(this.velocity.length(), 2) *
        this.drag *
        this.area *
        Math.cos(this.degToRad(this.beta)),
      -0.5 *
        this.airDensity *
        Math.pow(this.velocity.length(), 2) *
        this.drag *
        this.area *
        Math.sin(this.degToRad(this.alpha)) *
        Math.sin(this.degToRad(this.beta))
    );
  }

  // Calculate gravitational force
  calculateForceGravity() {
    this.forceGravity = new Vector(
      0,
      (-this.G * this.mass * this.mass_earth) / Math.pow(this.R, 2),
      0
    );
  }

  // Calculate wind force
  calculateForceWind() {
    this.forceWind = new Vector(
      0.5 * this.airDensity * this.area * this.drag * Math.pow(this.windSpeed, 2),
      0,
      0
    );
  }

  // Calculate air pressure force
  calculateForceAirPressure() {
    this.forcePressure = new Vector(
      0,
      0,
      0.5 * this.airDensity * Math.pow(this.airspeed, 2)
    );
  }

  // Calculate rope tension force
  calculateForceRopeTension() {
    this.forceTension = new Vector(0, -this.velocity.length() * this.k, 0);
  }

  // Calculate total force
  calculateTotalForce() {
    this.totalForce
      .copy(this.forceGravity)
      .add(this.forceDrag)
      .add(this.forceWind)
      .add(this.forcePressure)
      .add(this.forceTension);
  }

  // Calculate acceleration
  calculateAcceleration() {
    this.acceleration.copy(this.totalForce).multiplyScalar(1 / this.mass);
  }

  // Calculate velocity
  calculateVelocity(deltaTime) {
    this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
  }

  // Calculate position
  calculatePosition(deltaTime) {
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
    this.height = this.position.y;
  }

  // Update physics
  updatePhysics(deltaTime) {
    this.calculateForceDrag();
    this.calculateForceGravity();
    this.calculateForceWind();
    this.calculateForceAirPressure();
    this.calculateForceRopeTension();
    this.calculateTotalForce();
    this.calculateAcceleration();
    this.calculateVelocity(deltaTime);
    this.calculatePosition(deltaTime);
    this.time += deltaTime;
  }
}

export default Parachutist;
