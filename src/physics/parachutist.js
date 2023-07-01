import { Vector3 } from 'three';

class parachutist
{

  constructor
  ( 
      mass ,
      r ,
      height , 
      drag_coeff ,
      windspeed,
      airspeed,
    
  )
    {
       
        this.pi=3.14;
        this.r=r;
        this.area = this.pi *this.r*this.r;   //مساحه المظله  
        this.height = height; 
        this.rho = 1.2;   //كثافة الهواء  
        this.time = 0;
        this.k=1;
        this.windspeed=windspeed;
        this.forceWind =new Vector3(0,0,0);
        this.forcePressure = new Vector3(0,0,0);
        this.forceTension = new Vector3(0,0,0);
        this.totalForce =new  Vector3(0,0,0);
        this.gravity = new Vector3(0, -9.8, 0); // قوة الجاذبية
        this.position = new Vector3(0,this.height, 0); // الموضع الأولي للمظلي
        this.velocity =new Vector3(0, 0, 0); 
        this.acceleration =new Vector3(0, 0, 0);
        this.mass = mass;
        this.drag_coeff = drag_coeff; 
        this.airspeed=airspeed;
        
    }
// دورة التحديث لحركة المظلي
 updateParachutist(deltaTime) {
  if(this.height<0)
  return;
  const gravityForce=this.gravity.clone().multiplyScalar(this.mass);
  const velocitySquared = this.velocity.clone().lengthSq();
          const airResistanceForce = new Vector3(
            ((velocitySquared * -1) / 2) *
              this.drag_coeff *
              this.rho *
              this.area *
              this.velocity.clone().normalize().x,
            ((velocitySquared * -1) / 2) *
              this.drag_coeff *
              this.rho *
              this.area *
              this.velocity.clone().normalize().y,
            ((velocitySquared * -1) / 2) *
              this.drag_coeff *
              this.rho *
              this.area *
              this.velocity.clone().normalize().z
          );
  
  // حساب التسارع()
  this.height = this.position.y;
  this.acceleration.x = (gravityForce.x+airResistanceForce.x)/this.mass;
  this.acceleration.y = (gravityForce.y+airResistanceForce.y)/this.mass;
  this.acceleration.z = (gravityForce.z+airResistanceForce.z)/this.mass;
   
  // حساب السرعة الجديدة
 this.velocity= this.velocity.clone().add(this.acceleration.multiplyScalar(deltaTime));
 

  // حساب الموضع الجديد
  this.position = this.position.clone().add(this.velocity.multiplyScalar(deltaTime).add(this.acceleration.multiplyScalar(0.5).multiplyScalar(deltaTime).multiplyScalar(deltaTime)));


  // عرض نتائج الحركة
 
  const valuesContainer = document.getElementById("values-container");
  valuesContainer.innerHTML = `
      <p>Position: ${this.position.x.toFixed(2)}, ${this.position.y.toFixed(2)}, ${this.position.z.toFixed(2)}</p>
      <p>Height: ${this.height.toFixed(2)}</p>
      <p>Acceleration: ${this.acceleration.x.toFixed(2)}, ${this.acceleration.y.toFixed(2)}, ${this.acceleration.z.toFixed(2)}</p>
      <p>Velocity: ${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)}, ${this.velocity.z.toFixed(2)}</p>
      <p>GravityForce: ${gravityForce.x.toFixed(2)}, ${gravityForce.y.toFixed(2)}, ${gravityForce.z.toFixed(2)}</p>
      <p>AirResistanceForce: ${airResistanceForce.x.toFixed(2)}, ${airResistanceForce.y.toFixed(2)}, ${airResistanceForce.z.toFixed(2)}</p>
  `;
  
} 
   
         
         }
 

export default parachutist;