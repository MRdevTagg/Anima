class World {
  constructor() {
    this.gObjs = []
  }
}

class Button {
  constructor({name,affected}) {
    this.name = name;
    this.$ = $(`.${this.name}`)
    this.pressed = false;
    this.affected = affected
  }
  press(){
    switch (this.name) {
      case 'right':
        affected.transform.move()
        break;
      
    }
  }
}


class Controller{
  constructor(){
    this.move = false;
    this.right = false;
    this.left = false;
    this.jump = false;
    this.crunch = false;
    this.grab = false;
    this.climb = false;
    this.shoot = false;
    this.action = false;
    this.pause = false;
  }
}

class Collider {
  constructor({transform}) {
    this.transform = transform || new Transform({})
    }
  update(){
    
  }
}
class Transform {
  constructor({w,h,x,y,z,scale,opacity}) {
    this.w = w || 70 /1.5
    this.h = h || 102 /1.5
    this.x = x || 100
    this.y = y || 20
    this.z = z || 0
    this.scale = scale || 1
    this.opacity = opacity || 1
    
    this.velocity = 1
    this.facingRight = true;
   
  }
  update(element){
    element.width = this.w;
    element.height = this.h;
    element.style.left = this.x +'px';
    element.style.top = this.y +'px';
    element.style.transform = `scaleX(${this.scale})`;
    element.style.opacity = this.opacity;
    
  }
  move(){
    this.x += this.velocity*this.scale
  }
}


class Frame{
  constructor( current, min, max, step, rate, lap){
      this.current = current || 1
      this.min = min || 1
      this.max = max || 14
      this.step = step || 1
      this.rate = rate || 24
      this.lap = lap || 0
      this.reachEnd = ()=> this.current === this.max
      this.reachStart = ()=> this.current === this.min
      this.reachPoint = point => this.current === point

  }

}
class Animation {
  constructor({ anima,name, path, format, type, start, frames, cycle }){
    this.anima = anima
    this.name = name || 'idle'
    this.path = path || 'img'
    this.format = format || 'png'
    this.start = start || 1
    this.cycle = cycle || 'loop-forward'
    
    this.frames = 1
    this.images = []
      
    this.lengthSet = false
    this.img = new Image()
    this.url;
    this.anim_length = () =>{
     this.url = `/${this.path}/${this.name}${this.frames}.${this.format}`
     if(this.lengthSet !== true) {
      this.img.src = this.url
      this.img.onload = ()=>{
      this.images.push(this.url)
      this.frames +=1;
      }
      this.img.onerror = ()=>{
      this.lengthSet = true
      loaded = true
      this.img = null
      this.url = null
      }
     }
    }
  }
  
}

class Anima {
  constructor({frame,animation,transform,collider,element,name,controls,cycle,state, mode}) {
    this.name = name || 'sprite'
    this.element = ID(this.name) 
    this.frame = frame || new Frame({});
    this.animation = animation || new Animation({anima : this});
    this.transform = transform || new Transform({});
    this.controls = controls || new Controller({});
    this.world = world;
    this.collider = collider || new Collider({transform : this.transform});
    this.cycle = cycle || 'loop-forward';
    this.state = state || 'play';
    
    this.mode = mode || 'source';
    this.counter = 0;
    this.direction = 1;//frame
    this.state_changed = true;
    
    this.next_anim = idle;
    this.prev_anim = idle;
    
    this.anim_waiting =()=> this.animation.name !== this.next_anim.name;
    
    this.transition = (current,next)=>
      this.animation.name === current && this.next_anim.name === next;
      
    this.canDraw = () => this.frame.current <= this.animation.frames && this.frame.current >= this.animation.start;
  }

 awake(){
   
 }
 play(){
   if(this.state === 'stop'){
     this.state = 'play'
     this.state_changed = true;
   }
 }
 stop(){
if(this.state === 'play'){
  this.state = 'stop' 
  this.state_changed = true;
  }
 }
 loop(prop) {
   this.cycle = prop;
   this.state_changed = true;
   this.frame.lap =0
 }
 
