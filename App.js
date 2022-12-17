
let loaded = false

/*const c = ID('game')
const ctx = c.getContext('2d')
c.style.border = '1px solid #000'*/

const animatedSprite = new Anima({});
const lo2 = new Anima({name :'sprite2',transform:new Transform({x:200,scale:-1})});

let iAn= 0

const elements = [animatedSprite,lo2]

let selected = animatedSprite;
let frameOption = ['FPS','MAX','MIN','STEP']
let I = 0
let frameProp = frameOption[I]
let framePropInt = selected.frame.rate

Animations.forEach((anim, index, a) => {
  if (!anim.lengthSet) {
    anim.anim_length()

  }
  
  console.log(loaded)
})
function update(){
    RAF(update)


elements.forEach((el)=>{

 el.animate();

})
if (loaded) {

 frameProp = frameOption[I]

 switch (frameProp) {
   case 'FPS':
     framePropInt = selected.frame.rate
     break;
   case 'MAX':
     framePropInt = selected.frame.max
     break;
   case 'MIN':
     framePropInt = selected.frame.min
     break;
   case 'STEP':
     framePropInt = selected.frame.step
     break;
 
 }
 
 if (selected.state_changed === true) {
   changeBtn(btncontrollers,btnstate)
 }

 ID('AnimMonitor').innerHTML = 
 `<strong>ELEMENT:</strong> ${selected.element.id}<br>
 <strong>NAME:</strong> ${selected.animation.name}<br> 
 <strong>PREV:</strong> ${selected.prev_anim.name}<br> 
 <strong>NEXT:</strong> ${selected.next_anim.name}<br> 
 <strong>STATE:</strong> ${selected.state}<br> 
 <strong>CYCLE:</strong> ${selected.cycle}<br> 
 <strong>LAP:</strong>  ${selected.frame.lap}
 <strong>FRAME:</strong>  ${selected.frame.current}`

  $('#framerate p').innerHTML = `${framePropInt}`
  $('.frame-options').innerHTML = `${frameProp} :`
}
}

const btnstate = [$('.play'),$('.stop')]
const btncontrollers = [ $('.forward'),$('.reverse'),$('.loop-forward'),$('.loop-reverse'),$('.loop-pingpong') ]


EV(window,'load',update)

elements.forEach((el)=>{
  EV(el.element,'touchstart',()=>{
    selected.element.style.border = 'none'
    selected = el;
    el.element.style.border = '2px solid #288ACFC2'
    selected.state_changed = true
  })
})
btnstate.forEach((btn) => {
EV(btn,'touchstart',(e)=>{
  e.target.className === 'stop' ?
    selected.stop():
    selected.play()
  })})

btncontrollers.forEach((btn)=>{

EV(btn,'touchstart', (e) => {
  selected.loop(e.target.className)
})
})
EV(ID('idle'),'touchstart',()=>{selected.setAnimation(idle)})
EV(ID('walk'),'touchstart',()=>{
  selected.setAnimation(walk)
  selected.controls.move = true
})
EV(ID('walk'),'touchend',()=>{
  selected.setAnimation(idle)

})
EV(ID('left'),'touchstart',()=>{
  selected.controls.left = true
  selected.transform.scale === 1?
  selected.setAnimation(flip):
  selected.setAnimation(walk)

})
EV(ID('left'),'touchend',()=>{
  selected.setAnimation(idle)
selected.controls.left = false

})
EV(ID('right'),'touchstart',()=>{
    
selected.controls.right = true

  selected.transform.scale < 1?
  selected.setAnimation(flip):
  selected.setAnimation(walk)
})
EV(ID('right'),'touchend',()=>{
  selected.setAnimation(idle)
selected.controls.right = false

})
EV(ID('flip'),'touchstart',()=>{
  selected.setAnimation(flip)})

EV($('.frame-options'),'touchstart',()=>{
  I < frameOption.length-1 ?
  I ++ : I = 0
  
})

EV($('.plusfrr'), 'touchstart', () => {
  
  switch (frameProp) {
    case 'FPS':
    selected.frame.rate < 60?
    selected.frame.rate +=1 :
    selected.frame.rate = 0
    break;
    case 'MAX':
    selected.frame.max < selected.animation.frames?
    selected.frame.max += 1 :
    selected.frame.max = selected.animation.frames

    break;
    case 'MIN':
    selected.frame.min < selected.frame.max?
    selected.frame.min += 1 :
    selected.frame.min = selected.frame.max

    break;
    case 'STEP':
    selected.frame.step += 1
    break;
  }
})
EV($('.minusfrr'), 'touchstart', () => {
  switch (frameProp) {
    case 'FPS':
    selected.frame.rate > 0?
    selected.frame.rate -= 1 :
    selected.frame.rate = 60
    break;
    case 'MAX':
    selected.frame.max > selected.animation.start?
    selected.frame.max -= 1 :
    selected.frame.max = selected.animation.start

    break;
    case 'MIN':
    selected.frame.min > selected.animation.start?
    selected.frame.min -= 1 :
    selected.frame.min = selected.animation.start

    break;
    case 'STEP':
    selected.frame.step -= 1
    break;
  }

})
