import vector from "./vector";

class parachutist
{
    

  constructor
  ( 
      mass ,
      area ,
      height , 
      drag ,
      gravity,
      airspeed ,
      airdesity, 
      windspeed,
      k
  )
    {
        this.k=k;///ثابت يعتمد على خصائص الحبل
        this.airspeed =airspeed ;  /////سرعه الهواء
        this.windspeed=windspeed;///سرعة الرياح
        this.mass = mass ; 
        this.area = area;    //////مساحه المظله  
        this.height = height; 
        this.drag = drag;          ///////معامل المقاومة الهوائيه
        this.gravity = 9.8; 
        this. airdesity = airdesity;   /////////////////كثافة الهواء  
        this.forceGravity = new vector(0,0,0);
        this.forceDrag = new vector(0,0,0);
        this.forceWind = new vector(0,0,0);
        this.forcePressure =new vector(0,0,0);
        this.forceTension =new vector(0,0,0);
        this.totalForce =new vector(0,0,0);
        this. velocity = new vector(0,0,0);
        this.acceleration = new vector(0,0,0);
        this.position = new vector(0,-height,0);
        this.p = new vector(0,0,0);
        this.radius = 6378100.0 //meters 
        this.G = 6.67 * 10 ^ -11 //Universal Gravitation constant in n*m^2/kg^2
        this.mass_earth = 5.98 * 10 ^ 24 
        this.R=this.radius+this.height
        this.time = 0;
        this.i=0;
        this.L=1;
        this.alpha=0;
        this.beta=90;
        


    }
    degToRad(degrees) {
        return degrees * Math.PI / 180;
      }
        //حساب قوة السحب
        calculateForceDrag(){
        this. forceDrag=new vector(
            -0.5 * this.airdesity * Math.pow(this.velocity.length(), 2)* this.drag * this.area * 
           this.L * Math.cos(this.degToRad(this.alpha)),
           -0.5 * this.airdesity *Math.pow(this.velocity.length(), 2) * this.drag * this.area * 
           this.L *Math.cos(this.degToRad(this.beta)),
           -0.5 * this.airdesity *Math.pow(this.velocity.length(), 2)* this.drag * this.area * 
           this.L * Math.sin(this.degToRad(this.alpha)) * Math.sin(this.degToRad(this.beta))
            );
        
        // this. forceDrag=new vector (0,-0.5 * this.airdesity *this.drag * this.area * Math.pow(this.velocity.length(), 2),0); 
       
        // return this. forceDrag;
        }
        ///حساب قوة الجاذبية
        calculateForceGravity()
        {this.p=this.position.DivideScalar(this.position.length());
            
        this.forceGravity = new vector (0,this.G*this.mass*this.mass_earth /Math.pow(this.R, 2),0);
            return this.forceGravity;
        }
        ///حساب قوة الرياح 
        calculateForceWind()
        {
            this.forceWind = new vector(0.5 * this.airdesity* this.area *this.drag * Math.pow(this.windspeed , 2),0,0);
            return this.forceWind ;
        }
        ///حساب قوة الضغط الجوي 
        calculateForceAirPressure()
        {
            this.forcePressure=  new vector(0,0,0.5 * this.airdesity * Math.pow(this.airspeed , 2));
            return this.forceWind ;
        }
        ////حساب قوة شد الحبال
        calculateForceRopeTension()
        {
           let t=new vector(0,0,0)
            //this.forceTension=  new vector(0,-this.mass*this.gravity ,0);
           this.forceTension=  new vector(0,-this.velocity.length()*this.k ,0);
            return this.forceTension ;
        }
        
        ///محصلة القوى
       calculateTotalForce()
        {
        this. totalForce.copy(this.forceGravity)
        .add(this.forceDrag).add(this.forceWind)
        .add(this.forcePressure).add(this.forceTension);
        return this.totalForce
        }
        ///التسارع
        calculateacceleration()
        {
          
        this.acceleration.copy(this.totalForce).multiplyScalar(1 / this.mass);
        return this.acceleration
        }
        ////السرعة
        calculateVelocity(deltaTime)
        {
            let v=new vector(0,0,0)
            this.velocity=this.velocity.add(v.copy(this.acceleration).multiplyScalar(0.1));
        return this.velocity
        }
        ///الموضع
        calculatePosition(deltaTime)
        { let po=new vector(0,0,0)
            this.position=this.position.add(po.copy(this.velocity).multiplyScalar(0.1) );
            this.height=this.position.y;
        
        return this.position
        }
        ////الزمن
        calculateTime()
        {
        this.time= this.time + 0.1 ;
        return this.time
        }
      
        print()
        {   console.log(' forceGravity = ' ,this.forceGravity);
            console.log(' forceDrag = ' ,this.forceDrag);
            console.log('forcePressure  = ' ,this.forcePressure);
            console.log('forceTension  = ' ,this.forceTension);
            console.log(' forceWind = ' ,this.forceWind);
            console.log(' totalForce = ' ,this.totalForce);
            console.log(' time = ' , this.time);
            console.log(' accleration ' , this.acceleration);
            console.log(' velocity ' , this.velocity);
            console.log('  position ', this.position);
            console.log('  height ', this.height);
            console.log('  i', this.i);
            console.log('  alpha',this.degToRad(this.alpha) );
            console.log('  beta',this.degToRad(this.beta) );
        }
         updatePhysics(deltaTime) {
           
            this.calculateVelocity(deltaTime);
            this.calculatePosition(deltaTime);
            this.calculateForceDrag();
            this.calculateForceGravity();
            this.calculateForceAirPressure();
            this.calculateForceRopeTension();
            this.calculateForceWind();
             this.calculateTotalForce();
             this.calculateacceleration();
             this.calculateVelocity();
             this.calculatePosition();
             this.calculateTime();
            this.print();
            this.i=this.i+1;
          
            // تكرار العملية كل 0.1 ثانية
            // setTimeout( 
            //   this.updatePhysics(0.1)
            // , 100);
          }
          
 }
 

export default parachutist;