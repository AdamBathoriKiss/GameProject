// Reaching the created area of the game, and configure it
const canvas = document.getElementById('battleArea');
const ctx = canvas.getContext('2d');
canvas.width = 1600;
canvas.height = 805;

// Cat's line
function drawLine(){

  ctx.beginPath();
  ctx.moveTo(300,0);
  ctx.lineTo(300,806);
  ctx.closePath();
  ctx.strokeStyle ='black';
  ctx.lineWidth = 8;
  ctx.stroke();
}

// Score drawing

function drawScore(){
  ctx.font = '25px Arial';
  ctx.fillText(`Score: ${score}`,20,40);
  
}

let game = setInterval(updateCanvas, 1000/ 65);

// Gamestarting method 

const startButton = document.getElementById('startButton');
startButton.onclick = function () {

  document.getElementById("landingPage").style.zIndex = "0";
  clearInterval(game);
  game = setInterval(updateCanvas, 1000/ 65);
  music.play();
}





// Few global variables 

let frame = 0;
let score = 0;
let enemy = [];
let shoot = [];
let boss = [];

//Pictures for the Characters

const imageOfCharacter = new Image();
imageOfCharacter.src = 'img/ninjacat.png';

const enemyPic = new Image();
enemyPic.src = 'img/alien.png';

const herring = new Image();
herring.src = 'img/herringbone.png';

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
        const delay = 7;
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
      ctx.fillStyle = 'black';
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

  constructor(x,y,width,height,charimage,health){
    super(x,y,charimage);
    this.health = health;
    this.width = width;
    this.height = height;
    
  }

   drawing(){
    ctx.drawImage(this.charimage, this.x, this.y, this.width, this.height);
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.font = '25px Arial';
    ctx.fillText(this.health,this.x + 20, this.y+this.height+20);
   } 

   doDamage(damage){
      this.health -= damage;
      if(this.health === 0){
        score++;
      }
   }

   alienWin(){
    if(this.x === 260){
   
      clearInterval(game);
      ctx.font = '55px Arial';
      ctx.fillText(`Game Over! Your score: ${score}`,450,350);
      
    } 
     }

   }
  

// Creating the Aliens 

function creatingEnemy (){
  for(let i = 0; i < enemy.length; i++){
    enemy[i].moveRight();
    enemy[i].drawing();
    enemy[i].alienWin();
   
  }
  if(frame % 400 === 0){
    const enemyY = Math.floor(Math.random()*745);
    enemy.push(new Aliens(1400,enemyY,90,90,enemyPic,100));
    
  }

  enemy.forEach((en) => {
    if(bullMaker.collWith(en)){
      if(en.health <= 0){
        const index = enemy.indexOf(en);
        enemy.splice(index,1);
      }
    }
  });


    for(let x = 0; x <boss.length ; x++){
      boss[x].moveRight();
      boss[x].drawing();
      boss[x].alienWin();
    }

    if(frame % 400 === 0 && score >= 25){
      const bossCreator = Math.floor((Math.random()*745));
      boss.push(new Aliens(1600,bossCreator,100,100,enemyPic,150));
    }


    boss.forEach((bo) => {
      if(bullMaker.collWith(bo)){
        if(bo.health <= 0){
          const index = boss.indexOf(bo);
          boss.splice(index,1);
        }
      }
    });

  

  };



  // Level's pop-up message

  function scoreMess() {
    switch (score){
    case 10: 
    const lvl2 = 'Level 2... Fight!';
    return lvl2;
    
    case 25:
    const lvl3 = 'Level 3... Fight!';  
    return lvl3;
    
    case 40:
      const lvl4 = 'Level 4... Fight!';  
    return lvl4;

    case 60:
      const lvl5 = 'Final Fight!';  
    return lvl5;

    case 80:
      const win = `Excellent! You win! Your score: ${score}`;  
    return win;
    }

  }



  // Creating the levels for the game

  function levels(){
    switch (score){
      case 10 :
      clearInterval(game);
      ctx.font = '55px Arial';
      ctx.fillText(scoreMess(),650,350);
      game = setInterval(updateCanvas, 1000/70);
      break;
      case 25 :
        clearInterval(game);
        ctx.font = '55px Arial';
        ctx.fillText(scoreMess(),650,350);
        game = setInterval(updateCanvas, 1000/70);
        break;
      case 40 :
        clearInterval(game);
        ctx.font = '55px Arial';
        ctx.fillText(scoreMess(),650,350);
        game = setInterval(updateCanvas, 1000/70);
        break;
      case 60:
        clearInterval(game);
        ctx.font = '55px Arial';
        ctx.fillText(scoreMess(),650,350);
        game = setInterval(updateCanvas, 1000/70);
        break;
      case 80:
        clearInterval(game);
        ctx.font = '55px Arial';
        ctx.fillText(scoreMess(),300,350);
        break;
    }
  }



  // Instances of Classes

const bullMaker = new BulletControl(canvas);
const cat =  new CharCat(200,350,imageOfCharacter,bullMaker);




  
// Sound

function backgroundsound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  this.sound.setAttribute('muted', 'muted');
  document.body.appendChild(this.sound);
  this.play = function(){
    this.sound.play();
  }
  this.stop = function(){
    this.sound.pause();
  }
}

let music = new backgroundsound('mortal.mp3');

  
// Update Canvas function, where we put all the things, what should works dinamically on our page

function updateCanvas() {
  ctx.clearRect(0, 0, 1600, 805);
  drawLine();
  bullMaker.draw(ctx); 
  cat.drawing();
  frame++;
  creatingEnemy ();
  drawScore();
  levels();
  
}


