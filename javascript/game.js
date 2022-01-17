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

  // Update Canvas function, where we put all the things, what should works dinamically on our page

  function updateCanvas() {
    ctx.clearRect(0, 0, 1400, 800);
    drawLine();
    cat.draw();
    enemy.draw();
    enemy.newPos();
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
        charimage.addEventListener('load', () => {
          this.charimage = charimage;
          this.draw();
        })
    }

    moveUp() {
      this.y -= 25;
    }
    moveDown() {
      this.y += 25;
    }

    moveRight() {
      this.x -= 10;
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


class CharCat extends Character {

  constructor(x,y,charimage,bullcont){
      super(x,y,charimage);
      
  }
  

}

// Creating the cat Character

const cat =  new Character(200,350,imageOfCharacter);



// Configure the movement of the Cat

document.addEventListener('keydown', e => {

  if(e.keyCode === 38 && cat.y !== 0){
    cat.moveUp();
  }
  else if(e.keyCode === 40 && cat.y !== 700){

    cat.moveDown();
  }

  
});

// Creating the Shooting of the Cat


// Creating the enemy characters 


  const enemyY = Math.floor(Math.random()*750);
  const enemy = new Character(1400,enemyY,enemyPic);






document.addEventListener('keydown', e => {

  if(e.keyCode === 13){

    enemy.speedX = 2;
     enemy.newPos();
    
    }
    
  });
 


  


