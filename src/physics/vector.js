import * as THREE from 'three';
class vector {

    constructor(x,y,z)
    {
       this.x = x || 0 ;
       this. y = y || 0 ;
       this. z = z || 0;
   
   ///////// لارجاع مركبات شعاع
   }
   //////////////////////////
    setX(X)
    {
        this.x=x ;
        return this;
    }
 ////////////////////////////////  
    setY(y)
    {
        this.y=y;
        return this;
    }

/////////////////////////////////////////
    setZ(z)
    {
        this.z=z;
        return this;
    }

    getX(X)
    {
        this.x ;
        return this;
    }
 ////////////////////////////////  
    getY(y)
    {
        this.y ;
        return this;
    }

/////////////////////////////////////////
    getZ(z)
    {
        this.z ;
        return this;
    }
//////////////////////////////////
   set(x,y,z)
   {
       this.x = x ;
       this.y = y ;
       this.z = z ;
       return this ;
   }
   //////لنسخ مركبات شعاع
   copy (v)
   {
       this.x=v.x;
       this.y=v.y;
       this.z=v.z;
       return this ;
   
   }
   //////
   clone ()
   {return new vector ( this.x ,this.y ,this.z )}
   
    add(v)
    {
       this.x+=v.x;
       this.y+=v.y;
       this.z+=v.z;
       return this;
    }
    sub(v)
    {
       this.x-=v.x;
       this.y-=v.y;
       this.z-=v.z;
       return this;
    }
    /////
    multiplyScalar(s)
    {
       this.x*=s;
       this.y*=s;
       this.z*=s;
       return this;
    }
    DivideScalar(s)
    {
       this.x/=s;
       this.y/=s;
       this.z/=s;
       return this;
    }
    ///////
    length()
    {
       return Math.sqrt(this.x * this.x + this.y * this.y , this.z * this.z)
    }
    ///////
    normalize()
    { return this.multiplyScalar( 1/this.length() )}
   
    ///////
    dot(v)
    {
       return this.x * v.x + this.y * v.x + this.z * v.z ;
    }
     
    cross (v)
    {
       const x = this.y * v.z - this.z * v.y;
       const y = this.z * v.x - this.x * v.z;
       const z = this.x * v.y - this.y * v.x;
       return new vector( x, y, z );
    }
    distanceTo(v)
    {
       const dx = this.x - v.x ;
       const dy = this.y - v.y ;
       const dz = this.z - v.z ;
       return Math.sqrt(dx * dx + dy * dy + dz * dz);
   
    }
    
   }
   /*
   const v1 = new vector(1,3,5);
   const v2 = new vector(3,2,4);
   
   ////////print(v1);
   const mass = 80;
   const area = 1.5 ;
   const height = 3000 ;
   const drag = 1.2 ;
   const gravity = 9.8 ;
   const airdensity = 1.225 ;
    
   const va = new THREE.vector(0,0,0);
   const ve = new THREE.vector(0,0,0);
   const velocity = new THREE.velocity(va,ve);
     
     
   //////القوى  
   const forceGravity = new vector(0,0,0);
   const forceDrag = new vector(0,0,0);
   //const velocity = new vector(0,0,0);
   const acceleration = new vector(0,0,0);
   const position = new vector(0,0,height);
   
   
   //////
   while(position.z > 0) {
     const  forceGravity = new vector(0 ,0 , -mass* gravity) ;
     const forceDrag  = new vector (0 ,0 , -0.5* airdensity * velocity.z * velocity.z * drag * area) ; 
     const acceleration = forceGravity .add(forceDrag). multiplyScalar(1/mass);
     const velocity = velocity . add(acceleration. multiplyScalar(0.1));
     const position = position . add (velocity.multiplyScalar(0.1));
     const time = time + 0.1 ;
   
   }
   print (forceDrag);
   print (forceGravity);
   print (acceleration);
   print (velocity);
   print (position);
   export { vector};   
   */
export default vector;