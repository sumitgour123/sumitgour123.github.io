const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// ===== CANVAS =====
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ===== LOAD IMAGES =====
const tigerImg = new Image();
tigerImg.src = "tiger.png";

const bgImg = new Image();
bgImg.src = "background.jpg";

const coinImg = new Image();
coinImg.src = "coin.png";

// ===== AUDIO =====
const bgMusic = new Audio("music.mp3");
const jumpSound = new Audio("Jump.wav");
const gameOverSound = new Audio("over.mp3");
const coinSound = new Audio("coin.wav");

bgMusic.loop = true;
bgMusic.volume = 0.5;

// ===== BIRD (TIGER) =====
let bird = {
    x: 100,
    y: 200,
    width: 50,
    height: 50,
    velocity: 0,
    gravity: 0.6,
    lift: -12
};

// ===== GAME =====
let pipes = [];
let coins = [];
let score = 0;
let frame = 0;
let gameStarted = false;
let gameOver = false;

// ===== INPUT =====
function jump() {
    if (!gameStarted) {
        bgMusic.play();
        gameStarted = true;
    }

    if (!gameOver) {
        bird.velocity = bird.lift;
        jumpSound.currentTime = 0;
        jumpSound.play();
    }
}

document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

// ===== PIPES =====
const pipeWidth = 70;
const pipeGap = 180;
const pipeSpeed = 3;

function createPipe() {
    let minHeight = 60;
    let maxHeight = canvas.height - pipeGap - 60;

    let topHeight = Math.random() * (maxHeight - minHeight) + minHeight;

    pipes.push({
        x: canvas.width,
        top: topHeight,
        bottom: canvas.height - topHeight - pipeGap,
        passed: false
    });

    // Add coin in gap
    coins.push({
        x: canvas.width + pipeWidth / 2,
        y: topHeight + pipeGap / 2,
        size: 30,
        collected: false
    });
}

function updatePipes() {
    pipes.forEach(p => p.x -= pipeSpeed);
    coins.forEach(c => c.x -= pipeSpeed);

    pipes = pipes.filter(p => p.x + pipeWidth > 0);
    coins = coins.filter(c => c.x > 0);
}

function drawPipes() {
    ctx.fillStyle = "green";

    pipes.forEach(p => {
        ctx.fillRect(p.x, 0, pipeWidth, p.top);
        ctx.fillRect(p.x, canvas.height - p.bottom, pipeWidth, p.bottom);
    });
}

// ===== COINS =====
function drawCoins() {
    coins.forEach(c => {
        if (!c.collected) {
            ctx.drawImage(coinImg, c.x, c.y, c.size, c.size);
        }
    });
}

function checkCoinCollision() {
    coins.forEach(c => {
        if (!c.collected &&
            bird.x < c.x + c.size &&
            bird.x + bird.width > c.x &&
            bird.y < c.y + c.size &&
            bird.y + bird.height > c.y
        ) {
            c.collected = true;
            score += 5;
            coinSound.play();
        }
    });
}

// ===== BIRD =====
function updateBird() {
    bird.velocity += bird.gravity;
    bird.y += bird.velocity;
}

function drawBird() {
    ctx.drawImage(tigerImg, bird.x, bird.y, bird.width, bird.height);
}

// ===== SCORE =====
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "bold 30px Arial";
    ctx.fillText("Score: " + score, 20, 50);
}

// ===== COLLISION =====
function checkCollision() {
    if (bird.y < 0 || bird.y + bird.height > canvas.height) return true;

    for (let p of pipes) {
        if (
            bird.x < p.x + pipeWidth &&
            bird.x + bird.width > p.x &&
            (bird.y < p.top || bird.y + bird.height > canvas.height - p.bottom)
        ) {
            return true;
        }
    }

    return false;
}

// ===== GAME LOOP =====
function gameLoop() {
    frame++;

    ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);

    if (!gameOver) {
        updateBird();
        updatePipes();
        checkCoinCollision();

        if (frame % 90 === 0) createPipe();

        if (checkCollision()) {
            gameOver = true;
            bgMusic.pause();
            gameOverSound.play();

            setTimeout(() => {
                alert("Game Over! Score: " + score);
                location.reload();
            }, 500);
        }
    }

    drawPipes();
    drawCoins();
    drawBird();
    drawScore();

    requestAnimationFrame(gameLoop);
}

gameLoop();
