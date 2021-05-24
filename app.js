let canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');

setCanvasGeometry(canvas);

window.addEventListener('resize', function(){
  setCanvasGeometry(canvas);
});

let cursorPosition = {
  x: null,
  y: null,
  leftKeyHolded: false
};

let frame = 0;

/* -------------------------------- */
/* Particles
/* -------------------------------- */
class Particle{
  constructor(){
    this.size = Math.random() * 20;
    // this.size = 10;
    
    /*
    this.x = Math.random() * (canvas.width - this.size);
    this.x = this.x < this.size ? this.size : this.x;

    this.y = Math.random() * (canvas.height - this.size);
    this.y = this.y < this.size ? this.size : this.y;
    */

    this.x = cursorPosition.x;
    this.y = cursorPosition.y;

    // this.speedX = Math.random() * 6 - 3;
    // this.speedY = Math.random() * 6 - 3;
    this.speedX = Math.random() * 10 - 5;
    this.speedY = Math.random() * 10 - 5;

    // this.color = getRandomColor();
    // this.color = 'white';
    this.color = `hsl(${frame}, 100%, 50%)`;

    this.outOfBounds = false;
  }

  updatePosition(){
    this.x += this.speedX;
    this.y += this.speedY;
  }

  checkDirection(){
    if(this.x + this.size >= canvas.width || this.x - this.size <= 0){
      this.speedX *= -1;
    }

    if(this.y + this.size >= canvas.height || this.y - this.size <= 0){
      this.speedY *= -1;
    }
  }

  draw(){
    this.decreaseSize();

    drawFilledCircle(
      {
        x: this.x, 
        y: this.y
      }, 
      this.size, 
      this.color
    );
  }

  checkLine(particlesArray){
    let self = {
      x: this.x,
      y: this.y,
      color: this.color
    };

    let linedParticle = null;

    particlesArray.forEach(function(particle){
      let dx = Math.abs(particle.x - self.x);
      let dy = Math.abs(particle.y - self.y);
      let distance = Math.sqrt(dx**2 + dy**2);

      if(distance < 100 && particle.color === self.color){
        // drawLine(particle, self);
        linedParticle = particle;
      }
    });

    return linedParticle;
  }

  decreaseSize(){
    if(this.size > 0.2){
      this.size -= .3;
    }
  }

  checkOutOfBounds(particlesArray, i){
    if(
      this.x + this.size < 0 ||
      this.x - this.size > canvas.width ||
      this.y + this.size < 0 ||
      this.y - this.size > canvas.height
    ){
      this.outOfBounds = true;
      return true;
    }
  }

  isDissapear(){
    if(this.size <= 0.3){
      return true;
    }
  }
}

let particlesArray = [];
// generateParticles(particlesArray, 10);

// console.log(particlesArray);

function generateParticles(particlesArray, quantity){
  for(let i = 0; i < quantity; i++){
    let particle = new Particle();
    particle.title = `Paricle-${i}`;
    particle.index = i;
    particlesArray.push(particle);
  }
}

function drawParticles(particlesArray){
  for(let i = 0; i < particlesArray.length; i++){
    let particle = particlesArray[i];

    

    if(particle.isDissapear()){
      particlesArray.splice(i, 1);
      i--;
    }

    particle.checkDirection();
    particle.updatePosition();

    let linedParticle = particle.checkLine(particlesArray);
    drawLine(particle, linedParticle, particle.color);

    particle.draw();

    /*
    if(particle.checkOutOfBounds(particlesArray)){
      removeParticlesFromOutOfBounds(particlesArray);
      i--;//фиксит моргание после удаления элемента из массива
    }
    */
  }
}

function removeDissapearingParticle(particlesArray){
  particlesArray.forEach(function(particle, i){
    if(particle.size <= 0.3){
      particlesArray.splice(i, 1);
    }
  });
}

function removeParticlesFromOutOfBounds(particlesArray){
  particlesArray.forEach(function(particle, i){
    if(particle.outOfBounds){
      particlesArray.splice(i, 1);
      // console.log(particlesArray.length);
    }
  });
}

function updateParticlesIndexes(particlesArray){
  particlesArray.forEach(function(particle, i){
    particle.index = i;
  });
}

/* -------------------------------- */
/* Animation loop
/* -------------------------------- */
let animationLoop = null;

animation();

function animation(){
  // console.log('frame');
  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  frame += 10;

  drawAnimation();

  animationLoop = requestAnimationFrame(animation);

  // if(particlesArray.length == 0){
  //   cancelAnimationFrame(animationLoop);
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   console.log('animation stopped');
  // }
}

