// Youtube link: https://youtu.be/7LfqOjjz04w

let serialPDM; 
let camera;
let spr;
let keys = [];
let JUMP = 10;
let Gravity = 10;
let memoriesCollected = 0;
let isFalling = false;
let gameState = "start";
let platformsCreated = false;
let house;
let portName = "COM3";

let platforms;
let corgiJump;
let corgiWalk;
let corgiIdle;
let memories;
let keyImg;
let mem1Disabled = false;
let mem2Disabled = false;
let mem3Disabled = false;
let text1 = false;
let text2 = false;
let text3 = false;
let data1 = false;
let data2 = false;
let data3 = false;

let sounds = new Tone.Players({
  'pickup': 'media/pickup.wav',
  'start': 'media/gameStart.mp3',
  'win': 'media/win.wav'
  
});





const AmSynth = new Tone.AMSynth().toDestination();


const AmLoop = new Tone.Loop(time => {
  AmSynth.triggerAttackRelease("G1", "8n", time);
}, "4n")




const synth = new Tone.Synth().toDestination();
const seq = new Tone.Sequence((time, note) => {
	synth.triggerAttackRelease(note, 0.1, time);
}, ["F3", ["G3", "F3", "E3"], "C4", ["F3", "G4"], ["D4","C4"]]).start(0);

const dist = new Tone.Distortion(0.8).toDestination();
const distSynth = new Tone.Synth().connect(dist).toDestination();
const synthLoop = new Tone.Loop(time => {
  distSynth.triggerAttackRelease("A1", "8n", time);
}, "4n")
distSynth.volume.value = -6;


function preload(){
  corgiJump = loadSpriteSheet("media/jump.png",153.273,90,11);
  loadAnimation(corgiJump);
  corgiWalk = loadSpriteSheet("media/walk.png",153.625,80,8);
  loadAnimation(corgiWalk);
  corgiIdle = loadSpriteSheet("media/idle.png",152,80,5);
  loadAnimation(corgiIdle);
  forest = loadImage("media/forest.png");
  keyImg = loadImage('media/key.png');
  house = loadImage("media/house.jpg");
  platforms = new Group();
  memories = new Group();
  
  
}

function setup() {
  
  createCanvas(windowWidth - 30 , windowHeight-5);
  
  spr = createSprite(windowWidth/3+ 30, windowHeight- 20, 100, 90);
   spr.addAnimation("jump", corgiJump);
   spr.addAnimation("walk", corgiWalk);
   spr.addAnimation("idle", corgiIdle);
  spr.friction = 0.3;

  border_color = color(90, 0, 190);
  drawBoundaries(32, "offscreen", "visible");

  serialPDM = new PDMSerial(portName);
  sensor = serialPDM.sensorData;
  
  sounds.toDestination();

  end = createSprite(windowWidth-30, windowHeight, 60, windowHeight/3);
  end.shapeColor = color("red");
  console.log(windowWidth/8)
}

function draw(){
  if(gameState == "start"){
    background(forest);
    textSize(64);
    text('HOMEBOUND\n', windowWidth/2 - 270, windowHeight/2);
    text('click anywhere to start', windowWidth/2- 375, windowHeight/2+ 100);

  }
  if(mouseIsPressed && gameState == "start"){
    gameState = "playing";
    sounds.player('start').start();
    Tone.Transport.start();
    Tone.Transport.bpm.value = 72;
    seq.start();
    synthLoop.start(0);
    AmLoop.start("8n");
  }
  if(gameState == "playing"){
  background(forest);
  textSize(32);
  text('Memories collected: ' + memoriesCollected, 20, 30);

  frameRate(30);
  
  if(memoriesCollected === 3 && text3 == false){
    text("You found all memories! Head to the exit bottom right.", windowWidth/2 - 275, windowHeight/3)
    end.shapeColor = color("green");
    if(data3 === false){
      sendData();
      data3 = true;
    }
    setTimeout(() => {
      text3 = true;
    }, "1500")
  }
  if(memoriesCollected === 1 && text1 == false){
    text("You found a memory! 2 to go!", windowWidth/2 - 225, windowHeight/3)
    if(data1 === false){
      sendData();
      data1 = true;
    }
    
    setTimeout(() => {
      text1 = true;
    }, "1500")
  }
  if(memoriesCollected === 2 && text2 == false){
    text("You found 2 memories! 1 More.", windowWidth/2 - 225, windowHeight/3)
    if(data2 === false){
      sendData();
      data2 = true;
    }
    setTimeout(() => {
      text2 = true;
    }, "1500")
  }
  

  if(memoriesCollected === 3 && spr.overlap(end)){
    gameState = "end";
    sounds.player('win').start();

  }
  


  if(platformsCreated == false){
    createPlatforms();
  }
  createMemories();
  if(!keyIsPressed){
    spr.changeAnimation("idle");
  }
  if(isFalling){
    spr.velocity.y += Gravity;
    console.log(isFalling);
  }

  spr.collide(platforms, setFalling);
  spr.overlap(memories, getMemories );

  
  

  spr.collide(border_screen);

  if(sensor.button1 == 1 ){
    spr.addSpeed(7, 180);
    spr.changeAnimation("walk");
    spr.mirrorX(-1);
  }
  if(sensor.button2 == 1 ){
    spr.addSpeed(10,270);
    spr.changeAnimation("jump");
    setTimeout(() => {
      isFalling = true;
    }, "550")
  }
  if(sensor.button3 == 1 ){
    spr.addSpeed(7, 90);
  }
  if(sensor.button4 == 1 ){
    spr.addSpeed(7, 0);
    spr.changeAnimation("walk");
    spr.mirrorX(1);
  }





  keyboardControls();
  
  drawSprites();
  }
  if(gameState === "end"){
    seq.stop();
    AmLoop.stop();
    synthLoop.stop();
    background(house);
    textSize(64);
    text("Congratulations!\n", windowWidth/2 - 270, windowHeight/2);
    text('You helped the dog find its way home', windowWidth/2- 475, windowHeight/2+ 100);
    
  }
  
}

