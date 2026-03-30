const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// FULL SCREEN CANVAS
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Resize support
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

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
    x: 100,
    y: 200,
    w: 60,
    h: 60,
    gravity: 0.6,
    lift: -12,
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
    bgMusic.play();
    gameRunning = true;
    gameLoop();
}

// Controls
function jump() {
    if (!gameRunning) return;
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
        let gap = 180;
        let top = Math.random() * (canvas.height - gap - 100);

        pipes.push({
            x: canvas.width,
            top: top,
            bottom: top + gap,
            passed: false   // ⭐ FIX
        });
    }

    pipes.forEach(pipe => {
        pipe.x -= 4;

        ctx.fillStyle = "lime";
        ctx.fillRect(pipe.x, 0, 60, pipe.top);
        ctx.fillRect(pipe.x, pipe.bottom, 60, canvas.height);

        // Collision
        if (
            player.x < pipe.x + 60 &&
            player.x + player.w > pipe.x &&
            (player.y < pipe.top || player.y + player.h > pipe.bottom)
        ) {
            gameOver();
        }

        // ✅ SCORE FIX
        if (!pipe.passed && pipe.x + 60 < player.x) {
            score++;
            pipe.passed = true;
        }
    });

    // Coins
    if (Math.random() < 0.02) {
        coins.push({
            x: canvas.width,
            y: Math.random() * (canvas.height - 50)
        });
    }

    coins.forEach((coin, i) => {
        coin.x -= 4;
        ctx.drawImage(coinImg, coin.x, coin.y, 35, 35);

        if (
            player.x < coin.x + 35 &&
            player.x + player.w > coin.x &&
            player.y < coin.y + 35 &&
            player.y + player.h > coin.y
        ) {
            coins.splice(i, 1);
            totalCoins++;
            coinSound.play();
        }
    });

    // UI
    ctx.fillStyle = "white";
    ctx.font = "25px Arial";
    ctx.fillText("Score: " + score, 20, 40);
    ctx.fillText("Coins: " + totalCoins, 20, 80);

    requestAnimationFrame(gameLoop);
}

// Game Over
function gameOver() {
    gameRunning = false;

    // Background music band
    bgMusic.pause();

    // 🔊 Game over sound fix
    overSound.currentTime = 0;
    overSound.play();

    // Coins save
    localStorage.setItem("coins", totalCoins);

    // Thoda delay taaki sound play ho jaye
    setTimeout(() => {
        alert("Game Over 💀\nScore: " + score + "\nCoins: " + totalCoins);
        location.reload();
    }, 500);
}
