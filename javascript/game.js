// Reach the created area of the game, and configure it
const canvas = document.getElementById('battleArea');
const ctx = canvas.getContext('2d');

canvas.width = 1400;
canvas.height = 800;

function drawLine(){

  ctx.beginPath();
  ctx.moveTo(300,0);
  ctx.lineTo(300,800);
  ctx.closePath();
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 12;
  ctx.stroke();
}


// Few global variables 

let frame = 0;
let score = 0;
let enemy = [];
let shoot = [];


// Update Canvas function, where we put all the things, what should works dinamically on our page

  function updateCanvas() {
    ctx.clearRect(0, 0, 1400, 800);
    drawLine();
    cat.draw();
    frame++;
    creatingEnemy ();
 
  }


setInterval(updateCanvas, 1000/60);


//Pictures for the game

const imageOfCharacter = new Image();
imageOfCharacter.src = 'img/ninjacat.png';

const enemyPic = new Image();
enemyPic.src = 'img/alien.png';

//Create the Character's class, where from able to create the Cat and the Cucumbers.

class Character {
    constructor(x,y,charimage) {
        this.x = x;
        this.y = y;
        this.speedX = 0;
        this.charimage = charimage;
    }

    moveUp() {
      this.y -= 25;
    }
    moveDown() {
      this.y += 25;
    }

    moveRight() {
      this.x -= 2;
    }

      draw() { 
        ctx.drawImage(this.charimage, this.x, this.y, 90, 90);
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
       
      }

      newPos(){
       if(this.x !== 260){
        this.x -= this.speedX;
        }
      
      }
}

//Creating the CharCat for cat, because it will contains extra features

class CharCat extends Character {

  constructor(x,y,charimage){
      super(x,y,charimage);
      this.charimage = charimage;
      charimage.addEventListener('load', () => {
        this.charimage = charimage;
        this.draw();
      })
        
  }

}


// Shooting class for Cat

class Shooter {
  constructor(){
    this.x = cat.x + 35;
    this.y = cat.y + 40; 
    this.width = 10;
    this.height = 10;
    this.power = 20;
    this.speed = 2;
   
  }

  update(){
    this.x += this.speed;
  }
  
  draw (){ 
    ctx.fillStlye = 'black';
    ctx.beginPath();
    ctx.arc(this.x,this.y,this.width,0, Math.PI *2);
    ctx.closePath();
    ctx.fill();
  };

  
}

// Configure the movement of the Cat

document.addEventListener('keydown', e => {

  if(e.keyCode === 38 && cat.y !== 0){
    cat.moveUp();
  }
  else if(e.keyCode === 40 && cat.y !== 700){

    cat.moveDown();
  } else if(e.keyCode === 32){

    shoot.push(new Shooter(10,10));
   
    for(let i = 0; i < shoot.length; i++){
      
      checker = setInterval(function(){
        shoot[i].draw();
        shoot[i].update();
      
    }, 2);
    
  }
  
  }
 
});



// Creating the cat Character


const cat =  new CharCat(200,350,imageOfCharacter);
const shot = new Shooter(10,10);


// Creating the enemy characters 

function creatingEnemy (){
  for(let i = 0; i < enemy.length; i++){
    enemy[i].moveRight();
    enemy[i].draw();
  
  }
  if(frame % 200 === 0){
    const enemyY = Math.floor(Math.random()*750);
    enemy.push(new Character(1400,enemyY,enemyPic));
  }

  };
  

  



  



