const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = 600;

// Assets
const playerImg = new Image();
playerImg.src = "tiger.png";

const coinImg = new Image();
coinImg.src = "coin.png";

const bgMusic = document.getElementById("bgMusic");
const jumpSound = document.getElementById("jumpSound");
const overSound = document.getElementById("overSound");
const coinSound = new Audio("coin.wav");

// Player
let player = {
    x: 50,
    y: 150,
    w: 50,
    h: 50,
    gravity: 0.6,
    lift: -10,
    velocity: 0
};

let pipes = [];
let coins = [];
let score = 0;
let totalCoins = localStorage.getItem("coins") || 0;
let gameRunning = false;

// Start Game
function startGame() {
    document.getElementById("startScreen").style.display = "none";
    canvas.style.display = "block";
    bgMusic.play();
    gameRunning = true;
    gameLoop();
}

// Controls
function jump() {
    player.velocity = player.lift;
    jumpSound.play();
}
document.addEventListener("keydown", jump);
document.addEventListener("touchstart", jump);

// Game Loop
function gameLoop() {
    if (!gameRunning) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Player physics
    player.velocity += player.gravity;
    player.y += player.velocity;

    ctx.drawImage(playerImg, player.x, player.y, player.w, player.h);

    // Pipes
    if (Math.random() < 0.02) {
        let top = Math.random() * 300;
        pipes.push({
            x: canvas.width,
            top: top,
            bottom: top + 150
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 3;

        ctx.fillStyle = "lime";
        ctx.fillRect(pipe.x, 0, 50, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 50, canvas.height);

        // Collision
        if (
            player.x < pipe.x + 50 &&
            player.x + player.w > pipe.x &&
            (player.y < pipe.top || player.y + player.h > pipe.bottom)
        ) {
            gameOver();
        }

        if (pipe.x === player.x) score++;
    });

    // Coins
    if (Math.random() < 0.02) {
        coins.push({
            x: canvas.width,
            y: Math.random() * 500
        });
    }

    coins.forEach((coin, index) => {
        coin.x -= 3;
        ctx.drawImage(coinImg, coin.x, coin.y, 30, 30);

        if (
            player.x < coin.x + 30 &&
            player.x + player.w > coin.x &&
            player.y < coin.y + 30 &&
            player.y + player.h > coin.y
        ) {
            coins.splice(index, 1);
            totalCoins++;
            coinSound.play();
        }
    });

    // UI
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
    ctx.fillText("Coins: " + totalCoins, 250, 25);

    requestAnimationFrame(gameLoop);
}

// Game Over
function gameOver() {
    gameRunning = false;
    bgMusic.pause();
    overSound.play();

    localStorage.setItem("coins", totalCoins);

    alert("Game Over 💀\nScore: " + score + "\nCoins: " + totalCoins);
    location.reload();
}
