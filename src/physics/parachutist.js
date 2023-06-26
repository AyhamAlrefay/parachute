import Vector from "./vector";

class Parachutist {
  constructor(
    mass,
    r,
    height,
    airResistance,
    windspeed,
    airspeed
  ) {
    this.pi = Math.PI;
    this.r = r;
    this.area = this.pi * this.r * this.r;
    this.height = height;
    this.airdensity = 1.2;
    this.radius = 6378100.0; // meters
    this.G = 6.67 * Math.pow(10, -11); // Universal Gravitation constant in n*m^2/kg^2
    this.mass_earth = 5.98 * Math.pow(10, 24);
    this.R = this.radius + this.height;
    this.time = 0;
    this.i = 0;
    this.L = 1;
    this.alpha = 0;
    this.beta = 90;
    this.k = 1;
    this.windspeed = windspeed;
    this.forceWind = new Vector(0, 0, 0);
    this.forcePressure = new Vector(0, 0, 0);
    this.forceTension = new Vector(0, 0, 0);
    this.totalForce = new Vector(0, 0, 0);
    this.gravity = new Vector(0, -9.8, 0);
    this.position = new Vector(0, 0, 0);
    this.velocity = new Vector(0, 0, 0);
    this.acceleration = new Vector(0, 0, 0);
    this.mass = mass;
    this.airResistance = airResistance;
    this.airspeed = airspeed;
  }

  calculateGravityForce() {
    return this.gravity.clone().multiplyScalar(this.mass);
  }

  calculateAirResistanceForce() {
    const speed = this.velocity.length();
    const direction = this.velocity.clone().normalize();
    const dragForceMagnitude =
      0.5 * this.airResistance * this.airdensity * this.area * speed * speed;
    return direction.multiplyScalar(dragForceMagnitude);
  }

  calculateForceWind() {
    this.forceWind.set(
      0,
      0,
      0.5 * this.airdensity * this.area * this.airResistance * Math.pow(this.windspeed, 2)
    );
  }

  calculateForceAirPressure() {
    const pressureMagnitude = 0.5 * this.airdensity * Math.pow(this.airspeed, 2);
    this.forcePressure.set(0, 0, pressureMagnitude);
  }

  calculateForceRopeTension() {
    const direction = this.velocity.clone().normalize();
    this.forceTension.copy(direction).multiplyScalar(this.k * this.velocity.length());
  }

  calculateAcceleration() {
    const gravityForce = this.calculateGravityForce();
    const airResistanceForce = this.calculateAirResistanceForce();
    const netForce = gravityForce.sub(airResistanceForce);
    return netForce.clone().divideScalar(this.mass);
  }

  calculateVelocity(deltaTime) {
    return this.velocity.clone().add(this.acceleration.multiplyScalar(deltaTime));
  }

  calculatePosition(deltaTime) {
    return this.position
      .clone()
      .add(
        this.velocity
          .clone()
          .multiplyScalar(deltaTime)
          .add(this.acceleration.multiplyScalar(0.5).multiplyScalar(deltaTime).multiplyScalar(deltaTime))
      );
  }

  updateParachutist(deltaTime) {
    if (this.height < 0) return;
    this.height = this.position.y;
    this.calculateForceWind();
    this.calculateForceAirPressure();
    this.calculateForceRopeTension();
    this.totalForce.copy(this.forceWind).add(this.forcePressure).add(this.forceTension);
    this.acceleration = this.calculateAcceleration();
    this.velocity = this.calculateVelocity(deltaTime);
    this.position = this.calculatePosition(deltaTime);

    const valuesContainer = document.getElementById("values-container");
    valuesContainer.innerHTML = `
      <p>Position: ${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)}, ${this.position.z.toFixed(2)}</p>
      <p>Acceleration: ${this.acceleration.x.toFixed(2)}, ${this.acceleration.y.toFixed(2)}, ${this.acceleration.z.toFixed(2)}</p>
      <p>Velocity: ${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)}, ${this.velocity.z.toFixed(2)}</p>
      <p>Height: ${this.height.toFixed(2)}</p>
    `;
  }
}

export default Parachutist;


// import Vector from "./vector";
// class parachutist
// {
    

//   constructor
//   ( 
//       mass ,
//       r ,
//       height , 
//       airResistance ,
//       windspeed,
//       airspeed,
    
//   )
//     {
       