function drawAnimation(){
  ctx.fillStyle = 'rgba(36,41,46,.3)';
  

  if(cursorPosition.leftKeyHolded){
    generateParticles(particlesArray, 7);
    
  }

  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineTo(cursorPosition.x, cursorPosition.y);
  ctx.stroke();

  drawFilledCircle({x: cursorPosition.x, y: cursorPosition.y}, 7.5 , `white`);
  
  drawParticles(particlesArray);
  
  ctx.lineWidth = 15;
  // ctx.strokeStyle = `hsl(${frame}, 100%, 50%)`;
  ctx.strokeStyle = `white`;

  ctx.beginPath();
  ctx.moveTo(cursorPosition.x, cursorPosition.y);
  
}

/* -------------------------------- */
/* Draw objects on click
/* -------------------------------- */

// canvas.addEventListener('click', function(e){
//   cursorPosition.x = e.x;
//   cursorPosition.y = e.y; 

//   generateParticles(particlesArray, 30);
// });

canvas.addEventListener('mousemove', function(e){
  cursorPosition.x = e.x;
  cursorPosition.y = e.y; 

  // generateParticles(particlesArray, 3);
});

canvas.addEventListener('mousedown', function(e){
  cursorPosition.x = e.x;
  cursorPosition.y = e.y; 

  if(e.button === 0){
    cursorPosition.leftKeyHolded = true;
  }
});

canvas.addEventListener('mouseup', function(e){
  cursorPosition.x = e.x;
  cursorPosition.y = e.y; 

  if(e.button === 0){
    cursorPosition.leftKeyHolded = false;
  }
});

// setInterval(function(){
//   if(
//     cursorPosition.x > 20 && 
//     cursorPosition.y > 20 &&
//     cursorPosition.x < canvas.width - 20 && 
//     cursorPosition.y < canvas.height - 20
//     ){
//     generateParticles(particlesArray, 30);
//     console.table(cursorPosition);
//   }
// }, 1000);

/*
function drawElements(){
  drawRect(cursorPosition, 50, 50, 'pink');
  drawBorderedRect(cursorPosition, 50, 50, 'red', 3);

  drawBorderedCircle(cursorPosition, 50, 'blue', 3);
  drawFilledCircle(cursorPosition, 30, 'green');
  drawFilledCircleWithBorder(cursorPosition, 50, 'orange', 'green', 3);
}
*/

/* --------------------------------- */
/* FUNCTIONS
/* --------------------------------- */
function getRandomColor(){
  let colors = [
    'green',
    'pink',
    'orange',
    'blue',
    'yellow'
  ];

  let randomColorIndex = Math.floor(Math.random() * colors.length);

  return colors[randomColorIndex];
}

function drawLine(start, end, color){
  if(start && end){
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
    ctx.closePath();
  }
}

function drawFilledCircleWithBorder(coords, radius, fillColor, borderColor, borderWidth){
  ctx.fillStyle = fillColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.beginPath();
  ctx.arc(coords.x, coords.y, radius, 0, Math.PI * 2); // arc(centerX, centerY, radius, startAngle, endAngle)
  ctx.stroke();
  ctx.fill();
}

function drawFilledCircle(coords, radius, fillColor){
  if(radius > 0){
    ctx.fillStyle = fillColor;
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBorderedCircle(coords, radius, borderColor, borderWidth){
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.beginPath();
  ctx.arc(coords.x, coords.y, radius, 0, Math.PI * 2);
  ctx.stroke();
}

function drawFilledRect(coords, w, h, fillColor){
  let horizontalCenter = coords.x - (w / 2);
  let verticalCenter = coords.y - (h / 2);

  ctx.fillStyle = fillColor;
  ctx.fillRect(horizontalCenter, verticalCenter, w, h);
}

function drawBorderedRect(coords, w, h, borderColor, borderWidth){
  let horizontalCenter = coords.x - (w / 2);
  let verticalCenter = coords.y - (h / 2);

  ctx.strokeStyle = borderColor;
  ctx.lineWidth = borderWidth;
  ctx.beginPath();
  ctx.strokeRect(horizontalCenter, verticalCenter, w, h);
  ctx.stroke();
}


function setCanvasGeometry(canvas){
  let canvasComputeStyle = getComputedStyle(canvas);

  canvas.width = window.innerWidth - (parseInt(canvasComputeStyle.borderRightWidth) + parseInt(canvasComputeStyle.borderLeftWidth));
  canvas.height = window.innerHeight - (parseInt(canvasComputeStyle.borderTopWidth) + parseInt(canvasComputeStyle.borderBottomWidth));
}