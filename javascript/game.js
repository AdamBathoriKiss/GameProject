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


//Pictures for the Characters

const imageOfCharacter = new Image();
imageOfCharacter.src = 'img/ninjacat.png';

const enemyPic = new Image();
enemyPic.src = 'img/alien.png';

//Create the Character's class, where from able to create the Cat and the Aliens.

class Character {
    constructor(x,y,charimage) {
        this.x = x;
        this.y = y;
        this.speed = 5;
        this.charimage = charimage;
      
    }
   moveRight(){
     this.x -= 3;
   }
      drawing() { 
        ctx.drawImage(this.charimage, this.x, this.y, 90, 90);
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 10;
       
      }
      newPos(){
       if(this.x !== 260){
        this.x -= this.speed;
        }
      
      }
}


//Creating the CharCat for cat, because it will contains extra features

class CharCat extends Character {

  constructor(x,y,charimage,bullMaker){
      super(x,y,charimage);
      this.charimage = charimage;
      this.width = 90;
      this.height = 90;
      charimage.addEventListener('load', () => {
        this.charimage = charimage;
        this.drawing();
      });
      this.bullMaker = bullMaker;
      document.addEventListener('keydown',this.keydown);
        document.addEventListener('keyup',this.keyup);  
      
  }

  keydown = (e) =>{
    if(e.code === 'ArrowUp' ){
      this.upPress = true;
    }
    if(e.code === 'ArrowDown'){
      this.downPress = true;
    }
    if(e.code === 'Space'){
      this.shootPress = true;
    }

  };

  keyup = (e) => {

    if(e.code === 'ArrowUp'){
      this.upPress = false;
    }
    if(e.code === 'ArrowDown'){
      this.downPress = false;
    }
    if(e.code === 'Space'){
      this.shootPress = false;
    }

  };

 moveRight(){
   this.x -= 3;
 }

    drawing() { 
      this.move();
      ctx.drawImage(this.charimage, this.x, this.y, this.width, this.height);
      ctx.shadowColor = 'black';
      ctx.shadowBlur = 10;
      this.shoot();
       
    }

    shoot() {

      if(this.shootPress){
        
        const speed = 8;
        const delay = 25;
        const damage = 20;
        const bulletX = this.x;
        const bulletY = this.y + this.height/2;
        this.bullMaker.shoot(bulletX,bulletY,speed,damage,delay);
      }
    }
    move(){

      if(this.upPress && this.y !== 0){
        this.y -= this.speed;
      } 
      if(this.downPress && this.y !== 700){
        this.y += this.speed;
      }
     }

}

// The Ball

class Bullet {
  constructor(x,y,speed,damage){
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.damage = damage;
    this.width = 10;
    this.height = 10;
    this.color = 'black';
  }
    draw(ctx){

      ctx.fillStlye = this.color;
      this.x += this.speed;
      ctx.fillRect(this.x,this.y,this.width,this.height);
    }

    collWith(sprite){
      if(
        this.x < sprite.x + sprite.width &&
        this.x + this.width > sprite.x &&
        this.y < sprite.y + sprite.height &&
        this.y + this.height > sprite.y
      ) {
        sprite.doDamage(this.damage);
        return true;
      }
      return false;
    }

}

// Bullet Controller creation

class BulletControl {
  bullets = [];
  delayTimer = 0;
  constructor(canvas) {
    this.canvas = canvas;
  }

  shoot(bulletX,bulletY,speed,damage,delay){
    if(this.delayTimer <= 0){
      this.bullets.push(new Bullet(bulletX,bulletY,speed,damage));
      this.delayTimer = delay;
    }

    this.delayTimer --;
  }

  draw(ctx){
    
    this.bullets.forEach((bullet) =>{ 
      

      if(this.bullOff(bullet)){
        const index = this.bullets.indexOf(bullet);
        this.bullets.splice(index,1);
      }
      bullet.draw(ctx);
    });
  }

  collWith(sprite){
    return this.bullets.some(bullet => {
      if(bullet.collWith(sprite)){
        this.bullets.splice(this.bullets.indexOf(bullet),1);
        return true;
      }
      return false;
    })

  }

  bullOff(bullet){
    return bullet.x <= -bullet.width;
  }

}


// Aliens class 

class Aliens extends Character {

  constructor(x,y,charimage,health){
    super(x,y,charimage);
    this.health = health;
    this.width = 90;
    this.height = 90;
    
  }

   drawing(){
    ctx.drawImage(this.charimage, this.x, this.y, this.width, this.height);
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.font = '25px Arial';
    ctx.fillText(this.health,this.x+this.width / 2, this.y+this.height+20);
   } 

   doDamage(damage){
      this.health -= damage;
   }

   stop(){

   }
}





// Creating the enemy characters 

function creatingEnemy (){
  for(let i = 0; i < enemy.length; i++){
    enemy[i].moveRight();
    enemy[i].drawing();
  
  }
  if(frame % 200 === 0){
    const enemyY = Math.floor(Math.random()*750);
    enemy.push(new Aliens(1400,enemyY,enemyPic,100));
    
  }
    enemy.forEach((en) => {
      if(bullMaker.collWith(en)){
        if(en.health <= 0){
          const index = enemy.indexOf(en);
          enemy.splice(index,1);
        }
      }
    });
  };
  

  // Instances of Classes

const bullMaker = new BulletControl(canvas);
const cat =  new CharCat(200,350,imageOfCharacter,bullMaker);



// Update Canvas function, where we put all the things, what should works dinamically on our page

function updateCanvas() {
  ctx.clearRect(0, 0, 1400, 800);
  drawLine();
  bullMaker.draw(ctx);
  cat.drawing();
  frame++;
  creatingEnemy ();
  
  
}


setInterval(updateCanvas, 1000/70);


  