//         this.pi=3.14;
//         this.r=r;
//         this.area = this.pi *this.r*this.r;   //مساحه المظله  
//         this.height = height; 
//         this.airdesity = 1.2;   //كثافة الهواء  
//         this.radius = 6378100.0 //meters 
//         this.G = 6.67 * 10 ^ -11 //Universal Gravitation constant in n*m^2/kg^2
//         this.mass_earth = 5.98 * 10 ^ 24 
//         this.R=this.radius+this.height
//         this.time = 0;
//         this.i=0;
//         this.L=1;
//         this.alpha=0;
//         this.beta=90;
//         this.k=1;
//         this.windspeed=windspeed;
//         this.forceWind =new Vector(0,0,0);
//         this.forcePressure =new Vector(0,0,0);
//         this.forceTension =new Vector(0,0,0);
//         this.totalForce =new Vector(0,0,0);
//         this.gravity = new Vector(0, -9.8, 0); // قوة الجاذبية
//         this.position = new Vector(0,0, 0); // الموضع الأولي للمظلي
//         this.velocity = new Vector(0, -1, 0); 
//         this.acceleration = new Vector(0, 0, 0);// السرعة الأولية للمظلي
//         this.mass = mass;
//         this.airResistance = airResistance; 
//         this.airspeed=airspeed;
        
//     }
//    // كتلة المظلي

// // حساب قوة الجاذبية
// calculateGravityForce() {
//     return this.gravity.clone().multiplyScalar(this.mass);
// }
// calculateAirResistanceForce() {
//     var speed = this.velocity.length();
//     var direction = this.velocity.clone().normalize();
//     var dragForceMagnitude = 0.5*this.airResistance*this.airdesity * this.area*speed * speed;
//     return direction.multiplyScalar(dragForceMagnitude);
//   }
//   calculateForceWind()
//         {
//             this.forceWind = new Vector(0,0,0.5 * this.airdesity* this.area *this.airResistance * Math.pow(this.windspeed , 2));
//             return this.forceWind ;
//         }
//         ///حساب قوة الضغط الجوي 
//         calculateForceAirPressure()
//         {
//             this.forcePressure=  0.5 * this.airdesity * Math.pow(this.airspeed , 2);
//             return this.forcePressure ;
//         }
//         //حساب قوة شد الحبال
//         calculateForceRopeTension()
//         {
//             this.forceTension=  new Vector(0,0,this.k*this.velocity.length());
//             return this.forceTension ;
//         }
        
// // حساب التسارع باستخدام قوة الجاذبية وكتلة المظلي
// calculateAcceleration() {
//     var gravityForce = this.calculateGravityForce();
//     var airResistanceForce = this.calculateAirResistanceForce();
//     var netForce = gravityForce.sub(airResistanceForce);
//     return netForce.clone().divideScalar(this.mass);
// }

// // حساب السرعة باستخدام التسارع
//  calculateVelocity(deltaTime) {
//   return this.velocity.clone().add(this.acceleration.multiplyScalar(deltaTime));
// }

// // حساب الموضع باستخدام السرعةx = x₀ + v₀t + (1/2)at²
//  calculatePosition(deltaTime) {
//   return this.position.clone().add(this.velocity.multiplyScalar(deltaTime).add(this.acceleration.multiplyScalar(0.5).multiplyScalar(deltaTime).multiplyScalar(deltaTime)));
// }

// // دورة التحديث لحركة المظلي
//  updateParachutist(deltaTime) {
//   if(this.height<0)
//   return;
//   // حساب التسارع()
//   this.height = this.position.y;
//    this.acceleration = this.calculateAcceleration();

//   // حساب السرعة الجديدة
//   this.velocity = this.calculateVelocity( deltaTime);

//   // حساب الموضع الجديد
//   this.position = this.calculatePosition(deltaTime);

//   // عرض نتائج الحركة
 
//   const valuesContainer = document.getElementById("values-container");
//   valuesContainer.innerHTML = `
//       <p>Position: ${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)}, ${this.position.z.toFixed(2)}</p>
//       <p>Acceleration: ${this.acceleration.x.toFixed(2)}, ${this.acceleration.y.toFixed(2)}, ${this.acceleration.z.toFixed(2)}</p>
//       <p>Velocity: ${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)}, ${this.velocity.z.toFixed(2)}</p>

//       <p>Height: ${this.height.toFixed(2)}</p>
//   `;
  
// } 
   
         
//          }
 

// export default parachutist;