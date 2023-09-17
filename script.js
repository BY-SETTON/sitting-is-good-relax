const sprite = document.getElementById("sprite");
const triggerBlock = document.getElementById("trigger-block");
const coffee = document.getElementById("coffee");
const apple = document.getElementById("apple");
const remote = document.getElementById("remote");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const tempScoreElement = document.getElementById("tempScore");
const gameOver = document.getElementById("game-over-container");
const startGame = document.getElementById("start-game-container");
const startButton = document.getElementById("start-button");
const retryButton = document.getElementById("retry-button");
const muteButton = document.getElementById("mute-button");
const backgroundMusic = document.getElementById("backgroundMusic");

// game controls
let gameStarted = false;

// score
let tempScore = 0;
let score = 0;
let collectedApple = false;
let collectedCoffee = false;
let collectedRemote = false;

// Collide triggered
let collided = false;

// player can move
let canPlayerMove = true;

// Initial position
let x = 225;
let y = 225;

const roomWidth = 500; // Adjust room dimensions as needed
const roomHeight = 500;

// Initial trigger block position
let triggerX = 300; // Adjust initial trigger block position as needed
let triggerY = 300;

sprite.style.left = x + "px";
sprite.style.top = y + "px";
triggerBlock.style.left = triggerX + "px";
triggerBlock.style.top = triggerY + "px";

// Flags to track movement
let movingUp = false;
let movingDown = false;
let movingLeft = false;
let movingRight = false;

let pausedTimer = false;
let timer = 10;
let timerInterval;

randomPosition(remote);
randomPosition(apple);
randomPosition(coffee);

function randomPosition(element) {
  triggerX = Math.floor(Math.random() * (roomWidth - element.style.width));
  triggerY = Math.floor(Math.random() * (roomHeight - element.style.height));

  element.style.left = triggerX + "px";
  element.style.top = triggerY + "px";
}

function removeAllDirectionClasses() {
  sprite.classList.remove("up-right");
  sprite.classList.remove("up-left");
  sprite.classList.remove("down-right");
  sprite.classList.remove("down-left");
  sprite.classList.remove("down");
  sprite.classList.remove("up");
  sprite.classList.remove("right");
  sprite.classList.remove("left");

}

function changeDirection() {
  if (movingLeft) {
    removeAllDirectionClasses();
    sprite.classList.add("left");
  }
  if (movingRight) {
    removeAllDirectionClasses();
    sprite.classList.add("right");
  }
  if (movingUp) {
    removeAllDirectionClasses();
    sprite.classList.add("up");

    if (movingRight) {
      removeAllDirectionClasses();
      sprite.classList.add("up-right");
    }

    if (movingLeft) {
      removeAllDirectionClasses();
      sprite.classList.add("up-left");
    }
  }
  if (movingDown) {
    removeAllDirectionClasses();

    sprite.classList.add("down");

    if (movingRight) {
      removeAllDirectionClasses();
      sprite.classList.add("down-right");
    }
    if (movingLeft) {
      removeAllDirectionClasses();
      sprite.classList.add("down-left");
    }
  }
}

// Define a function to move the block
function moveBlock(event) {
  if (!gameStarted) {
    return;
  }
  if (!canPlayerMove) {
    return;
  }
  const step = 8; // Adjust the step size as needed
  // Check for diagonal movement
  if ((movingUp && movingRight) || (movingUp && movingLeft) || (movingDown && movingRight) || (movingDown && movingLeft)) {
    const diagonalStep = Math.sqrt(2) * (step / 2); // Adjust for diagonal movement
    x += (movingLeft ? -1 : 1) * diagonalStep;
    y += (movingUp ? -1 : 1) * diagonalStep;
  } else {

    switch (event.key) {
      case "ArrowUp":
        y -= step;
        movingUp = true;
        break;
      case "ArrowDown":
        y += step;
        movingDown = true;
        break;
      case "ArrowLeft":
        x -= step;
        movingLeft = true;
        break;
      case "ArrowRight":
        x += step;
        movingRight = true;
        break;
    }
  }

  changeDirection();

  // Update the block's position
  sprite.style.left = x + "px";
  sprite.style.top = y + "px";

  // Check for collision with the trigger block
  if (checkCollision(sprite, triggerBlock)) {
    // Call your function when a collision occurs
    addToTempScore(1);
    handleCollision();
  }
  if (checkCollision(sprite, apple)) {
    // Call your function when a collision occurs
    if (collectedApple) return;
    collectedApple = true;
    addToTempScore(2);
    addItem(apple);
  }
  if (checkCollision(sprite, coffee)) {
    // Call your function when a collision occurs
    if (collectedCoffee) return;
    collectedCoffee = true;
    addToTempScore(3);
    addItem(coffee);
  }
  if (checkCollision(sprite, remote)) {
    if (collectedRemote) return;
    collectedRemote = true;
    addToTempScore(4);
    // Call your function when a collision occurs
    addItem(remote);
  }
}