function keyboardControls() {
  if (keyIsDown(LEFT_ARROW)) {
    spr.addSpeed(7, 180);
    spr.changeAnimation("walk");
    spr.mirrorX(-1);
  }
  if (keyIsDown(RIGHT_ARROW)) {spr.addSpeed(7, 0);
    spr.changeAnimation("walk");
    spr.mirrorX(1);  }
  if (keyIsDown(UP_ARROW) && isFalling == false) {
    spr.addSpeed(10,270);
    spr.changeAnimation("jump");
    setTimeout(() => {
      isFalling = true;
    }, "550")
    }
  if (keyIsDown(DOWN_ARROW)) {spr.addSpeed(7, 90);}
}

function drawBoundaries(_t, _n, _v) {
  let bt, bb, bl, br, onscreen;

  switch (_n) {
    case "onscreen":
      onscreen = true;
      break;
    case "offscreen":
      onscreen = false;
      break;
  }

  switch (_v) {
    case "visible":
      vis = true;
      break;
    case "invisible":
      vis = false;
      break;
  }

  border_screen = new Group();
  if (onscreen) {nudge = 0;} else {nudge = _t;}

  bt = createSprite(width / 2, _t / 2 - nudge, width, _t);
  bb = createSprite(width / 2, height + -_t / 2 + nudge, width, _t);
  bl = createSprite(_t / 2 - nudge, height / 2, _t, height);
  br = createSprite(width - _t / 2 + nudge, height / 2, _t, height);

  border_screen.add(bt);
  border_screen.add(bb);
  border_screen.add(bl);
  border_screen.add(br);

  for (let i = 0; i < border_screen.length; i++) {
    border_screen[i].immovable = true;
    border_screen[i].shapeColor = color(border_color);
    border_screen[i].visible = vis;
  }
}

function createPlatforms(){
  platform = createSprite(windowWidth/2, windowHeight, windowWidth, 20);
  platform.setCollider("rectangle");
  platform.shapeColor = color(34,139,34);
  platforms.add(platform);
  memoryPlatform1 = createSprite(0, 2.75*windowHeight/4, 1.5*windowWidth/4, 30)
  memoryPlatform1.shapeColor = color(150,75,0);
  platforms.add(memoryPlatform1);
  memoryPlatform2 = createSprite(0, windowHeight/4 + 30, 1.5*windowWidth/4, 30)
  memoryPlatform2.shapeColor = color(150,75,0);
  platforms.add(memoryPlatform2);
  memoryPlatform3 = createSprite(windowWidth , windowHeight/4 + 30, 1.5*windowWidth/4, 30)
  memoryPlatform3.shapeColor = color(150,75,0);
  platforms.add(memoryPlatform3);
  
  midTrunk = createSprite((windowWidth/2), 3.5*windowHeight/4, windowWidth/3, 30);
  midTrunk.shapeColor = color(150,75,0);
  platforms.add(midTrunk);
  topTrunk = createSprite((windowWidth/2), 2*windowHeight/4, windowWidth/3, 30);
  topTrunk.shapeColor = color(150,75,0);
  platforms.add(topTrunk);
  platformsCreated = true;
}
function setFalling(){
  isFalling = false;
}

function createMemories(){
  if(mem1Disabled == false){
    memory1 = createSprite(120, windowHeight/4 - 30, 64, 64)
    memory1.addImage(keyImg);
    memories.add(memory1);
    mem1Disabled = true;
  }
  if(mem2Disabled == false){
    memory2 = createSprite(windowWidth - 120, windowHeight/4 - 30, 64, 64)
    memory2.addImage(keyImg);
    memories.add(memory2);
    mem2Disabled = true;
  }
  if(mem3Disabled == false){
    memory3 = createSprite(windowWidth/2, 2*windowHeight/4 - 60, 64, 64)
    memory3.addImage(keyImg);
    memories.add(memory3);
    mem3Disabled = true;
  }
  

}
function getMemories(spr, memory){
  memory.remove();
  memoriesCollected += 1;
  sounds.player('pickup').start();
  
}

function sendData(){
  serialPDM.transmit('mem',memoriesCollected);
}