 setAnimation(anim){
   this.next_anim = anim
 }
 
 
 frameStep(){
   if (this.direction === -1 && this.frame.current > this.frame.min || this.direction === 1 &&  this.frame.current < this.frame.max) {
        this.frame.current += this.frame.step * this.direction
   }
   else {this.frame.current += 0}
   
 }
 playModes(){

if(this.animation.lengthSet){
    switch (this.cycle){
      case "forward" :
        if(this.frame.reachEnd()){
        this.frame.current = this.frame.max
         this.stop()
         this.frame.lap += 1
         
        }
        else{
        this.direction = 1}
        break;
        
      case "reverse" :
        if(this.frame.reachStart()){
        this.frame.current = this.frame.min;
        this.stop();
        this.frame.lap +=1;
        }
        else{
        this.direction = -1;
        }
        break;
        
      case 'loop-forward':
       
       if( this.frame.current < this.frame.max ){
         this.direction = 1;
       }
       else{ 
         this.frame.lap += 1;
         this.frame.current = this.frame.min -1;
         
       }
        break;
      case 'loop-reverse':
        this.frame.current > this.frame.min ?
        this.direction = -1 :
        this.frame.current = this.frame.max
      break;
      case 'loop-pingpong':
        if (this.frame.reachEnd()){
          this.direction = -1}
        else if(this.frame.reachStart()){
          this.direction = 1}
        break;
      default : this.direction = 1
    }

}
  
  }
     

draw(){
 this.transform.update(this.element)

  switch (this.mode) {
    case 'source':
      this.element.src = this.animation.images[this.frame.current-1]
      break;
  
    case 'spriteSheet':
      
      break;
  }  
}

animatorRunning(){
  switch (this.animation.name) {
    case 'flip':
      if (this.frame.reachPoint(4)) {
        this.transform.scale = -this.transform.scale
      }
      this.controls.right === true || this.controls.left === true ?
        this.setAnimation(walk) :
        this.setAnimation(idle)
      break;
    case 'walk':
      if (this.frame.reachPoint(3)) {
         this.controls.move = true
      }
      if (this.frame.current > 5) {
         this.frame.min = 5
      }
      break;
    case 'idle':
      this.controls.move = false
      break;
    
    
  }
}
animaOnChange(){
  switch (true) {
    case this.transition('walk','idle'):
      if(this.frame.current < 7){
      this.loop('loop-reverse')
      this.frame.min = 1
      this.frame.lap = 0
      if(this.frame.reachPoint(4)){
        this.controls.move = false
      }
      if (this.frame.reachStart()) {
        this.controls.move = false
        this.switchAnimation(this.next_anim)}
      }
      else{this.frame.reachStart() && this.switchAnimation(this.next_anim)}
      
      break;
    case this.transition('idle','walk'):
        this.switchAnimation(this.next_anim)
      break;
     case this.transition('idle','flip'):
        this.switchAnimation(this.next_anim)
      break;
      case this.transition('walk','flip'):
        this.switchAnimation(this.next_anim)
      break;
    default : 
     this.frame.reachEnd() && this.switchAnimation(this.next_anim)
     
     break;
  }
}

movement(){
  if (this.controls.move === true) {
    this.transform.move()
  }
}

animate(){


  //this is the Animation component method that will set the length of frames 
  if(this.animation.lengthSet === false && this.mode === 'source'){
    this.animation.anim_length()
  this.frame.max = this.animation.frames -1
  }
  if(this.state === 'play'){
          this.counter+=1;

 this.movement()
  this.animatorRunning()
 this.anim_waiting() && this.animaOnChange()
 this.playModes()


  if(this.counter >= 60/this.frame.rate){ 
    this.counter = 0;
    this.frameStep()

    }

       this.canDraw() && this.draw()
    }
 }

 switchAnimation(){
      this.frame.max = this.next_anim.images.length
      this.frame.min = this.next_anim.start
      this.frame.lap = 0
      this.loop(this.next_anim.cycle)
      this.prev_anim = this.animation
      this.frame.current = 1
      
      this.animation = this.next_anim

 }
 
 
} 
/* 

//// CREATE ANIMA ////

-- STEP 1 --
-- SETTING IMAGES TO WORK PROPERLY --
    First than anything you need to have your "images set" properly named in your folder. 

    EXAMLPLE : let's say you have a walk animation set of 14 frames, each one in separated files in .png format, you should name them like this: 
    (walk1.png,walk2.png,...,walk14.png). 
    this number at the end will represent each frame.
    Done with this you have to put them in a folder inside your root directory, for this example we'll name the folder 'img' ( wich is the default value).
    
 -- STEP 2 -- 
 -- CREATE & SET ANIMATION --

    Now we are ready to create our first Animation...
    Create an animation set is easy.
    Lets create two of them so we can switch from one to another:
  const walk = new Animation({
  name: 'walk', //string must be equal to img name without the number that we put at the end earlier//
  path: 'img', // in case you have a more complex path just pass a string with usual slashes. for example : 'img/character/walk' //
  format: 'png', //string for extension (without the dot) //
});
 const idle = new Animation({
  name: 'idle', // string 
  path: 'img', // string
  format: 'png', // string
});

With this done lets proced with the Anima object.

-- STEP 3
First we need to create the animated element and get it linked with a DOM node or canvas element(we'll see it later)
---- HTML (document node): ----
Begin by adding the node in your html file (or create it via JavaScript), for example an img tag and then assign an id : 

<img id="myID">

-- STEP 4 -- 
Now you are ready to create the Anima class element, to assign the element's id just pass it as a string to the Anima 'name' property.
--- Notice that Anima params are an object --

const anima = new Anima({name: 'myID'});

-- METHODS & PROPS
@@Method switchAnimation()
You can create animations and switch between them using switchAnimation() method or just using object assignment
An example could be :

animated.switchAnimation(idle);
or : anima.animation = idle;


The main difference and advantage of using switchAnimation method over object assignment is that the method gives us the possibility to change animation after some condition met, just passing it in a second argument. 
  also we can add a callback function as a third parameter that will execute before the animation change: 

const condition = frame.current > frame.max
animated.switchAnimation(animation, condition, callback)

also we can add a callback function as a third parameter that will execute before the animation change*/

const world = new World()
const walk = new Animation({
  name: 'walk',
  path: 'img',
  format: 'png',
})
const idle = new Animation({
  name: 'idle',
  path: 'img/',
  format: 'png',
})
const flip = new Animation({
  name: 'flip',
  path: 'img/',
  format: 'png',
})


const Animations = [idle, walk, flip]