// Define a function to check collision between two elements
function checkCollision(element1, element2) {
  const rect1 = element1.getBoundingClientRect();
  const rect2 = element2.getBoundingClientRect();

  return (rect1.left < rect2.right && rect1.right > rect2.left && rect1.top < rect2.bottom && rect1.bottom > rect2.top);
}

// Function to handle the collision
function handleCollision() {
  collided = true;
  canPlayerMove = false;
  sprite.style.display = 'none';
  triggerBlock.setAttribute("src", "sitting_couch.png");
  pausedTimer = true;
  timer = 10;

  addToScore(tempScore);
  setTimeout(() => {
    collectedRemote = false;
    collectedApple = false;
    collectedCoffee = false;
    pausedTimer = false;
    sprite.style.display = 'block';
    triggerBlock.setAttribute("src", "empty_couch.png");

    if (collided) {
      collided = false;
    } else {
      return;
    }

    canPlayerMove = true;

    randomPosition(triggerBlock);
    randomPosition(coffee);
    randomPosition(apple);
    randomPosition(remote);

  }, 2000)
  // Add your custom logic here when a collision occurs
}

function addItem(item) {
  item.style.position = 'relative'
  item.style.left = 0;
  item.style.top = 0;

}

// Define a function to stop movement when a key is released
function stopMove(event) {
  switch (event.key) {
    case "ArrowUp":
      movingUp = false;
      break;
    case "ArrowDown":
      movingDown = false;
      break;
    case "ArrowLeft":
      movingLeft = false;
      break;
    case "ArrowRight":
      movingRight = false;
      break;
  }
}

function start() {
  startGame.style.display = 'none';
  gameStarted = true;
  const backgroundMusic = document.getElementById("backgroundMusic");
  backgroundMusic.play();
}

function retry() {
  score = 0;
  tempScore = 0;
  collectedRemote = false;
  collectedApple = false;
  collectedCoffee = false;
  addToScore();
  addToTempScore(0);
  randomPosition(remote);
  randomPosition(apple);
  randomPosition(coffee);
  pausedTimer = false;
  canPlayerMove = true;
  timer = 10;
  gameOver.style.display = 'none';
}

function addToScore() {
  score = score + tempScore;
  scoreElement.textContent = `TOTAL: ${score}`;
  tempScore = 0;
  addToTempScore(0);
}

function addToTempScore(amount) {
  tempScore = tempScore + amount;
  tempScoreElement.textContent = `Collected points: ${tempScore}`;
}

function mute() {
  const backgroundMusic = document.getElementById("backgroundMusic");
  backgroundMusic.mute();
}

timerInterval = setInterval(() => {
  if (!gameStarted) {
    return;
  }
  if (pausedTimer) {
    return;
  }

  timer--;
  if (timer <= 0) {
    canPlayerMove = false
    gameOver.style.display = 'flex';
    pausedTimer = true;
    tempScore = 0;
  }
  timerElement.textContent = `TIME: ${timer}s`;
}, 1000);

// Add event listeners for keyboard input
document.addEventListener("keydown", moveBlock);
document.addEventListener("keyup", stopMove);
retryButton.addEventListener("click", retry);
startButton.addEventListener("click", start);
// muteButton.addEventListener("click", mute);
muteButton.addEventListener("click", function () {
  const backgroundMusic = document.getElementById("backgroundMusic");

  if (backgroundMusic.paused) {
    backgroundMusic.play();
    muteButton.textContent = "🔊";
  } else {
    backgroundMusic.pause();
    muteButton.textContent = "🔇";
  }
});

